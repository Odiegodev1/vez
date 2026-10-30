import "server-only";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function requireBusinessOwner() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const membership = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      role: "OWNER",
    },
    select: {
      businessId: true,
      userId: true,
    },
  });

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  return membership;
}