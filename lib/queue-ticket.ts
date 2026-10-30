import prisma from "@/lib/prisma";

type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

type GenerateQueueTicketInput = {
  tx: TransactionClient;
  businessId: string;
  day: string;
  prefix: string;
};

export async function generateQueueTicket({
  tx,
  businessId,
  day,
  prefix,
}: GenerateQueueTicketInput): Promise<string> {
  const counter = await tx.queueCounter.upsert({
    where: {
      businessId_day_prefix: {
        businessId,
        day,
        prefix,
      },
    },
    create: {
      businessId,
      day,
      prefix,
      lastNumber: 1,
    },
    update: {
      lastNumber: {
        increment: 1,
      },
    },
    select: {
      lastNumber: true,
    },
  });

  return `${prefix}-${String(counter.lastNumber).padStart(2, "0")}`;
}