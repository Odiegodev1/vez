import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";

import { TelaClient } from "./components/tela-client";

// Next.js 16: permite renderização dinâmica da rota.
export const instant = false;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TelaPage({
  params,
}: Props) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: {
      slug,
      status: "ACTIVE",
    },
    select: {
      slug: true,
    },
  });

  if (!business) {
    notFound();
  }

  return <TelaClient slug={business.slug} />;
}