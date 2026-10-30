import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { processQueueTimeouts } from "@/lib/queue/process-queue-timeouts";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[QUEUE_CRON] CRON_SECRET não configurado.");

    return NextResponse.json(
      {
        success: false,
        message: "Serviço não configurado.",
      },
      {
        status: 503,
      }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      {
        success: false,
        message: "Não autorizado.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: "ACTIVE",
        queueSettings: {
          is: {
            isOpen: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    let expired = 0;
    let called = 0;
    let failedBusinesses = 0;

    for (const business of businesses) {
      try {
        const result = await processQueueTimeouts(business.id);

        expired += result.expired;
        called += result.called;
      } catch (error) {
        failedBusinesses++;

        console.error(
          `[QUEUE_CRON] Erro no estabelecimento ${business.id}`,
          error
        );
      }
    }

    return NextResponse.json(
      {
        success: failedBusinesses === 0,
        processedBusinesses: businesses.length,
        failedBusinesses,
        expired,
        called,
        processedAt: new Date().toISOString(),
      },
      {
        status: failedBusinesses > 0 ? 500 : 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[QUEUE_CRON_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar as filas.",
      },
      {
        status: 500,
      }
    );
  }
}