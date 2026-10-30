"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  QrCode,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { getFilaAction } from "../actions/get-fila-action";
import { updateFilaStatusAction } from "../actions/update-fila-status-action";

import { GridCards } from "./GridCards";
import { ProximoFila } from "./Proximofila";
import { AgurdandoFila } from "./Aguardandofila";

type FilaData = NonNullable<
  Extract<
    Awaited<ReturnType<typeof getFilaAction>>,
    { success: true }
  >["data"]
>;

type Props = {
  initialData: FilaData;
};

export function FilaClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [updating, setUpdating] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(true);
  const [origin, setOrigin] = useState("");

  const requestInFlight = useRef(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;

    requestInFlight.current = true;

    try {
      const result = await getFilaAction();

      if (result.success) {
        setData(result.data);
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error("[FILA_REFRESH_ERROR]", error);
      setConnected(false);
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, 3000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    return () => {
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, [refresh]);

  async function handleManualRefresh() {
    setUpdating(true);
    await refresh();
    setUpdating(false);
  }

  async function handleToggleQueue(value: boolean) {
    setChangingStatus(true);

    try {
      const result = await updateFilaStatusAction(value);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      await refresh();
    } catch {
      toast.error("Erro ao alterar a fila.");
    } finally {
      setChangingStatus(false);
    }
  }

  const publicUrl = origin
    ? `${origin}/${encodeURIComponent(data.business.slug)}`
    : "";

  const telaUrl = publicUrl ? `${publicUrl}/tela` : "";

  async function copyLink() {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);
      toast.success("Link copiado!");

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: data.business.timezone,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 bg-nevoa p-4 md:p-6">
      {/* HEADER */}

      <header className="flex flex-col justify-between gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
        <div className="font-mono">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                connected ? "bg-emerald-500" : "bg-red-500"
              }`}
            />

            <span className="text-xs font-semibold text-cinzaapoio">
              {connected
                ? "Painel sincronizado"
                : "Conexão interrompida"}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-grafite md:text-4xl">
            Fila ao vivo
          </h1>

          <p className="mt-2 text-sm capitalize text-cinzaapoio">
            {currentDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => void handleManualRefresh()}
            disabled={updating}
            className="rounded-xl"
          >
            <RefreshCw
              className={`size-4 ${
                updating ? "animate-spin" : ""
              }`}
            />
            Atualizar
          </Button>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <div
              className={`size-2.5 rounded-full ${
                data.business.isOpen
                  ? "animate-pulse bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            <span className="text-sm font-bold text-grafite">
              {data.business.isOpen
                ? "Fila aberta"
                : "Fila fechada"}
            </span>

            {changingStatus ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Switch
                checked={data.business.isOpen}
                disabled={!data.canManageSettings}
                onCheckedChange={(value) =>
                  void handleToggleQueue(value)
                }
                aria-label="Abrir ou fechar a fila"
              />
            )}
          </div>
        </div>
      </header>

      {/* INDICADORES */}

      <GridCards
        waiting={data.stats.waiting}
        called={data.stats.called}
        inService={data.stats.inService}
        averageMinutes={data.stats.averageMinutes}
      />

      {/* PAINEL OPERACIONAL */}

      <main className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
  {/* MOBILE: CONTROLE DAS CADEIRAS PRIMEIRO */}

  <div className="order-1 min-w-0 lg:order-2">
  <AgurdandoFila
  entries={data.entries}
  professionals={data.professionals}
  onUpdated={refresh}
  canRegisterOwner={data.isOwner}
/>
  </div>

  {/* LISTA GERAL */}

  <div className="order-2 min-w-0 lg:order-1">
    <ProximoFila
      entries={data.entries}
      professionals={data.professionals}
      onUpdated={refresh}
    />
  </div>
</main>
      <footer className="flex items-center justify-between border-t border-zinc-200 pt-5 text-xs text-cinzaapoio">
        <span>
          {data.business.name}
        </span>

        <span>
          Vez • Gestão de filas
        </span>
      </footer>
    </div>
  );
}