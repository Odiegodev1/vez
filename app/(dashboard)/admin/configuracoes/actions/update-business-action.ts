"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { Prisma } from "@/lib/generated/prisma/client";

import {
  createBusinessSchema,
  type CreateBusinessInput,
} from "../schemas/create-business-schema";

type UpdateBusinessResponse =
  | {
      success: true;
      message: string;
      businessId: string;
      slug: string;
    }
  | {
      success: false;
      message: string;
    };

export async function updateBusinessAction(
  businessId: string,
  input: CreateBusinessInput
): Promise<UpdateBusinessResponse> {
  try {
    // ========================================================
    // 1. AUTENTICAÇÃO
    // ========================================================

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Você precisa estar autenticado.",
      };
    }

    const userId = session.user.id;

    // ========================================================
    // 2. VALIDAR OS DADOS
    // ========================================================

    const parsed = createBusinessSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ??
          "Dados inválidos.",
      };
    }

    const data = parsed.data;

    // ========================================================
    // 3. VALIDAR IDENTIFICADOR
    // ========================================================

    if (!businessId || typeof businessId !== "string") {
      return {
        success: false,
        message: "Identificador do estabelecimento inválido.",
      };
    }

    // ========================================================
    // 4. ATUALIZAR EM TRANSAÇÃO
    // ========================================================

    const updatedBusiness = await prisma.$transaction(
      async (tx) => {
        // Verificar se o usuário é proprietário
        const membership = await tx.businessMember.findFirst({
          where: {
            businessId,
            userId,
            role: "OWNER",
          },
          select: {
            id: true,
          },
        });

        if (!membership) {
          return null;
        }

        // Atualizar dados do estabelecimento
        const business = await tx.business.update({
          where: {
            id: businessId,
          },
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            phone: data.phone,
            whatsapp: data.phone,
            address: data.address || null,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        // Criar configurações caso não existam,
        // ou atualizar as configurações existentes
        await tx.queueSettings.upsert({
          where: {
            businessId,
          },

          create: {
            businessId,
            isOpen: data.queueEnabled,
            maxWaiting: data.maxQueueSize,
            notifyAhead: data.notifyAhead,
            callTimeoutMinutes: data.callTimeoutMinutes,
            allowAnyProfessional: true,
          },

          update: {
            isOpen: data.queueEnabled,
            maxWaiting: data.maxQueueSize,
            notifyAhead: data.notifyAhead,
            callTimeoutMinutes: data.callTimeoutMinutes,
          },
        });

        return business;
      }
    );

    // ========================================================
    // 5. VERIFICAR PERMISSÃO
    // ========================================================

    if (!updatedBusiness) {
      return {
        success: false,
        message:
          "Você não possui permissão para editar este estabelecimento.",
      };
    }

    // ========================================================
    // 6. REVALIDAR PÁGINAS
    // ========================================================

    revalidatePath("/configuracoes");
    revalidatePath("/dashboard");

    // Revalidar página pública
    revalidatePath(`/${updatedBusiness.slug}`);

    // ========================================================
    // 7. RETORNAR RESULTADO
    // ========================================================

    return {
      success: true,
      message: "Estabelecimento atualizado com sucesso!",
      businessId: updatedBusiness.id,
      slug: updatedBusiness.slug,
    };
  } catch (error) {
    console.error("[UPDATE_BUSINESS_ERROR]", error);

    // ========================================================
    // ERRO DE SLUG DUPLICADO
    // ========================================================

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message:
            "Este endereço público já está sendo utilizado. Escolha outro.",
        };
      }

      if (error.code === "P2025") {
        return {
          success: false,
          message: "Estabelecimento não encontrado.",
        };
      }
    }

    return {
      success: false,
      message:
        "Não foi possível atualizar o estabelecimento. Tente novamente.",
    };
  }
}