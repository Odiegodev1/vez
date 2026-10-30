"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BellRing,
  CheckCircle2,
  Scissors,
} from "lucide-react";

import { HeaderComponents } from "../../components/headercomponents";

import {
  getMyTicketAction,
  type MyTicketData,
} from "../../minhasenha/actions/get-my-ticket-action";

import { CtaVez } from "./CtaVez";
import { MeuBilhetevez } from "./MeuBilhetevez";
import { CardTime } from "./CardTime";

type Props = {
  slug: string;
  token: string;
  initialData: MyTicketData;
};

export function MinhaVezClient({
  slug,
  token,
  initialData,
}: Props) {
  const [data, setData] = useState(initialData);

  const refresh = useCallback(async () => {
    try {
      const updated = await getMyTicketAction(slug, token);

      if (updated) {
        setData(updated);
      }
    } catch (error) {
      console.error("[REFRESH_MY_TURN]", error);
    }
  }, [slug, token]);

  useEffect(() => {
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
  }, [refresh]);

  const status = data.ticket.status;
  const isCalled = status === "CALLED";
  const isInService = status === "IN_SERVICE";
  const isCompleted = status === "COMPLETED";

  const isFinished =
    status === "CANCELED" ||
    status === "EXPIRED" ||
    status === "NO_SHOW";

  return (
    <main className="min-h-dvh bg-lima px-4 py-5 text-grafite sm:py-8">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <HeaderComponents
          name={data.business.name}
          logoUrl={data.business.logoUrl}
          isOpen={data.business.isOpen}
        />

        <div
          role="status"
          aria-live="polite"
          className="flex w-fit max-w-full items-center gap-2 rounded-full bg-grafite px-4 py-2.5 text-xs font-bold text-lima shadow-sm"
        >
          {isCalled ? (
            <BellRing className="size-4 shrink-0 animate-pulse" />
          ) : isCompleted ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <Scissors className="size-4 shrink-0" />
          )}

          <span>
            {isCalled
              ? "Chamando agora"
              : isInService
                ? "Atendimento em andamento"
                : isCompleted
                  ? "Atendimento concluído"
                  : "Senha encerrada"}
          </span>
        </div>

        <CtaVez
          customerName={data.ticket.customerName}
          professionalName={data.ticket.professionalName}
          status={status}
        />

        <MeuBilhetevez ticket={data.ticket} />

        {isCalled && (
       <CardTime
       calledAt={data.ticket.calledAt}
       callTimeoutMinutes={data.callTimeoutMinutes}
     />
        )}

        {isInService && (
          <div className="rounded-2xl border border-grafite/15 bg-nevoa p-4">
            <p className="text-sm font-semibold">
              Seu atendimento já começou.
            </p>
            <p className="mt-1 text-sm text-cinzaapoio">
              Aproveite seu atendimento!
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="rounded-2xl border border-grafite/15 bg-nevoa p-4">
            <p className="font-semibold">
              Obrigado pela visita!
            </p>
            <p className="mt-1 text-sm text-cinzaapoio">
              Esperamos ver você novamente.
            </p>
          </div>
        )}

        {isFinished && (
          <div className="rounded-2xl bg-nevoa p-4 text-sm font-semibold">
            Esta senha não está mais ativa.
          </div>
        )}

        {isCalled && (
          <div className="rounded-2xl bg-grafite px-4 py-4 text-center text-sm font-semibold text-lima">
            Dirija-se ao estabelecimento para ser atendido.
          </div>
        )}

        <p className="pb-6 text-center text-xs text-grafite/60">
          As informações são atualizadas automaticamente.
        </p>
      </div>
    </main>
  );
}