"use server";

import prisma from "@/lib/prisma";
import { getQueueDay } from "@/lib/queue-date";

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const ACTIVE_STATUSES = [
  "WAITING",
  "CALLED",
  "IN_SERVICE",
] as const;

const DEFAULT_CALL_TIMEOUT_MINUTES = 5;

// ============================================================
// SERVER ACTION
// ============================================================

export async function getMyTicketAction(
  slug: string,
  token: string
) {
  // ==========================================================
  // 1. VALIDAR PARÂMETROS
  // ==========================================================

  if (
    typeof slug !== "string" ||
    typeof token !== "string" ||
    !slug.trim() ||
    !token.trim()
  ) {
    return null;
  }

  // ==========================================================
  // 2. BUSCAR SENHA DO CLIENTE
  // ==========================================================

  const entry = await prisma.queueEntry.findFirst({
    where: {
      publicToken: token,

      business: {
        slug,
        status: "ACTIVE",
      },
    },

    select: {
      id: true,
      ticketCode: true,
      publicToken: true,
      customerName: true,
      status: true,
      createdAt: true,
      calledAt: true,
      queueDay: true,
      professionalId: true,

      service: {
        select: {
          id: true,
          name: true,
          durationMinutes: true,
        },
      },

      professional: {
        select: {
          id: true,
          name: true,
          chairLabel: true,
        },
      },

      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          timezone: true,

          queueSettings: {
            select: {
              isOpen: true,
              callTimeoutMinutes: true,
            },
          },
        },
      },
    },
  });

  if (!entry) {
    return null;
  }

  // ==========================================================
  // 3. CONFIGURAÇÕES DO ESTABELECIMENTO
  // ==========================================================

  const business = entry.business;

  const queueSettings = business.queueSettings;

  const callTimeoutMinutes =
    queueSettings?.callTimeoutMinutes ??
    DEFAULT_CALL_TIMEOUT_MINUTES;

  const today = getQueueDay(business.timezone);

  // ==========================================================
  // 4. DEFINIR FILA DO CLIENTE
  // ==========================================================

  // Se o cliente escolheu um profissional:
  // buscamos as senhas desse profissional.
  //
  // Se professionalId for null:
  // buscamos as senhas da fila geral.

  const queueScope = {
    businessId: business.id,
    queueDay: entry.queueDay,
    professionalId: entry.professionalId,
  };

  // ==========================================================
  // 5. BUSCAR SENHAS ATIVAS
  // ==========================================================

  const activeEntries = await prisma.queueEntry.findMany({
    where: {
      ...queueScope,

      status: {
        in: [...ACTIVE_STATUSES],
      },
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
      ticketCode: true,
      status: true,
      createdAt: true,

      service: {
        select: {
          durationMinutes: true,
        },
      },
    },
  });

  // ==========================================================
  // 6. LOCALIZAR POSIÇÃO DO CLIENTE
  // ==========================================================

  const myIndex = activeEntries.findIndex(
    (item) => item.id === entry.id
  );

  // ==========================================================
  // 7. CALCULAR PESSOAS NA FRENTE
  // ==========================================================

  const aheadEntries =
    entry.status === "WAITING" && myIndex >= 0
      ? activeEntries.filter(
          (item, index) =>
            index < myIndex &&
            item.status !== "COMPLETED"
        )
      : [];

  const peopleAhead = aheadEntries.length;

  // ==========================================================
  // 8. CALCULAR TEMPO ESTIMADO DE ESPERA
  // ==========================================================

  const estimatedMinutes = aheadEntries.reduce(
    (total, item) =>
      total + item.service.durationMinutes,
    0
  );

  // ==========================================================
  // 9. MONTAR FILA PÚBLICA
  // ==========================================================

  // Não retornamos nome ou telefone de outros clientes.

  const queue = activeEntries.map((item) => ({
    id: item.id,
    ticketCode: item.ticketCode,
    isMe: item.id === entry.id,
    status: item.status,
  }));

  // ==========================================================
  // 10. CALCULAR PRAZO DA CHAMADA
  // ==========================================================

  const calledAt =
    entry.calledAt?.toISOString() ?? null;

  let callExpiresAt: string | null = null;

  if (
    entry.status === "CALLED" &&
    entry.calledAt
  ) {
    const expirationDate = new Date(
      entry.calledAt.getTime() +
        callTimeoutMinutes * 60 * 1000
    );

    callExpiresAt = expirationDate.toISOString();
  }

  // ==========================================================
  // 11. RETORNAR DADOS
  // ==========================================================

  return {
    ticket: {
      id: entry.id,

      code: entry.ticketCode,

      token: entry.publicToken,

      customerName: entry.customerName,

      status: entry.status,

      createdAt: entry.createdAt.toISOString(),

      calledAt,

      callExpiresAt,

      callTimeoutMinutes,

      serviceName: entry.service.name,

      serviceDuration:
        entry.service.durationMinutes,

      professionalName:
        entry.professional?.name ??
        "Primeiro disponível",

      chairLabel:
        entry.professional?.chairLabel ?? null,

      peopleAhead,

      estimatedMinutes,

      isFromToday: entry.queueDay === today,
    },

    business: {
      name: business.name,

      slug: business.slug,

      logoUrl: business.logoUrl,

      isOpen: queueSettings?.isOpen ?? false,

      callTimeoutMinutes,
    },

    // Também disponibilizamos no nível principal,
    // facilitando o uso no componente CardTime.
    callTimeoutMinutes,

    queue,
  };
}

// ============================================================
// TIPAGEM
// ============================================================

export type MyTicketData = NonNullable<
  Awaited<ReturnType<typeof getMyTicketAction>>
>;