import { notFound, redirect } from "next/navigation";

import { getMyTicketAction } from "../minhasenha/actions/get-my-ticket-action";
import { MinhaVezClient } from "./components/minha-vez-client";



export const instant = false;

type Props = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function MinhaVezPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (typeof token !== "string" || !token) {
    notFound();
  }

  const data = await getMyTicketAction(slug, token);

  if (!data) {
    notFound();
  }

  // Impede que uma senha ainda não chamada
  // acesse antecipadamente a tela de chamada.
  if (data.ticket.status === "WAITING") {
    redirect(
      `/${encodeURIComponent(slug)}/minhasenha?token=${encodeURIComponent(token)}`
    );
  }

  return (
    <MinhaVezClient
      slug={slug}
      token={token}
      initialData={data}
    />
  );
}