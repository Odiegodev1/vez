"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireBusinessOwner } from "./member-permissions";

const schema = z.object({
  memberId: z.string().min(1),
  status: z.enum(["ACTIVE", "PENDING"]),
});

export async function removeMemberAction(input: {
  memberId: string;
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

    const { memberId, status } = parsed.data;

    if (status === "ACTIVE") {
      const result = await prisma.businessMember.deleteMany({
        where: {
          id: memberId,
          businessId,
          role: {
            not: "OWNER",
          },
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          message: "Não foi possível remover este membro.",
        };
      }
    } else {
      const result = await prisma.businessInvitation.deleteMany({
        where: {
          id: memberId,
          businessId,
          acceptedAt: null,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          message: "Convite não encontrado.",
        };
      }
    }

    revalidatePath("/admin/configuracoes");

    return {
      success: true,
      message:
        status === "ACTIVE"
          ? "Membro removido com sucesso!"
          : "Convite cancelado com sucesso!",
    };
  } catch (error) {
    console.error("[REMOVE_MEMBER_ERROR]", error);

    return {
      success: false,
      message: "Não foi possível concluir a remoção.",
    };
  }
}