import "server-only";


import prisma from "@/lib/prisma";
import { auth } from "../auth";

export async function getCurrentBusiness() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const membership = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      business: {
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      role: true,
      businessId: true,
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          timezone: true,
          status: true,
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  return {
    businessId: membership.businessId,
    role: membership.role,
    business: membership.business,
  };
}