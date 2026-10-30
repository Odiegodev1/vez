"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getQueueDay } from "@/lib/queue-date";
import { requireQueueMember } from "./fila-permissions";

type ProcessResult = {
  expired: number;
  called: number;
};

const MAX_RETRIES = 3;

function getErrorCode(error: unknown): string | null {
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

export async function processQueueTimeoutsAction(
  businessId: string
): Promise<ProcessResult> {
  // A Action é acessível pelo navegador.
  // Por isso, precisamos autenticar o usuário e
  // verificar se ele pertence ao estabelecimento.
  const member = await requireQueueMember();

  if (!member || !businessId) {
    throw new Error("Não autorizado.");
  }

  // Ajuste esta propriedade caso requireQueueMember()
  // retorne o estabelecimento em outra estrutura.
  if (member.businessId !== businessId) {
    throw new Error("Acesso negado ao estabelecimento.");
  }

  const business = await prisma.business.findUnique({
    where: {
      id: businessId,
    },

    select: {
      id: true,
      slug: true,
      timezone: true,

      queueSettings: {
        select: {
          isOpen: true,
          callTimeoutMinutes: true,
        },
      },
    },
  });

  if (!business?.queueSettings?.isOpen) {
    return {
      expired: 0,
      called: 0,
    };
  }

  const queueDay = getQueueDay(business.timezone);

  const timeoutMinutes = Math.max(
    1,
    business.queueSettings.callTimeoutMinutes
  );

  const expiresBefore = new Date(
    Date.now() - timeoutMinutes * 60 * 1000
  );

  // Buscar as senhas cujo tempo já terminou.
  const expiredEntries = await prisma.queueEntry.findMany({
    where: {
      businessId: business.id,
      queueDay,
      status: "CALLED",

      calledAt: {
        lte: expiresBefore,
      },

      professionalId: {
        not: null,
      },
    },

    select: {
      id: true,
      professionalId: true,
    },

    orderBy: [
      {
        calledAt: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  let expired = 0;
  let called = 0;

  for (const entry of expiredEntries) {
    // CORREÇÃO DO ERRO TYPESCRIPT:
    // Guardamos o valor em uma constante.
    const professionalId = entry.professionalId;

    if (professionalId === null) {
      continue;
    }

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        const result = await prisma.$transaction(
          async (tx) => {
            // Impede que duas execuções automáticas
            // processem o mesmo profissional ao mesmo tempo.
            //
            // A chamada manual deve usar o mesmo lock.
            const lockKey = `${business.id}:${professionalId}`;

            await tx.$executeRaw`
              SELECT pg_advisory_xact_lock(
                hashtext(${lockKey})
              )
            `;

            // Buscar novamente a configuração atual.
            const settings =
              await tx.queueSettings.findUnique({
                where: {
                  businessId: business.id,
                },

                select: {
                  isOpen: true,
                  callTimeoutMinutes: true,
                },
              });

            if (!settings?.isOpen) {
              return {
                expired: false,
                called: false,
              };
            }

            // Recalcular o tempo caso o administrador
            // tenha alterado a configuração.
            const currentExpiresBefore = new Date(
              Date.now() -
                Math.max(
                  1,
                  settings.callTimeoutMinutes
                ) *
                  60 *
                  1000
            );

            // Expirar somente se a senha
            // continuar no status CALLED.
            const updated =
              await tx.queueEntry.updateMany({
                where: {
                  id: entry.id,
                  businessId: business.id,
                  queueDay,
                  professionalId,
                  status: "CALLED",

                  calledAt: {
                    lte: currentExpiresBefore,
                  },
                },

                data: {
                  status: "NO_SHOW",
                },
              });

            if (updated.count === 0) {
              return {
                expired: false,
                called: false,
              };
            }

            // Não chamar outro cliente enquanto
            // o profissional estiver atendendo.
            const activeService =
              await tx.queueEntry.findFirst({
                where: {
                  businessId: business.id,
                  queueDay,
                  professionalId,
                  status: "IN_SERVICE",
                },

                select: {
                  id: true,
                },
              });

            if (activeService) {
              return {
                expired: true,
                called: false,
              };
            }

            // Verificar se já existe outra senha chamada.
            const alreadyCalled =
              await tx.queueEntry.findFirst({
                where: {
                  businessId: business.id,
                  queueDay,
                  professionalId,
                  status: "CALLED",
                },

                select: {
                  id: true,
                },
              });

            if (alreadyCalled) {
              return {
                expired: true,
                called: false,
              };
            }

            // Buscar o próximo cliente:
            //
            // 1. Escolheu este profissional.
            // 2. Escolheu "Primeiro disponível" e
            //    o profissional realiza o serviço.
            const nextEntry =
              await tx.queueEntry.findFirst({
                where: {
                  businessId: business.id,
                  queueDay,
                  status: "WAITING",

                  OR: [
                    {
                      professionalId,
                    },
                    {
                      professionalId: null,

                      service: {
                        professionalServices: {
                          some: {
                            professionalId,
                          },
                        },
                      },
                    },
                  ],
                },

                orderBy: [
                  {
                    createdAt: "asc",
                  },
                  {
                    id: "asc",
                  },
                ],

                select: {
                  id: true,
                },
              });

            if (!nextEntry) {
              return {
                expired: true,
                called: false,
              };
            }

            // Chamar o próximo cliente.
            const nextUpdated =
              await tx.queueEntry.updateMany({
                where: {
                  id: nextEntry.id,
                  businessId: business.id,
                  queueDay,
                  status: "WAITING",
                },

                data: {
                  status: "CALLED",
                  calledAt: new Date(),
                  professionalId,
                },
              });

            return {
              expired: true,
              called: nextUpdated.count === 1,
            };
          },
          {
            isolationLevel: "Serializable",
            maxWait: 5000,
            timeout: 10000,
          }
        );

        if (result.expired) {
          expired++;
        }

        if (result.called) {
          called++;
        }

        break;
      } catch (error) {
        const code = getErrorCode(error);

        // Repetir quando houver conflito de transação.
        if (
          code === "P2034" &&
          attempt < MAX_RETRIES
        ) {
          continue;
        }

        console.error(
          "[PROCESS_QUEUE_TIMEOUT_ERROR]",
          {
            businessId: business.id,
            entryId: entry.id,
            professionalId,
            attempt,
            error,
          }
        );

        throw error;
      }
    }
  }

  if (expired > 0 || called > 0) {
    revalidatePath("/admin/fila");
    revalidatePath(`/${business.slug}/tela`);
  }

  return {
    expired,
    called,
  };
}