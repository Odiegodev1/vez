import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { acceptMemberInvitationAction } from
  "@/app/(dashboard)/admin/configuracoes/actions/accept-member-invitation-action";
import { AcceptInvitationForm } from "./accept-invitation-form";



type Props = {
  params: Promise<{
    token: string;
  }>;
};

async function InvitationContent({ params }: Props) {
  const { token } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/convite/${token}`)}`
    );
  }

  return <AcceptInvitationForm token={token} />;
}

export default function InvitationPage(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-nevoa">
          <p className="text-cinzaapoio">
            Carregando convite...
          </p>
        </main>
      }
    >
      <InvitationContent {...props} />
    </Suspense>
  );
}