"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import { requireServiceManager } from "./service-permissions";

export async function deleteServiceAction(serviceId: string) {
  try {
    if (!serviceId) {
      return {
        success: false as const,
        message: "Serviço inválido.",
      };
    }

    const { businessId } = await requireServiceManager();

    const result = await prisma.service.updateMany({
      where: {
        id: serviceId,
        businessId,
        active: true,
      },

      data: {
        active: false,
      },
    });

    if (result.count === 0) {
      return {
        success: false as const,
        message: "Serviço não encontrado ou já desativado.",
      };
    }

    revalidatePath("/admin/servicos");

    return {
      success: true as const,
      message: "Serviço desativado com sucesso!",
    };
  } catch (error) {
    console.error("[DELETE_SERVICE_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível desativar o serviço.",
    };
  }
}