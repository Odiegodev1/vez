"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { HeaderComponents } from "../../components/headercomponents";

import {
  getMyTicketAction,
  type MyTicketData,
} from "../actions/get-my-ticket-action";

import { MeuBilhete } from "./MeuBilhete";
import { StatusFila } from "./StatusFila";
import { ButtonStatus } from "./ButtonStatus";

type Props = {
  slug: string;
  token: string;
  initialData: MyTicketData;
};

export function MinhaSenhaClient({
  slug,
  token,
  initialData,
}: Props) {
  const router = useRouter();

  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const calledUrl = `/${encodeURIComponent(slug)}/minhavez?token=${encodeURIComponent(token)}`;

  const refresh = useCallback(async () => {
    try {
      const updated = await getMyTicketAction(slug, token);

      if (!updated) return;

      if (updated.ticket.status === "CALLED") {
        router.replace(calledUrl);
        return;
      }

      setData(updated);
    } catch (error) {
      console.error("[REFRESH_MY_TICKET]", error);
    }
  }, [slug, token, router, calledUrl]);

  useEffect(() => {
    // Também funciona se a página já abrir
    // com a senha no estado CALLED.
    if (initialData.ticket.status === "CALLED") {
      router.replace(calledUrl);
      return;
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, 5000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [initialData.ticket.status, router, calledUrl, refresh]);

  async function handleRefresh() {
    setRefreshing(true);

    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <main className="min-h-dvh bg-nevoa px-4 py-5 text-grafite sm:py-8">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <HeaderComponents
          name={data.business.name}
          logoUrl={data.business.logoUrl}
          isOpen={data.business.isOpen}
        />

        <MeuBilhete ticket={data.ticket} />

        <StatusFila
          ticket={data.ticket}
          queue={data.queue}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <ButtonStatus
          slug={slug}
          token={token}
          status={data.ticket.status}
          onCanceled={refresh}
        />

        <p className="pb-6 text-center text-xs leading-relaxed text-cinzaapoio">
          Sua posição é atualizada automaticamente.
          Quando chegar sua vez, esta página mudará
          para a tela de chamada.
        </p>
      </div>
    </main>
  );
}