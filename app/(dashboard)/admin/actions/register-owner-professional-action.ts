"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function registerOwnerProfessionalAction() {
  try {
    // 1. Verificar autenticação
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Usuário não autenticado.",
      };
    }

    // 2. Buscar estabelecimento do proprietário
    const membership = await prisma.businessMember.findFirst({
      where: {
        userId: session.user.id,
        role: "OWNER",
        business: {
          status: "ACTIVE",
        },
      },
      select: {
        businessId: true,

        user: {
          select: {
            name: true,
          },
        },

        business: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!membership) {
      return {
        success: false,
        message: "Você não é proprietário de um estabelecimento ativo.",
      };
    }

    const businessId = membership.businessId;
    const businessSlug = membership.business.slug;

    const ownerName =
      membership.user.name?.trim() || "Proprietário";

    // 3. Buscar serviços ativos
    const services = await prisma.service.findMany({
      where: {
        businessId,
        active: true,
      },
      select: {
        id: true,
      },
    });

    if (services.length === 0) {
      return {
        success: false,
        message:
          "Cadastre pelo menos um serviço antes de se registrar como profissional.",
      };
    }

    // 4. Verificar se o proprietário já é profissional
    const existing = await prisma.professional.findFirst({
      where: {
        businessId,
        name: ownerName,
      },
      select: {
        id: true,
        active: true,
      },
    });

    // 5. Se já existir, vincular os serviços que faltam
    if (existing) {
      await prisma.$transaction(async (tx) => {
        await tx.professional.update({
          where: {
            id: existing.id,
          },
          data: {
            active: true,
          },
        });

        await tx.professionalService.createMany({
          data: services.map((service) => ({
            professionalId: existing.id,
            serviceId: service.id,
          })),
          skipDuplicates: true,
        });
      });

      revalidatePath("/admin/fila");
      revalidatePath(`/${businessSlug}`);

      return {
        success: true,
        message:
          "Você já estava cadastrado. Seus serviços foram atualizados!",
      };
    }

    // 6. Buscar profissionais existentes
    const professionals = await prisma.professional.findMany({
      where: {
        businessId,
      },
      select: {
        ticketPrefix: true,
        chairLabel: true,
      },
    });

    // 7. Encontrar prefixo disponível
    const usedPrefixes = new Set(
      professionals.map((professional) => professional.ticketPrefix)
    );

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const prefix = [...alphabet].find(
      (letter) => !usedPrefixes.has(letter)
    );

    // Garante que ticketPrefix nunca seja undefined
    if (prefix === undefined) {
      return {
        success: false,
        message:
          "Não há prefixos disponíveis para cadastrar o profissional.",
      };
    }

    // 8. Encontrar número de cadeira disponível
    const usedChairs = new Set(
      professionals
        .map((professional) => professional.chairLabel)
        .filter((chair): chair is string => chair !== null)
    );

    let chairNumber = 1;

    while (
      usedChairs.has(
        `Cadeira ${String(chairNumber).padStart(2, "0")}`
      )
    ) {
      chairNumber++;
    }

    const chairLabel = `Cadeira ${String(chairNumber).padStart(2, "0")}`;

    // 9. Criar profissional com serviços vinculados
    const professional = await prisma.professional.create({
      data: {
        businessId,
        name: ownerName,
        chairLabel,
        ticketPrefix: prefix,
        active: true,

        services: {
          create: services.map((service) => ({
            serviceId: service.id,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        chairLabel: true,
        ticketPrefix: true,
      },
    });

    // 10. Atualizar páginas
    revalidatePath("/admin/fila");
    revalidatePath(`/${businessSlug}`);

    return {
      success: true,
      message: "Você foi cadastrado como profissional!",
      professional,
    };
  } catch (error) {
    console.error("[REGISTER_OWNER_PROFESSIONAL]", error);

    return {
      success: false,
      message: "Não foi possível cadastrar o profissional.",
    };
  }
}