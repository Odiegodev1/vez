"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { requireQueueMember } from "./fila-permissions";

export async function updateFilaStatusAction(isOpen: boolean) {
  try {
    const member = await requireQueueMember();

    if (!["OWNER", "MANAGER"].includes(member.role)) {
      return {
        success: false as const,
        message: "Você não tem permissão para alterar a fila.",
      };
    }

    await prisma.queueSettings.upsert({
      where: {
        businessId: member.businessId,
      },
      create: {
        businessId: member.businessId,
        isOpen,
      },
      update: {
        isOpen,
      },
    });

    revalidatePath("/admin/fila");

    return {
      success: true as const,
      message: isOpen
        ? "Fila aberta com sucesso!"
        : "Fila fechada para novas entradas.",
    };
  } catch (error) {
    console.error("[UPDATE_FILA_STATUS_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível alterar o status da fila.",
    };
  }
}