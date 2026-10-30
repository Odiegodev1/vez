"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import {
  serviceSchema,
  type ServiceFormValues,
} from "../schemas/service-schema";

import { requireServiceManager } from "./service-permissions";

export async function updateServiceAction(
  serviceId: string,
  input: ServiceFormValues
) {
  try {
    const parsed = serviceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        message:
          parsed.error.issues[0]?.message ??
          "Dados inválidos.",
      };
    }

    if (!serviceId) {
      return {
        success: false as const,
        message: "Serviço inválido.",
      };
    }

    const { businessId } = await requireServiceManager();

    const data = parsed.data;

    const result = await prisma.service.updateMany({
      where: {
        id: serviceId,
        businessId,
      },

      data: {
        name: data.name,
        description: data.description || null,
        durationMinutes: data.durationMinutes,
        price: data.price.replace(",", "."),
        active: data.active,
      },
    });

    if (result.count === 0) {
      return {
        success: false as const,
        message: "Serviço não encontrado.",
      };
    }

    revalidatePath("/admin/servicos");

    return {
      success: true as const,
      message: "Serviço atualizado com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_SERVICE_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível atualizar o serviço.",
    };
  }
}