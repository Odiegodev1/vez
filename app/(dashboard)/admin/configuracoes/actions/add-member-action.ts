"use server";

import { randomBytes, createHash } from "node:crypto";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import {
  memberSchema,
  type MemberFormValues,
} from "../schemas/member-schema";

import { requireBusinessOwner } from "./member-permissions";

const SETTINGS_PATH = "/admin/configuracoes";

export async function addMemberAction(input: MemberFormValues) {
  try {
    const parsed = memberSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false as const,
        message:
          parsed.error.issues[0]?.message ?? "Dados inválidos.",
      };
    }

    const { businessId } = await requireBusinessOwner();
    const { name, email, role } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },

      select: {
        id: true,
      },
    });

    // Impedir membros duplicados.
    if (user) {
      const existingMember = await prisma.businessMember.findFirst({
        where: {
          businessId,
          userId: user.id,
        },
      });

      if (existingMember) {
        return {
          success: false as const,
          message: "Este usuário já faz parte da equipe.",
        };
      }
    }

    // Criar um convite para que o usuário aceite o acesso.
    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await prisma.businessInvitation.upsert({
      where: {
        businessId_email: {
          businessId,
          email,
        },
      },

      create: {
        businessId,
        name,
        email,
        role,
        tokenHash,
        expiresAt,
      },

      update: {
        name,
        role,
        tokenHash,
        expiresAt,
        acceptedAt: null,
      },
    });

    revalidatePath(SETTINGS_PATH);

    return {
      success: true as const,
      message: "Convite criado com sucesso.",
      // Link relativo: o frontend pode montar o endereço completo.
      invitePath: `/convite/${token}`,
    };
  } catch (error) {
    console.error("[ADD_MEMBER_ERROR]", error);

    return {
      success: false as const,
      message: "Não foi possível adicionar o membro.",
    };
  }
}