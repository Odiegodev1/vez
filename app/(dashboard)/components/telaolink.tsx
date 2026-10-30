"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Monitor } from "lucide-react";

export function TelaoLink() {
  const { data: session, status } = useSession();

  const companySlug = session?.user?.companySlug;

  if (status === "loading") {
    return <span>Carregando...</span>;
  }

  if (!companySlug) {
    return <span>Empresa não encontrada</span>;
  }

  return (
    <Link href={`/admin/${companySlug}/tela`}>
      <Monitor className="size-4" />
      <span>Telão</span>
    </Link>
  );
}