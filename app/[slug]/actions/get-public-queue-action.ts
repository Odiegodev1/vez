"use server";

import prisma from "@/lib/prisma";

export async function getPublicQueueAction(slug: string) {
  const business = await prisma.business.findUnique({
    where: {
      slug,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      timezone: true,

      queueSettings: {
        select: {
          isOpen: true,
          maxWaiting: true,
          allowAnyProfessional: true,
        },
      },

      services: {
        where: { active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          durationMinutes: true,
          price: true,
        },
      },

      professionals: {
        where: { active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          chairLabel: true,
          services: {
            select: {
              serviceId: true,
            },
          },
        },
      },
    },
  });

  if (!business) {
    return null;
  }

  const waiting = await prisma.queueEntry.count({
    where: {
      businessId: business.id,
      status: "WAITING",
    },
  });

  const isOpen = business.queueSettings?.isOpen ?? false;
  const maxWaiting = business.queueSettings?.maxWaiting ?? 20;

  return {
    business: {
      name: business.name,
      slug: business.slug,
      description: business.description,
      logoUrl: business.logoUrl,
      timezone: business.timezone,
    },

    isOpen,
    isFull: waiting >= maxWaiting,
    waiting,
    maxWaiting,
    allowAnyProfessional:
      business.queueSettings?.allowAnyProfessional ?? true,

    services: business.services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price?.toString() ?? null,
    })),

    professionals: business.professionals.map((professional) => ({
      id: professional.id,
      name: professional.name,
      chairLabel: professional.chairLabel,
      serviceIds: professional.services.map(
        (relation) => relation.serviceId
      ),
    })),
  };
}

export type PublicQueueData = NonNullable<
  Awaited<ReturnType<typeof getPublicQueueAction>>
>;