"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Megaphone,
  Play,
  UserX,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { updateEntryStatusAction } from "../actions/update-entry-status-action";

export type FilaEntry = {
  id: string;
  ticketCode: string;
  customerName: string;
  status: string;
  createdAt: string;
  calledAt: string | null;
  serviceName: string;
  durationMinutes: number;
  professionalId: string | null;
  professionalName: string | null;
  chairLabel: string | null;
};

export type FilaProfessional = {
  id: string;
  name: string;
  chairLabel: string | null;
};

type ActionType =
  | "CALL"
  | "START"
  | "CANCEL"
  | "NO_SHOW";

type Props = {
  entries: FilaEntry[];
  professionals: FilaProfessional[];
  onUpdated: () => Promise<void>;
};

export function ProximoFila({
  entries,
  professionals,
  onUpdated,
}: Props) {
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<
    Record<string, string>
  >({});

  const visibleEntries = entries
    .filter((entry) =>
      ["WAITING", "CALLED"].includes(entry.status)
    )
    .filter(
      (entry) =>
        filter === "all" ||
        entry.professionalId === filter ||
        (filter === "unassigned" &&
          entry.professionalId === null)
    )
    .sort((a, b) => {
      if (a.status === "CALLED" && b.status !== "CALLED") {
        return -1;
      }

      if (b.status === "CALLED" && a.status !== "CALLED") {
        return 1;
      }

      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    });

  async function handleAction(
    entry: FilaEntry,
    action: ActionType
  ) {
    const professionalId =
      assignments[entry.id] ??
      entry.professionalId ??
      undefined;

    if (
      (action === "CALL" || action === "START") &&
      !professionalId
    ) {
      toast.error("Selecione um profissional.");
      return;
    }

    try {
      setBusyId(entry.id);

      const result = await updateEntryStatusAction({
        entryId: entry.id,
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

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-mono text-xl font-black text-grafite">
            Próximos da fila
          </h2>
          <p className="mt-1 text-sm text-cinzaapoio">
            Chame e inicie os atendimentos.
          </p>
        </div>

        <Badge variant="outline">
          {visibleEntries.length} clientes
        </Badge>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", name: "Todos" },
          { id: "unassigned", name: "Sem preferência" },
          ...professionals,
        ].map((professional) => (
          <Button
            key={professional.id}
            type="button"
            size="sm"
            variant={
              filter === professional.id
                ? "default"
                : "outline"
            }
            onClick={() => setFilter(professional.id)}
            className={
              filter === professional.id
                ? "shrink-0 bg-grafite text-white"
                : "shrink-0"
            }
          >
            {professional.name}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleEntries.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-200 p-10 text-center">
            <p className="font-semibold text-grafite">
              Nenhum cliente aguardando
            </p>
            <p className="mt-2 text-sm text-cinzaapoio">
              Novos clientes aparecerão automaticamente.
            </p>
          </div>
        )}

        {visibleEntries.map((entry) => {
          const isCalled = entry.status === "CALLED";
          const isBusy = busyId === entry.id;

          return (
            <article
              key={entry.id}
              className={`rounded-2xl border p-4 transition ${
                isCalled
                  ? "border-lima bg-lima/35"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`rounded-xl px-3 py-2 font-mono text-xl font-black ${
                      isCalled
                        ? "bg-lima text-grafite"
                        : "bg-white text-grafite"
                    }`}
                  >
                    {entry.ticketCode}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-grafite">
                      {entry.customerName}
                    </p>

                    <p className="mt-1 text-xs text-cinzaapoio">
                      {entry.serviceName} •{" "}
                      {entry.durationMinutes} min
                    </p>

                    <p className="mt-1 text-xs text-cinzaapoio">
                      {entry.professionalName ??
                        "Qualquer profissional"}
                    </p>
                  </div>
                </div>

                <Badge
                  className={
                    isCalled
                      ? "bg-grafite text-white"
                      : "bg-white text-cinzaapoio"
                  }
                >
                  {isCalled ? "Chamando" : "Aguardando"}
                </Badge>
              </div>

              {!isCalled && (
                <div className="mt-4">
                  <label
                    htmlFor={`professional-${entry.id}`}
                    className="mb-2 block text-xs font-semibold text-cinzaapoio"
                  >
                    Profissional responsável
                  </label>

                  <select
                    id={`professional-${entry.id}`}
                    value={
                      assignments[entry.id] ??
                      entry.professionalId ??
                      ""
                    }
                    onChange={(event) =>
                      setAssignments((current) => ({
                        ...current,
                        [entry.id]: event.target.value,
                      }))
                    }
                    disabled={isBusy}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-grafite"
                  >
                    <option value="">
                      Selecione um profissional
                    </option>

                    {professionals.map((professional) => (
                      <option
                        key={professional.id}
                        value={professional.id}
                      >
                        {professional.name}
                        {professional.chairLabel
                          ? ` • ${professional.chairLabel}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {isCalled ? (
                  <>
                    <Button
                      disabled={isBusy}
                      onClick={() =>
                        void handleAction(entry, "START")
                      }
                      className="flex-1 bg-grafite text-white hover:bg-grafite/90"
                    >
                      {isBusy ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Play className="size-4" />
                      )}
                      Iniciar atendimento
                    </Button>

                    <Button
                      variant="outline"
                      disabled={isBusy}
                      onClick={() =>
                        void handleAction(entry, "NO_SHOW")
                      }
                    >
                      <UserX className="size-4" />
                      Não compareceu
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      disabled={isBusy}
                      onClick={() =>
                        void handleAction(entry, "CALL")
                      }
                      className="flex-1 bg-grafite text-white hover:bg-grafite/90"
                    >
                      {isBusy ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Megaphone className="size-4" />
                      )}
                      Chamar cliente
                    </Button>

                    <Button
                      variant="outline"
                      disabled={isBusy}
                      onClick={() =>
                        void handleAction(entry, "CANCEL")
                      }
                      aria-label="Remover da fila"
                    >
                      <X className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}