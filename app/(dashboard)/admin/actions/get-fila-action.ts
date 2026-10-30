"use server";

import prisma from "@/lib/prisma";
import { requireQueueMember } from "./fila-permissions";

export async function getFilaAction() {
    
  try {
    const { businessId, role } = await requireQueueMember();

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        slug: true,
        timezone: true,
        queueSettings: {
          select: { isOpen: true },
        },
      },
    });

    if (!business) {
      return {
        success: false as const,
        message: "Estabelecimento não encontrado.",
      };
    }

    const [entries, professionals] = await Promise.all([
      prisma.queueEntry.findMany({
        where: {
          businessId,
          status: {
            in: [
              "WAITING",
              "CALLED",
              "IN_SERVICE",
            ],
          },
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          ticketCode: true,
          customerName: true,
          status: true,
          createdAt: true,
          calledAt: true,
          service: {
            select: {
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
        },
      }),

      prisma.professional.findMany({
        where: {
          businessId,
          active: true,
        },
        select: {
          id: true,
          name: true,
          chairLabel: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const waiting = entries.filter(
      (entry) => entry.status === "WAITING"
    );

    const called = entries.filter(
      (entry) => entry.status === "CALLED"
    );

    const inService = entries.filter(
      (entry) => entry.status === "IN_SERVICE"
    );

    const averageMinutes = waiting.length
      ? Math.round(
          waiting.reduce(
            (total, entry) =>
              total + entry.service.durationMinutes,
            0
          ) / waiting.length
        )
      : 0;

    return {
      success: true as const,
      data: {
        isOwner: role === "OWNER",
        business: {
          name: business.name,
          slug: business.slug,
          timezone: business.timezone,
          isOpen: business.queueSettings?.isOpen ?? false,
        },
        canManageSettings:
          role === "OWNER" || role === "MANAGER",
        professionals,
        entries: entries.map((entry) => ({
          id: entry.id,
          ticketCode: entry.ticketCode,
          customerName: entry.customerName,
          status: entry.status,
          createdAt: entry.createdAt.toISOString(),
          calledAt: entry.calledAt?.toISOString() ?? null,
          serviceName: entry.service.name,
          durationMinutes: entry.service.durationMinutes,
          professionalId: entry.professional?.id ?? null,
          professionalName: entry.professional?.name ?? null,
          chairLabel: entry.professional?.chairLabel ?? null,
        })),
        stats: {
          waiting: waiting.length,
          called: called.length,
          inService: inService.length,
          averageMinutes,
        },
      },
    };
  } catch (error) {
    console.error("[GET_FILA_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível carregar a fila.",
    };
  }
}