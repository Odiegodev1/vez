import {
    Bell,
    Check,
    Clock3,
    RefreshCw,
    Scissors,
  } from "lucide-react";
  
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  
  import type { MyTicketData } from "../actions/get-my-ticket-action";
  
  type Props = {
    ticket: MyTicketData["ticket"];
    queue: MyTicketData["queue"];
    refreshing: boolean;
    onRefresh: () => void;
  };
  
  export function StatusFila({
    ticket,
    queue,
    refreshing,
    onRefresh,
  }: Props) {
    const myIndex = queue.findIndex(
      (entry) => entry.isMe
    );
  
    const visibleQueue = queue.filter(
      (entry) =>
        entry.isMe ||
        entry.status === "CALLED" ||
        entry.status === "IN_SERVICE"
    );
  
    const waitingBeforeMe =
      myIndex >= 0
        ? queue
            .slice(0, myIndex)
            .filter(
              (entry) => entry.status === "WAITING"
            )
        : [];
  
    const displayQueue = [
      ...visibleQueue,
      ...waitingBeforeMe,
    ].filter(
      (entry, index, array) =>
        array.findIndex(
          (item) => item.id === entry.id
        ) === index
    );
  
    const orderedQueue = displayQueue.sort(
      (a, b) =>
        queue.findIndex((item) => item.id === a.id) -
        queue.findIndex((item) => item.id === b.id)
    );
  
    const total = queue.length;
  
    const progress =
      myIndex >= 0 && total > 0
        ? ((myIndex + 1) / total) * 100
        : 0;
  
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-mono text-xl font-bold tracking-tight">
              Andamento da fila
            </h2>
  
            <p className="mt-1 text-xs text-cinzaapoio">
              Acompanhe sua posição em tempo real
            </p>
          </div>
  
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Atualizar fila"
            className="size-10 rounded-xl border-grafite/10 bg-white"
          >
            <RefreshCw
              className={`size-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
  
        {ticket.status === "WAITING" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-cinzaapoio">
              <span>Sua posição</span>
  
              <span className="font-semibold text-grafite">
                {myIndex >= 0
                  ? `${myIndex + 1} de ${total}`
                  : "Atualizando..."}
              </span>
            </div>
  
            <div className="h-2 overflow-hidden rounded-full bg-grafite/10">
              <div
                className="h-full rounded-full bg-lima transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
  
        <div className="space-y-2 rounded-[24px] border border-grafite/10 bg-white p-3 sm:p-4">
          {orderedQueue.length === 0 ? (
            <p className="py-8 text-center text-sm text-cinzaapoio">
              Nenhuma senha ativa nesta fila.
            </p>
          ) : (
            orderedQueue.map((entry) => {
              const isServing =
                entry.status === "IN_SERVICE";
  
              const isCalled =
                entry.status === "CALLED";
  
              return (
                <article
                  key={entry.id}
                  className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl px-3 py-3 ${
                    entry.isMe
                      ? "border border-lima bg-lima/30"
                      : "bg-nevoa/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                        entry.isMe
                          ? "bg-lima text-grafite"
                          : isServing
                            ? "bg-azulstatus/10 text-azulstatus"
                            : "bg-grafite/10 text-grafite"
                      }`}
                    >
                      {entry.ticketCode}
                    </div>
  
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {entry.isMe
                          ? "Você"
                          : isServing
                            ? "Em atendimento"
                            : isCalled
                              ? "Senha chamada"
                              : "Cliente na fila"}
                      </p>
  
                      <p className="text-xs text-cinzaapoio">
                        {entry.isMe
                          ? ticket.serviceName
                          : "Aguardando atendimento"}
                      </p>
                    </div>
                  </div>
  
                  {entry.isMe ? (
                    <Badge className="shrink-0 rounded-full bg-grafite px-3 py-1 text-lima">
                      Você
                    </Badge>
                  ) : isServing ? (
                    <Badge className="shrink-0 rounded-full bg-azulstatus px-3 py-1 text-white">
                      <Scissors className="mr-1 size-3" />
                      Atendendo
                    </Badge>
                  ) : isCalled ? (
                    <Badge className="shrink-0 rounded-full bg-lima px-3 py-1 text-grafite">
                      <Bell className="mr-1 size-3" />
                      Chamado
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="shrink-0 rounded-full"
                    >
                      <Clock3 className="mr-1 size-3" />
                      Aguardando
                    </Badge>
                  )}
                </article>
              );
            })
          )}
        </div>
  
        <div className="flex items-start gap-3 rounded-2xl border border-grafite/10 bg-white p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lima">
            {ticket.status === "CALLED" ? (
              <Bell className="size-5" />
            ) : (
              <Check className="size-5" />
            )}
          </div>
  
          <div>
            <p className="text-sm font-bold">
              {ticket.status === "CALLED"
                ? "Sua vez chegou!"
                : "Acompanhe por aqui"}
            </p>
  
            <p className="mt-1 text-xs leading-relaxed text-cinzaapoio">
              {ticket.status === "CALLED"
                ? "Dirija-se ao estabelecimento para iniciar seu atendimento."
                : "Esta página verifica automaticamente as atualizações da fila a cada 5 segundos. Não é necessário atualizar manualmente."}
            </p>
          </div>
        </div>
      </section>
    );
  }