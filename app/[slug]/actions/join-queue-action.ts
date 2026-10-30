"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getQueueDay } from "@/lib/queue-date";

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const MAX_RETRIES = 3;
const GENERAL_PREFIX = "G";

// ============================================================
// SCHEMA
// ============================================================

const joinQueueSchema = z.object({
  slug: z.string().trim().min(1).max(100),

  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(100, "Nome muito longo."),

  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .regex(
          /^\d{10,11}$/,
          "Informe um telefone válido com DDD."
        )
    ),

  servicos: z.string().min(1, "Selecione um serviço."),

  profissional: z
    .string()
    .min(1, "Selecione um profissional."),
});

type JoinQueueInput = z.input<typeof joinQueueSchema>;

type JoinQueueResult =
  | {
      success: true;
      message: string;
      ticketCode: string;
      publicToken: string;
    }
  | {
      success: false;
      message: string;
    };

// ============================================================
// ERROS
// ============================================================

class QueueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QueueError";
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function formatTicketCode(
  prefix: string,
  number: number
): string {
  return `${prefix}-${String(number).padStart(2, "0")}`;
}

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

// ============================================================
// SERVER ACTION
// ============================================================

export async function joinQueueAction(
  input: JoinQueueInput
): Promise<JoinQueueResult> {
  // ==========================================================
  // 1. VALIDAR FORMULÁRIO
  // ==========================================================

  const parsed = joinQueueSchema.safeParse(input);

  if (!parsed.success) {
    console.error(
      "[JOIN_QUEUE_VALIDATION]",
      z.treeifyError(parsed.error)
    );

    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Verifique os dados informados.",
    };
  }

  const {
    slug,
    name,
    phone,
    servicos: serviceId,
    profissional: selectedProfessional,
  } = parsed.data;

  // ==========================================================
  // 2. CRIAR ENTRADA COM RETENTATIVAS
  // ==========================================================

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const entry = await prisma.$transaction(
        async (tx) => {
          // ==================================================
          // 3. BUSCAR ESTABELECIMENTO
          // ==================================================

          const business = await tx.business.findFirst({
            where: {
              slug,
              status: "ACTIVE",
            },

            select: {
              id: true,
              slug: true,
              timezone: true,

              queueSettings: {
                select: {
                  isOpen: true,
                  maxWaiting: true,
                  allowAnyProfessional: true,
                },
              },
            },
          });

          if (!business) {
            throw new QueueError(
              "Estabelecimento não encontrado."
            );
          }

          const settings = business.queueSettings;

          if (!settings?.isOpen) {
            throw new QueueError(
              "A fila está fechada no momento."
            );
          }

          const queueDay = getQueueDay(business.timezone);

          // ==================================================
          // 4. VERIFICAR CAPACIDADE
          // ==================================================

          const waitingCount = await tx.queueEntry.count({
            where: {
              businessId: business.id,
              queueDay,
              status: "WAITING",
            },
          });

          if (waitingCount >= settings.maxWaiting) {
            throw new QueueError(
              "A fila está cheia no momento."
            );
          }

          // ==================================================
          // 5. VALIDAR SERVIÇO
          // ==================================================

          const service = await tx.service.findFirst({
            where: {
              id: serviceId,
              businessId: business.id,
              active: true,
            },

            select: {
              id: true,
              name: true,
            },
          });

          if (!service) {
            throw new QueueError(
              "O serviço selecionado não está disponível."
            );
          }

          // ==================================================
          // 6. VALIDAR PROFISSIONAL
          // ==================================================

          let professionalId: string | null = null;
          let ticketPrefix = GENERAL_PREFIX;

          const isAnyProfessional =
            selectedProfessional === "any" ||
            selectedProfessional === "ANY" ||
            selectedProfessional === "qualquer";

          if (isAnyProfessional) {
            if (!settings.allowAnyProfessional) {
              throw new QueueError(
                "A opção primeiro disponível está desabilitada."
              );
            }

            const availableProfessional =
              await tx.professional.findFirst({
                where: {
                  businessId: business.id,
                  active: true,

                  services: {
                    some: {
                      serviceId: service.id,
                    },
                  },
                },

                select: {
                  id: true,
                },
              });

            if (!availableProfessional) {
              throw new QueueError(
                "Nenhum profissional disponível para este serviço."
              );
            }
          } else {
            const professional =
              await tx.professional.findFirst({
                where: {
                  id: selectedProfessional,
                  businessId: business.id,
                  active: true,

                  services: {
                    some: {
                      serviceId: service.id,
                    },
                  },
                },

                select: {
                  id: true,
                  ticketPrefix: true,
                },
              });

            if (!professional) {
              throw new QueueError(
                "O profissional não está disponível para o serviço selecionado."
              );
            }

            professionalId = professional.id;
            ticketPrefix = professional.ticketPrefix;
          }

          // ==================================================
          // 7. GERAR SENHA SEQUENCIAL
          // ==================================================

          const counter = await tx.queueCounter.upsert({
            where: {
              businessId_day_prefix: {
                businessId: business.id,
                day: queueDay,
                prefix: ticketPrefix,
              },
            },

            create: {
              businessId: business.id,
              day: queueDay,
              prefix: ticketPrefix,
              lastNumber: 1,
            },

            update: {
              lastNumber: {
                increment: 1,
              },
            },

            select: {
              lastNumber: true,
            },
          });

          const ticketCode = formatTicketCode(
            ticketPrefix,
            counter.lastNumber
          );

          // ==================================================
          // 8. CRIAR SENHA NO BANCO
          // ==================================================

          const createdEntry = await tx.queueEntry.create({
            data: {
              businessId: business.id,
              serviceId: service.id,
              professionalId,

              customerName: name,
              customerPhone: phone,

              queueDay,
              ticketCode,

              publicToken: randomUUID(),

              status: "WAITING",
            },

            select: {
              id: true,
              ticketCode: true,
              publicToken: true,
            },
          });

          return createdEntry;
        },
        {
          isolationLevel: "Serializable",
          maxWait: 5000,
          timeout: 10000,
        }
      );

      // ======================================================
      // 9. REVALIDAR PÁGINAS
      // ======================================================

      revalidatePath(`/${slug}`);
      revalidatePath(`/${slug}/tela`);
      revalidatePath("/admin/fila");

      // ======================================================
      // 10. RETORNAR SUCESSO
      // ======================================================

      return {
        success: true,
        message: "Você entrou na fila com sucesso!",
        ticketCode: entry.ticketCode,
        publicToken: entry.publicToken,
      };
    } catch (error) {
      // ======================================================
      // 11. ERROS DE NEGÓCIO
      // ======================================================

      if (error instanceof QueueError) {
        return {
          success: false,
          message: error.message,
        };
      }

      // ======================================================
      // 12. ERROS DE CONCORRÊNCIA
      // ======================================================

      const errorCode = getPrismaErrorCode(error);

      if (
        (errorCode === "P2034" ||
          errorCode === "P2002") &&
        attempt < MAX_RETRIES
      ) {
        continue;
      }

      // ======================================================
      // 13. LOG DE ERRO
      // ======================================================

      console.error("[JOIN_QUEUE_ERROR]", {
        attempt,
        code: errorCode,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });

      return {
        success: false,
        message:
          "Não foi possível entrar na fila. Tente novamente.",
      };
    }
  }

  return {
    success: false,
    message:
      "Muitas pessoas estão entrando na fila. Tente novamente.",
  };
}