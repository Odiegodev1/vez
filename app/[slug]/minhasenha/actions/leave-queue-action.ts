"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function leaveQueueAction(
  slug: string,
  token: string
) {
  try {
    if (!slug || !token) {
      return {
        success: false,
        message: "Senha inválida.",
      };
    }

    const result = await prisma.queueEntry.updateMany({
      where: {
        publicToken: token,
        business: {
          slug,
        },
        status: "WAITING",
      },
      data: {
        status: "CANCELED",
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message:
          "Não foi possível cancelar. Sua senha pode já ter sido chamada ou encerrada.",
      };
    }

    revalidatePath(`/${slug}/minhasenha`);
    revalidatePath(`/${slug}`);
    revalidatePath("/admin/fila");

    return {
      success: true,
      message: "Você saiu da fila com sucesso.",
    };
  } catch (error) {
    console.error("[LEAVE_QUEUE_ACTION]", error);

    return {
      success: false,
      message: "Não foi possível sair da fila.",
    };
  }
}