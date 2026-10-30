"use server";

import prisma from "@/lib/prisma";
import { requireBusinessOwner } from "./member-permissions";

import type { TeamMember } from "../schemas/member-schema";

type GetMembersResult =
  | {
      success: true;
      members: TeamMember[];
    }
  | {
      success: false;
      message: string;
      members: [];
    };

export async function getMembersAction(): Promise<GetMembersResult> {
  try {
    const { businessId } = await requireBusinessOwner();

    const [members, invitations] = await Promise.all([
      prisma.businessMember.findMany({
        where: { businessId },

        select: {
          id: true,
          role: true,

          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          id: "asc",
        },
      }),

      prisma.businessInvitation.findMany({
        where: {
          businessId,
          acceptedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const activeMembers: TeamMember[] = members.map(
      (member) => ({
        id: member.id,
        name: member.user.name ?? "Sem nome",
        email: member.user.email ?? "",
        role: member.role,
        status: "ACTIVE",
        isOwner: member.role === "OWNER",
      })
    );

    const pendingMembers: TeamMember[] = invitations.map(
      (invitation) => ({
        id: invitation.id,
        name: invitation.name,
        email: invitation.email,
        role: invitation.role,
        status: "PENDING",
        isOwner: false,
      })
    );

    return {
      success: true,
      members: [...activeMembers, ...pendingMembers],
    };
  } catch (error) {
    console.error("[GET_MEMBERS_ERROR]", error);

    return {
      success: false,
      message: "Não foi possível carregar a equipe.",
      members: [],
    };
  }
}