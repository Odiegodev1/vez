import "server-only";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function requireQueueMember() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const member = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      business: { status: "ACTIVE" },
    },
    select: {
      businessId: true,
      role: true,
    },
  });

  if (!member) {
    throw new Error("FORBIDDEN");
  }

  return member;
}