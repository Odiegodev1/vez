import { notFound } from "next/navigation";

import { getMyTicketAction } from "./actions/get-my-ticket-action";
import { MinhaSenhaClient } from "./components/minha-senha";


export const instant = false;

type Props = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function MinhaSenha({
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

  return (
    <MinhaSenhaClient
      slug={slug}
      token={token}
      initialData={data}
    />
  );
}