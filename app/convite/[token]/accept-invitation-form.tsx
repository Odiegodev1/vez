"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { acceptMemberInvitationAction } from
  "@/app/(dashboard)/admin/configuracoes/actions/accept-member-invitation-action";

export function AcceptInvitationForm({
  token,
}: {
  token: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);

    try {
      const result = await acceptMemberInvitationAction(token);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Não foi possível aceitar o convite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-nevoa p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-lima text-2xl">
          V
        </div>

        <h1 className="text-2xl font-bold text-grafite">
          Convite para a equipe
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-cinzaapoio">
          Você foi convidado para participar da equipe de um
          estabelecimento no Vez.
        </p>

        <Button
          onClick={handleAccept}
          disabled={loading}
          className="mt-7 h-11 w-full bg-grafite text-white hover:bg-grafite/90"
        >
          {loading ? "Aceitando..." : "Aceitar convite"}
        </Button>
      </div>
    </main>
  );
}