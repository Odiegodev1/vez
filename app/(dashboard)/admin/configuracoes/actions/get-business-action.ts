"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function getBusinessAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const membership = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      role: "OWNER",
    },
    select: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          phone: true,
          address: true,

          queueSettings: {
            select: {
              isOpen: true,
              maxWaiting: true,
              notifyAhead: true,
              callTimeoutMinutes: true,
            },
          },
        },
      },
    },
  });

  return membership?.business ?? null;
}