"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function acceptMemberInvitationAction(
  token: string
) {
  try {
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return {
        success: false,
        message: "Convite inválido.",
      };
    }

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Faça login para aceitar o convite.",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user?.email) {
      return {
        success: false,
        message: "Sua conta precisa ter um e-mail.",
      };
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const invitation = await prisma.businessInvitation.findUnique({
      where: {
        tokenHash,
      },
    });

    if (
      !invitation ||
      invitation.acceptedAt ||
      invitation.expiresAt <= new Date()
    ) {
      return {
        success: false,
        message: "Este convite é inválido ou expirou.",
      };
    }

    if (
      invitation.email.toLowerCase() !==
      user.email.toLowerCase()
    ) {
      return {
        success: false,
        message:
          "Entre com a conta correspondente ao e-mail convidado.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Garante que apenas uma aceitação consuma o convite.
      const claimed = await tx.businessInvitation.updateMany({
        where: {
          id: invitation.id,
          acceptedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      if (claimed.count !== 1) {
        throw new Error("INVITATION_ALREADY_USED");
      }

      const existing = await tx.businessMember.findFirst({
        where: {
          businessId: invitation.businessId,
          userId: user.id,
        },
      });

      if (existing) {
        throw new Error("ALREADY_MEMBER");
      }

      await tx.businessMember.create({
        data: {
          businessId: invitation.businessId,
          userId: user.id,
          role: invitation.role,
        },
      });
    });

    revalidatePath("/admin/configuracoes");

    return {
      success: true,
      message: "Convite aceito! Você agora faz parte da equipe.",
    };
  } catch (error) {
    console.error("[ACCEPT_INVITATION_ERROR]", error);

    return {
      success: false,
      message:
        "Não foi possível aceitar o convite. Ele pode já ter sido utilizado.",
    };
  }
}