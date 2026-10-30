"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import { requireServiceManager } from "./service-permissions";
import { serviceSchema } from "../schemas/service-schema";

type CreateServiceInput = {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price?: string | null;
  active?: boolean;
};

export async function createServiceAction(input: CreateServiceInput) {
  try {
    // 1. Verificar permissões
    const { businessId } = await requireServiceManager();

    // 2. Validar os dados
    const parsed = serviceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        message: "Verifique os dados do serviço.",
      };
    }

    const data = parsed.data;

    // 3. Buscar profissionais ativos da barbearia
    const professionals = await prisma.professional.findMany({
      where: {
        businessId,
        active: true,
      },
      select: {
        id: true,
      },
    });

    // 4. Criar serviço e vincular aos profissionais
    const service = await prisma.service.create({
      data: {
        businessId,
        name: data.name,
        description: data.description || null,
        durationMinutes: data.durationMinutes,
        price: data.price || null,
        active: data.active ?? true,

        professionalServices: {
          create: professionals.map((professional) => ({
            professionalId: professional.id,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        durationMinutes: true,
        active: true,
        professionalServices: {
          select: {
            professionalId: true,
          },
        },
      },
    });

    // 5. Atualizar as páginas
    revalidatePath("/admin/servicos");
    revalidatePath("/admin/fila");

    return {
      success: true as const,
      message: "Serviço cadastrado com sucesso!",
      data: service,
    };
  } catch (error) {
    console.error("[CREATE_SERVICE_ACTION]", error);

    return {
      success: false as const,
      message: "Não foi possível cadastrar o serviço.",
    };
  }
}