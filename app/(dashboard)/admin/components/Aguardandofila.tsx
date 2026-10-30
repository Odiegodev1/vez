"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Megaphone,
  Play,
  Scissors,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { updateEntryStatusAction } from "../actions/update-entry-status-action";
import { registerOwnerProfessionalAction } from "../actions/register-owner-professional-action";

import type {
  FilaEntry,
  FilaProfessional,
} from "./Proximofila";

type Props = {
  entries: FilaEntry[];
  professionals: FilaProfessional[];
  onUpdated: () => Promise<void>;
  canRegisterOwner?: boolean;
};

type QueueAction = "CALL" | "START" | "FINISH";

export function AgurdandoFila({
  entries,
  professionals,
  onUpdated,
  canRegisterOwner = false,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const inService = entries.filter(
    (entry) => entry.status === "IN_SERVICE"
  );

  const called = entries.filter(
    (entry) => entry.status === "CALLED"
  );

  const waiting = entries
    .filter((entry) => entry.status === "WAITING")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

  const busyProfessionals = new Set(
    [...inService, ...called]
      .map((entry) => entry.professionalId)
      .filter(Boolean)
  );

  const availableCount = professionals.filter(
    (professional) =>
      !busyProfessionals.has(professional.id)
  ).length;

  async function handleAction(
    entryId: string,
    action: QueueAction,
    professionalId?: string
  ) {
    try {
      setBusyId(entryId);

      const result = await updateEntryStatusAction({
        entryId,
        action,
        professionalId,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      await onUpdated();
    } catch {
      toast.error("Não foi possível atualizar o atendimento.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRegisterOwner() {
    try {
      setRegistering(true);

      const result = await registerOwnerProfessionalAction();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      await onUpdated();
    } catch {
      toast.error("Não foi possível cadastrar o proprietário.");
    } finally {
      setRegistering(false);
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl bg-grafite font-mono text-white">
      {/* HEADER */}

      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-lima">
              <Scissors className="size-4" />

              <span className="text-[10px] font-bold uppercase tracking-widest">
                Controle de atendimento
              </span>
            </div>

            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Minhas cadeiras
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Chame, atenda e finalize em poucos toques.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-lima px-3 py-1.5 text-xs font-black text-grafite">
            {professionals.length}
          </span>
        </div>

        {/* RESUMO */}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Users className="size-3.5" />

              <span className="text-[11px]">
                Ocupadas
              </span>
            </div>

            <p className="mt-2 text-2xl font-black">
              {busyProfessionals.size}
            </p>
          </div>

          <div className="rounded-xl border border-lima/20 bg-lima/10 p-3">
            <div className="flex items-center gap-2 text-lima">
              <CheckCircle2 className="size-3.5" />

              <span className="text-[11px]">
                Livres
              </span>
            </div>

            <p className="mt-2 text-2xl font-black">
              {availableCount}
            </p>
          </div>
        </div>
      </div>

      {/* CADEIRAS */}

      <div className="space-y-3 p-3 sm:p-5">
        {professionals.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-center">
            <Scissors className="mx-auto size-8 text-zinc-500" />

            <h3 className="mt-3 text-sm font-bold">
              Nenhum profissional cadastrado
            </h3>

            <p className="mt-2 text-xs text-zinc-400">
              Cadastre um profissional para começar.
            </p>
          </div>
        )}

        {professionals.map((professional) => {
          const current = inService.find(
            (entry) =>
              entry.professionalId === professional.id
          );

          const calledEntry = called.find(
            (entry) =>
              entry.professionalId === professional.id
          );

          const nextEntry = waiting.find(
            (entry) =>
              entry.professionalId === professional.id ||
              entry.professionalId === null
          );

          const isBusy = Boolean(current);
          const isCalling = Boolean(calledEntry);

          const isAvailable = !isBusy && !isCalling;

          const activeEntry = current ?? calledEntry;

          const isLoading =
            activeEntry?.id === busyId ||
            nextEntry?.id === busyId;

          return (
            <article
              key={professional.id}
              className="min-w-0 overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900"
            >
              {/* PROFISSIONAL */}

              <div className="flex items-center justify-between gap-3 border-b border-white/10 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base font-black">
                    {professional.name
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold">
                      {professional.name}
                    </h3>

                    <p className="mt-1 truncate text-[11px] text-zinc-400">
                      {professional.chairLabel ??
                        "Profissional"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                    isBusy
                      ? "bg-lima/15 text-lima"
                      : isCalling
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {isBusy
                    ? "Atendendo"
                    : isCalling
                      ? "Chamando"
                      : "Livre"}
                </span>
              </div>

              {/* CLIENTE ATUAL */}

              {activeEntry && (
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-lima px-3 py-2 font-mono text-xl font-black text-grafite">
                      {activeEntry.ticketCode}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold sm:text-base">
                        {activeEntry.customerName}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {activeEntry.serviceName}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Clock3 className="size-3.5" />

                        {activeEntry.durationMinutes} min previstos
                      </p>
                    </div>
                  </div>

                  {isCalling && calledEntry && (
                    <Button
                      disabled={isLoading}
                      onClick={() =>
                        void handleAction(
                          calledEntry.id,
                          "START",
                          professional.id
                        )
                      }
                      className="mt-4 h-12 w-full rounded-xl bg-lima text-sm font-black text-grafite hover:bg-lima/90"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Play className="size-4" />
                      )}

                      Iniciar atendimento
                    </Button>
                  )}

                  {isBusy && current && (
                    <Button
                      disabled={isLoading}
                      onClick={() =>
                        void handleAction(
                          current.id,
                          "FINISH"
                        )
                      }
                      className="mt-4 h-12 w-full rounded-xl bg-lima text-sm font-black text-grafite hover:bg-lima/90"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}

                      Finalizar atendimento
                    </Button>
                  )}
                </div>
              )}

              {/* CADEIRA DISPONÍVEL */}

              {isAvailable && (
                <div className="p-3.5 sm:p-4">
                  {nextEntry ? (
                    <>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="size-2 rounded-full bg-lima" />

                        <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                          Próximo cliente
                        </p>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-xl font-black">
                          {nextEntry.ticketCode}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {nextEntry.customerName}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            {nextEntry.serviceName}
                          </p>
                        </div>
                      </div>

                      <Button
                        disabled={isLoading}
                        onClick={() =>
                          void handleAction(
                            nextEntry.id,
                            "CALL",
                            professional.id
                          )
                        }
                        className="mt-4 h-12 w-full rounded-xl bg-lima text-sm font-black text-grafite hover:bg-lima/90"
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Megaphone className="size-4" />
                        )}

                        Chamar próximo cliente
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 py-3">
                      <CheckCircle2 className="size-6 shrink-0 text-emerald-400" />

                      <div>
                        <p className="text-sm font-semibold">
                          Cadeira disponível
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          Nenhum cliente aguardando.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {/* CADASTRO DO DONO */}

        {canRegisterOwner && (
          <div className="rounded-2xl border border-lima/20 bg-lima/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lima text-grafite">
                <UserPlus className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">
                  Você também atende clientes?
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Cadastre-se como profissional e comece a
                  atender pela sua própria cadeira.
                </p>
              </div>
            </div>

            <Button
              disabled={registering}
              onClick={() => void handleRegisterOwner()}
              className="mt-4 h-12 w-full rounded-xl bg-lima font-bold text-grafite hover:bg-lima/90"
            >
              {registering ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}

              Sou proprietário e também atendo
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}