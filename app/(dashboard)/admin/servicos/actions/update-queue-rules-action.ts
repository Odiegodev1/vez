"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";



import { requireServiceManager } from "./service-permissions";
import { queueRulesSchema, QueueRulesValues } from "../schemas/queue-rules-schema";

export async function updateQueueRulesAction(
  input: QueueRulesValues
) {
  try {
    const parsed = queueRulesSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ?? "Dados inválidos.",
      };
    }

    const { businessId } = await requireServiceManager();

    const { maxWaiting, notifyAhead } = parsed.data;

    await prisma.queueSettings.upsert({
      where: {
        businessId,
      },
      create: {
        businessId,
        maxWaiting,
        notifyAhead,
        isOpen: false,
        callTimeoutMinutes: 5,
        allowAnyProfessional: true,
      },
      update: {
        maxWaiting,
        notifyAhead,
      },
    });

    revalidatePath("/admin/servicos");
    revalidatePath("/admin/configuracoes");

    return {
      success: true,
      message: "Regras da fila atualizadas com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_QUEUE_RULES_ERROR]", error);

    return {
      success: false,
      message: "Não foi possível atualizar as regras.",
    };
  }
}