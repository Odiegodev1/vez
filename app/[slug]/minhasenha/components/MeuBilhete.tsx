import {
  CheckCircle2,
  Clock3,
  Scissors,
  Users,
} from "lucide-react";

import type { MyTicketData } from "../actions/get-my-ticket-action";

type Props = {
  ticket: MyTicketData["ticket"];
};

const STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CALLED: "Sua vez chegou!",
  IN_SERVICE: "Em atendimento",
  COMPLETED: "Atendimento concluído",
  CANCELED: "Senha cancelada",
  EXPIRED: "Senha expirada",
  NO_SHOW: "Não compareceu",
};

export function MeuBilhete({ ticket }: Props) {
  const isCalled = ticket.status === "CALLED";
  const isInService = ticket.status === "IN_SERVICE";
  const isCompleted = ticket.status === "COMPLETED";

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-grafite text-white shadow-xl shadow-grafite/10">
      <div className="p-6 sm:p-8">
        <div className=" gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Sua senha
            </p>

            <h2 className="mt-2 font-mono text-6xl font-extrabold tracking-[-0.08em] text-lima sm:text-7xl">
              {ticket.code}
            </h2>
          </div>

          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white">
            {STATUS_LABELS[ticket.status] ??
              ticket.status}
          </span>
        </div>

        <div className="mt-5 space-y-1">
          <p className="text-base font-semibold">
            {ticket.customerName}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Scissors className="size-4" />

            <span>{ticket.serviceName}</span>

            <span>·</span>

            <span>{ticket.professionalName}</span>
          </div>

          {ticket.chairLabel && (
            <p className="text-xs text-white/50">
              {ticket.chairLabel}
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-3 -top-3 size-6 rounded-full bg-nevoa" />

        <div className="absolute -right-3 -top-3 size-6 rounded-full bg-nevoa" />

        <div className="mx-6 border-t-2 border-dashed border-white/20" />
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 py-6 sm:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Users className="size-4" />
            Na sua frente
          </div>

          <p className="mt-2 text-3xl font-bold">
            {ticket.status === "WAITING"
              ? ticket.peopleAhead
              : "—"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Clock3 className="size-4" />
            Previsão
          </div>

          <p className="mt-2 text-3xl font-bold">
            {ticket.status === "WAITING"
              ? ticket.estimatedMinutes === 0
                ? "Em breve"
                : `~${ticket.estimatedMinutes} min`
              : "—"}
          </p>
        </div>
      </div>

      {(isCalled || isInService || isCompleted) && (
        <div className="flex items-center gap-3 bg-lima px-6 py-4 text-grafite">
          <CheckCircle2 className="size-6 shrink-0" />

          <p className="text-sm font-bold">
            {isCalled &&
              "Sua senha foi chamada! Dirija-se ao profissional."}

            {isInService &&
              "Seu atendimento está em andamento."}

            {isCompleted &&
              "Atendimento finalizado. Obrigado pela visita!"}
          </p>
        </div>
      )}
    </section>
  );
}