"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireQueueMember } from "./fila-permissions";

type QueueAction =
  | "CALL"
  | "START"
  | "FINISH"
  | "CANCEL"
  | "NO_SHOW";

type Input = {
  entryId: string;
  action: QueueAction;
  professionalId?: string;
};

const allowedStatuses: Record<QueueAction, string> = {
  CALL: "WAITING",
  START: "CALLED",
  FINISH: "IN_SERVICE",
  CANCEL: "WAITING",
  NO_SHOW: "CALLED",
};

const MAX_RETRIES = 3;

function getPrismaErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Não foi possível realizar esta operação.";
  }

  if (
    error.message === "UNAUTHORIZED" ||
    error.message === "FORBIDDEN"
  ) {
    return "Você não possui permissão para realizar esta operação.";
  }

  return error.message;
}

export async function updateEntryStatusAction(input: Input) {
  try {
    const member = await requireQueueMember();

    if (
      !input.entryId ||
      !Object.prototype.hasOwnProperty.call(
        allowedStatuses,
        input.action
      )
    ) {
      return {
        success: false as const,
        message: "Operação inválida.",
      };
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            // 1. Busca a senha dentro do estabelecimento.
            const entry = await tx.queueEntry.findFirst({
              where: {
                id: input.entryId,
                businessId: member.businessId,
              },
              select: {
                id: true,
                status: true,
                professionalId: true,
                serviceId: true,
                queueDay: true,
                calledAt: true,
                startedAt: true,
                completedAt: true,
              },
            });

            if (!entry) {
              throw new Error("Cliente não encontrado.");
            }

            const professionalId =
              input.professionalId ?? entry.professionalId;

            // 2. Bloqueio por estabelecimento e profissional.
            // Utiliza o mesmo mecanismo do cron automático.
            if (professionalId) {
              const lockKey = `${member.businessId}:${professionalId}`;

              await tx.$queryRaw<Array<{ locked: string }>>`
                SELECT pg_advisory_xact_lock(
                  hashtext(${lockKey})
                )::text AS locked
              `;
            }

            // 3. Reconsulta o status após adquirir o bloqueio.
            const currentEntry = await tx.queueEntry.findFirst({
              where: {
                id: entry.id,
                businessId: member.businessId,
              },
              select: {
                status: true,
                professionalId: true,
              },
            });

            if (
              !currentEntry ||
              currentEntry.status !== allowedStatuses[input.action]
            ) {
              throw new Error(
                "O status deste cliente mudou. Atualize a fila."
              );
            }

            // 4. Chamar cliente ou iniciar atendimento.
            if (
              input.action === "CALL" ||
              input.action === "START"
            ) {
              if (!professionalId) {
                throw new Error(
                  "Selecione um profissional para este atendimento."
                );
              }

              // Verifica se o profissional está ativo.
              const professional = await tx.professional.findFirst({
                where: {
                  id: professionalId,
                  businessId: member.businessId,
                  active: true,
                },
                select: {
                  id: true,
                },
              });

              if (!professional) {
                throw new Error("Profissional indisponível.");
              }

              // Verifica se o profissional realiza o serviço.
              const professionalService =
                await tx.professionalService.findFirst({
                  where: {
                    professionalId,
                    serviceId: entry.serviceId,
                  },
                  select: {
                    professionalId: true,
                  },
                });

              if (!professionalService) {
                throw new Error(
                  "Este profissional não realiza o serviço selecionado."
                );
              }

              // Impede trocar o profissional de uma senha
              // que já possui profissional definido.
              if (
                entry.professionalId &&
                entry.professionalId !== professionalId
              ) {
                throw new Error(
                  "Este cliente está vinculado a outro profissional."
                );
              }

              // Impede chamar um novo cliente se o
              // profissional estiver ocupado.
              const busy = await tx.queueEntry.findFirst({
                where: {
                  businessId: member.businessId,
                  queueDay: entry.queueDay,
                  professionalId,
                  id: {
                    not: entry.id,
                  },
                  status: {
                    in: ["CALLED", "IN_SERVICE"],
                  },
                },
                select: {
                  id: true,
                },
              });

              if (busy) {
                throw new Error(
                  "Este profissional já possui um cliente chamado ou em atendimento."
                );
              }

              // 5. Chamar cliente.
              if (input.action === "CALL") {
                const settings = await tx.queueSettings.findUnique({
                  where: {
                    businessId: member.businessId,
                  },
                  select: {
                    callTimeoutMinutes: true,
                  },
                });

                const timeoutMinutes = Math.max(
                  1,
                  settings?.callTimeoutMinutes ?? 5
                );

                const now = new Date();

                const callExpiresAt = new Date(
                  now.getTime() + timeoutMinutes * 60 * 1000
                );

                const result = await tx.queueEntry.updateMany({
                  where: {
                    id: entry.id,
                    businessId: member.businessId,
                    status: "WAITING",
                  },
                  data: {
                    status: "CALLED",
                    professionalId,
                    calledAt: now,
                    callExpiresAt,
                  },
                });

                if (result.count !== 1) {
                  throw new Error(
                    "O cliente foi atualizado por outro operador."
                  );
                }

                // Histórico da chamada.
                await tx.queueEvent.create({
                  data: {
                    queueEntryId: entry.id,
                    type: "CALLED",
                  },
                });

                return;
              }

              // 6. Iniciar atendimento.
              if (input.action === "START") {
                const now = new Date();

                const result = await tx.queueEntry.updateMany({
                  where: {
                    id: entry.id,
                    businessId: member.businessId,
                    status: "CALLED",
                  },
                  data: {
                    status: "IN_SERVICE",
                    professionalId,
                    startedAt: now,
                    callExpiresAt: null,
                  },
                });

                if (result.count !== 1) {
                  throw new Error(
                    "O cliente foi atualizado por outro operador."
                  );
                }

                // Histórico do início do atendimento.
                await tx.queueEvent.create({
                  data: {
                    queueEntryId: entry.id,
                    type: "STARTED",
                  },
                });

                return;
              }
            }

            // 7. Finalizar atendimento.
            if (input.action === "FINISH") {
              const now = new Date();

              const result = await tx.queueEntry.updateMany({
                where: {
                  id: entry.id,
                  businessId: member.businessId,
                  status: "IN_SERVICE",
                },
                data: {
                  status: "COMPLETED",
                  completedAt: now,
                  callExpiresAt: null,
                },
              });

              if (result.count !== 1) {
                throw new Error(
                  "O cliente foi atualizado por outro operador."
                );
              }

              // Histórico da conclusão.
              await tx.queueEvent.create({
                data: {
                  queueEntryId: entry.id,
                  type: "COMPLETED",
                },
              });

              return;
            }

            // 8. Cancelar cliente que ainda está aguardando.
            if (input.action === "CANCEL") {
              const now = new Date();

              const result = await tx.queueEntry.updateMany({
                where: {
                  id: entry.id,
                  businessId: member.businessId,
                  status: "WAITING",
                },
                data: {
                  status: "CANCELED",
                  canceledAt: now,
                  callExpiresAt: null,
                },
              });

              if (result.count !== 1) {
                throw new Error(
                  "O cliente foi atualizado por outro operador."
                );
              }

              // Histórico do cancelamento.
              await tx.queueEvent.create({
                data: {
                  queueEntryId: entry.id,
                  type: "CANCELED",
                },
              });

              return;
            }

            // 9. Registrar ausência.
            if (input.action === "NO_SHOW") {
              const result = await tx.queueEntry.updateMany({
                where: {
                  id: entry.id,
                  businessId: member.businessId,
                  status: "CALLED",
                },
                data: {
                  status: "NO_SHOW",
                  callExpiresAt: null,
                },
              });

              if (result.count !== 1) {
                throw new Error(
                  "O cliente foi atualizado por outro operador."
                );
              }

              // Histórico da ausência.
              await tx.queueEvent.create({
                data: {
                  queueEntryId: entry.id,
                  type: "NO_SHOW",
                },
              });

              return;
            }

            throw new Error("Operação inválida.");
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000,
            timeout: 10000,
          }
        );

        // Transação concluída com sucesso.
        break;
      } catch (error) {
        const code = getPrismaErrorCode(error);

        // Reexecuta em caso de conflito de transação.
        if (code === "P2034" && attempt < MAX_RETRIES) {
          continue;
        }

        throw error;
      }
    }

    // Atualiza os dados das páginas.
    revalidatePath("/admin");
    revalidatePath("/admin/fila");
    revalidatePath("/admin/relatorios");

    return {
      success: true as const,
      message: {
        CALL: "Cliente chamado!",
        START: "Atendimento iniciado!",
        FINISH: "Atendimento finalizado!",
        CANCEL: "Cliente removido da fila.",
        NO_SHOW: "Ausência registrada.",
      }[input.action],
    };
  } catch (error) {
    console.error("[UPDATE_ENTRY_STATUS_ERROR]", error);

    return {
      success: false as const,
      message: getErrorMessage(error),
    };
  }
}