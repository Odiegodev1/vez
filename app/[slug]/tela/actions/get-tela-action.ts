"use server";

import prisma from "@/lib/prisma";

export async function getTelaAction(slug: string) {
  try {
    const business = await prisma.business.findUnique({
      where: {
        slug,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        timezone: true,
        queueSettings: {
          select: {
            isOpen: true,
          },
        },
      },
    });

    if (!business) {
      return {
        success: false as const,
        message: "Estabelecimento não encontrado.",
      };
    }

    const [calling, waiting, waitingCount] =
      await Promise.all([
        prisma.queueEntry.findFirst({
          where: {
            businessId: business.id,
            status: "CALLED",
          },
          orderBy: {
            calledAt: "desc",
          },
          select: {
            id: true,
            ticketCode: true,
            customerName: true,
            calledAt: true,
            professional: {
              select: {
                name: true,
                chairLabel: true,
              },
            },
            service: {
              select: {
                name: true,
              },
            },
          },
        }),

        prisma.queueEntry.findMany({
          where: {
            businessId: business.id,
            status: "WAITING",
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 5,
          select: {
            id: true,
            ticketCode: true,
            customerName: true,
          },
        }),

        prisma.queueEntry.count({
          where: {
            businessId: business.id,
            status: "WAITING",
          },
        }),
      ]);

    return {
      success: true as const,
      data: {
        business: {
          name: business.name,
          slug: business.slug,
          logoUrl: business.logoUrl,
          timezone: business.timezone,
          isOpen: business.queueSettings?.isOpen ?? false,
        },

        calling: calling
          ? {
              id: calling.id,
              ticketCode: calling.ticketCode,
              customerName: calling.customerName,
              calledAt: calling.calledAt?.toISOString() ?? null,
              professionalName:
                calling.professional?.name ?? null,
              chairLabel:
                calling.professional?.chairLabel ?? null,
              serviceName:
                calling.service?.name ?? null,
            }
          : null,

        waiting: waiting.map((entry) => ({
          id: entry.id,
          ticketCode: entry.ticketCode,
          customerName: entry.customerName,
        })),

        waitingCount,
      },
    };
  } catch (error) {
    console.error("[GET_TELA_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível atualizar o telão.",
    };
  }
}