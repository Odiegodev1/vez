"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getQrCodeAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false as const,
        message: "Você precisa estar autenticado.",
        code: "UNAUTHORIZED" as const,
      };
    }

    const membership = await prisma.businessMember.findFirst({
      where: {
        userId: session.user.id,
        business: {
          status: "ACTIVE",
        },
      },
      select: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!membership) {
      return {
        success: false as const,
        message: "Nenhum estabelecimento encontrado.",
        code: "BUSINESS_NOT_FOUND" as const,
      };
    }

    return {
      success: true as const,
      data: {
        business: membership.business,
      },
    };
  } catch (error) {
    console.error("[GET_QRCODE_ACTION]", error);

    return {
      success: false as const,
      message: "Não foi possível carregar os dados do QR Code.",
      code: "INTERNAL_ERROR" as const,
    };
  }
}