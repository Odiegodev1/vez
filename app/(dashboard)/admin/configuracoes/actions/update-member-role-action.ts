"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireBusinessOwner } from "./member-permissions";

const schema = z.object({
  memberId: z.string().min(1),
  role: z.enum(["MANAGER", "STAFF"]),
  status: z.enum(["ACTIVE", "PENDING"]),
});

export async function updateMemberRoleAction(input: {
  memberId: string;
  role: "MANAGER" | "STAFF";
  status: "ACTIVE" | "PENDING";
}) {
  try {
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: "Dados inválidos.",
      };
    }

    const { businessId } = await requireBusinessOwner();

    const { memberId, role, status } = parsed.data;

    if (status === "ACTIVE") {
      const result = await prisma.businessMember.updateMany({
        where: {
          id: memberId,
          businessId,
          role: {
            not: "OWNER",
          },
        },
        data: {
          role,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          message: "Membro não encontrado ou protegido.",
        };
      }
    } else {
      const result = await prisma.businessInvitation.updateMany({
        where: {
          id: memberId,
          businessId,
          acceptedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          role,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          message: "Convite não encontrado ou expirado.",
        };
      }
    }

    revalidatePath("/admin/configuracoes");

    return {
      success: true,
      message: "Permissão atualizada com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_MEMBER_ROLE_ERROR]", error);

    return {
      success: false,
      message: "Não foi possível atualizar a permissão.",
    };
  }
}