import "server-only";

import prisma from "@/lib/prisma";
import { getQueueDay } from "@/lib/queue-date";

export type ProcessResult = {
  expired: number;
  called: number;
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

export async function processQueueTimeouts(
  businessId: string
): Promise<ProcessResult> {
  const result: ProcessResult = {
    expired: 0,
    called: 0,
  };

  if (!businessId) {
    return result;
  }

  const business = await prisma.business.findUnique({
    where: {
      id: businessId,
    },
    select: {
      id: true,
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
    return result;
  }

  const queueDay = getQueueDay(business.timezone);

  const timeoutMinutes = Math.max(
    1,
    business.queueSettings.callTimeoutMinutes
  );

  const expiresBefore = new Date(
    Date.now() - timeoutMinutes * 60 * 1000
  );

  // Busca senhas chamadas cujo prazo terminou.
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

  for (const entry of expiredEntries) {
    const professionalId = entry.professionalId;

    if (!professionalId) {
      continue;
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const processed = await prisma.$transaction(
          async (tx) => {
            const lockKey = `${business.id}:${professionalId}`;

            // Bloqueio por estabelecimento e profissional.
            // Compatível com Prisma 7 e PostgreSQL.
            await tx.$queryRaw<Array<{ locked: string }>>`
              SELECT pg_advisory_xact_lock(
                hashtext(${lockKey})
              )::text AS locked
            `;

            // Verifica novamente as configurações.
            const settings = await tx.queueSettings.findUnique({
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

            const currentExpiresBefore = new Date(
              Date.now() -
                Math.max(1, settings.callTimeoutMinutes) *
                  60 *
                  1000
            );

            // Expira apenas se ainda estiver CALLED
            // e o tempo realmente tiver terminado.
            const updated = await tx.queueEntry.updateMany({
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

            if (updated.count !== 1) {
              return {
                expired: false,
                called: false,
              };
            }

            // Não chama outro cliente se o profissional
            // já estiver ocupado.
            const busy = await tx.queueEntry.findFirst({
              where: {
                businessId: business.id,
                queueDay,
                professionalId,
                status: {
                  in: ["CALLED", "IN_SERVICE"],
                },
              },
              select: {
                id: true,
              },
            });

            if (busy) {
              return {
                expired: true,
                called: false,
              };
            }

            // Verifica se o profissional continua ativo.
            const professional = await tx.professional.findFirst({
              where: {
                id: professionalId,
                businessId: business.id,
                active: true,
              },
              select: {
                id: true,
              },
            });

            if (!professional) {
              return {
                expired: true,
                called: false,
              };
            }

            // Busca o próximo cliente compatível.
            const nextEntry = await tx.queueEntry.findFirst({
              where: {
                businessId: business.id,
                queueDay,
                status: "WAITING",
                service: {
                  professionalServices: {
                    some: {
                      professionalId,
                    },
                  },
                },
                OR: [
                  {
                    professionalId,
                  },
                  {
                    professionalId: null,
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

            // Chama automaticamente o próximo cliente.
            const nextUpdated = await tx.queueEntry.updateMany({
              where: {
                id: nextEntry.id,
                businessId: business.id,
                queueDay,
                status: "WAITING",
              },
              data: {
                status: "CALLED",
                professionalId,
                calledAt: new Date(),
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

        if (processed.expired) {
          result.expired++;
        }

        if (processed.called) {
          result.called++;
        }

        break;
      } catch (error) {
        const code = getPrismaErrorCode(error);

        if (code === "P2034" && attempt < MAX_RETRIES) {
          continue;
        }

        console.error("[PROCESS_QUEUE_TIMEOUT]", {
          businessId: business.id,
          entryId: entry.id,
          professionalId,
          attempt,
          error,
        });

        throw error;
      }
    }
  }

  return result;
}