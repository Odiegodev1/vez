"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { Prisma } from "@/lib/generated/prisma/client";

import {
  createBusinessSchema,
  type CreateBusinessInput,
} from "../schemas/create-business-schema";

type ActionResponse =
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

export async function createBusinessAction(
  input: CreateBusinessInput
): Promise<ActionResponse> {
  try {
    // 1. Validar os dados recebidos
    const parsed = createBusinessSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ??
          "Dados inválidos.",
      };
    }

    // 2. Verificar autenticação
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Você precisa estar autenticado.",
      };
    }

    const userId = session.user.id;
    const data = parsed.data;

    const existingMembership = await prisma.businessMember.findFirst({
        where: {
          userId,
          role: "OWNER",
        },
        select: {
          businessId: true,
        },
      });
      
      if (existingMembership) {
        return {
          success: false,
          message: "Você já possui um estabelecimento cadastrado.",
        };
      }
    // 3. Criar tudo em uma transação
    const business = await prisma.$transaction(async (tx) => {
        return await tx.business.create({
          data: {
            name: data.name,
            slug: data.slug,
      
            members: {
              create: {
                userId: session.user?.id as any,
                role: "OWNER",
                
              },
            },
      
            professionals: {
              create: {
                name: session.user?.name || "Proprietário",
                chairLabel: "Cadeira 01",
                ticketPrefix: "A",
                active: true,
              },
            },
      
            queueSettings: {
              create: {
                isOpen: false,
                maxWaiting: 20,
                notifyAhead: 2,
                callTimeoutMinutes: 5,
                allowAnyProfessional: true,
              },
            },
          },
        });
      });

    return {
      success: true,
      message: "Estabelecimento criado com sucesso!",
      businessId: business.id,
      slug: business.slug,
    };
  } catch (error) {
    console.error("[CREATE_BUSINESS_ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message:
            "Este endereço já está sendo utilizado. Escolha outro.",
        };
      }

      if (error.code === "P2003") {
        return {
          success: false,
          message:
            "Não foi possível vincular o usuário ao estabelecimento.",
        };
      }
    }

    return {
      success: false,
      message:
        "Não foi possível criar o estabelecimento. Tente novamente.",
    };
  }
}