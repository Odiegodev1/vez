"use server";

import prisma from "@/lib/prisma";
import { requireServiceManager } from "./service-permissions";

export async function getQueueRulesAction() {
  try {
    const { businessId } = await requireServiceManager();

    const settings = await prisma.queueSettings.findUnique({
      where: {
        businessId,
      },
      select: {
        maxWaiting: true,
        notifyAhead: true,
      },
    });

    return {
      success: true as const,
      rules: {
        maxWaiting: settings?.maxWaiting ?? 20,
        notifyAhead: settings?.notifyAhead ?? 2,
      },
      exists: Boolean(settings),
    };
  } catch (error) {
    console.error("[GET_QUEUE_RULES_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível carregar as regras.",
      rules: null,
      exists: false,
    };
  }
}