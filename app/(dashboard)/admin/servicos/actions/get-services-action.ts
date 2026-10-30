"use server";

import prisma from "@/lib/prisma";


import type { ServiceItem } from "../schemas/service-schema";
import { requireQueueMember } from "../../actions/fila-permissions";

type GetServicesResponse =
  | {
      success: true;
      services: ServiceItem[];
    }
  | {
      success: false;
      message: string;
      services: ServiceItem[];
    };

export async function getServicesAction(): Promise<GetServicesResponse> {
  try {
    // Identifica a empresa à qual o usuário pertence.
    // Deve permitir OWNER, MANAGER e STAFF.
    const { businessId } = await requireQueueMember();

    // Busca os serviços da empresa.
    const services = await prisma.service.findMany({
      where: {
        businessId,
      },

      select: {
        id: true,
        name: true,
        description: true,
        durationMinutes: true,
        price: true,
        active: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedServices: ServiceItem[] = services.map(
      (service) => ({
        id: service.id,
        name: service.name,
        description: service.description ?? "",
        durationMinutes: service.durationMinutes,
        price: service.price?.toFixed(2) ?? "0.00",
        active: service.active,
      })
    );

    return {
      success: true,
      services: formattedServices,
    };
  } catch (error) {
    console.error("[GET_SERVICES_ERROR]", error);

    return {
      success: false,
      message: "Não foi possível carregar os serviços.",
      services: [],
    };
  }
}