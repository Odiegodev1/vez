"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Clock3,
  Loader2,
  Maximize2,
  QrCode,
  UserRound,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";

import { getTelaAction } from "../actions/get-tela-action";

type TelaData = NonNullable<
  Extract<
    Awaited<ReturnType<typeof getTelaAction>>,
    { success: true }
  >["data"]
>;

type Props = {
  slug: string;
};

function formatCustomerName(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length <= 1) {
    return name;
  }

  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

export function TelaClient({ slug }: Props) {
  const [data, setData] = useState<TelaData | null>(null);

  const [loading, setLoading] = useState(true);

  const [connected, setConnected] = useState(true);

  const [horaAtual, setHoraAtual] = useState("--:--");

  const [publicUrl, setPublicUrl] = useState("");

  const lastCalledId = useRef<string | null>(null);

  // ============================================
  // BUSCAR DADOS
  // ============================================

  const loadData = useCallback(async () => {
    try {
      const result = await getTelaAction(slug);

      if (!result.success) {
        setConnected(false);
        return;
      }

      setData(result.data);
      setConnected(true);

      if (
        result.data.calling &&
        lastCalledId.current !== result.data.calling.id
      ) {
        lastCalledId.current = result.data.calling.id;
      }
    } catch (error) {
      console.error("[TELA_UPDATE_ERROR]", error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // ============================================
  // ATUALIZAÇÃO AUTOMÁTICA
  // ============================================

  useEffect(() => {
    void loadData();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadData();
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadData]);

  // ============================================
  // RELÓGIO
  // ============================================

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const time = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone:
          data?.business.timezone ?? "America/Sao_Paulo",
      });

      setHoraAtual(time);
    };

    updateClock();

    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, [data?.business.timezone]);

  // ============================================
  // URL PÚBLICA
  // ============================================

  useEffect(() => {
    setPublicUrl(
      `${window.location.origin}/${slug}`
    );
  }, [slug]);

  // ============================================
  // TELA CHEIA
  // ============================================

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("[FULLSCREEN_ERROR]", error);
    }
  }

  // ============================================
  // LOADING INICIAL
  // ============================================

  if (loading && !data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-grafite">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-lima">
            <span className="font-mono text-5xl font-black text-grafite">
              V
            </span>
          </div>

          <Loader2 className="size-7 animate-spin text-lima" />

          <p className="font-mono text-sm text-zinc-400">
            Conectando ao telão...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-grafite p-6 text-center">
        <WifiOff className="size-12 text-zinc-500" />

        <h1 className="font-mono text-2xl font-bold text-white">
          Não foi possível carregar o telão
        </h1>

        <button
          onClick={() => void loadData()}
          className="rounded-xl bg-lima px-6 py-3 font-bold text-grafite"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { business, calling, waiting, waitingCount } = data;

  return (
    <div className="flex h-dvh w-screen select-none flex-col overflow-hidden bg-grafite p-4 font-mono text-white sm:p-6 lg:p-8">
      {/* ========================================
          HEADER
      ======================================== */}

      <header className="flex shrink-0 items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          {/* LOGO */}

          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-lima text-3xl font-black text-grafite lg:size-20 lg:text-5xl">
            {business.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-lima">
              Vez • Painel de atendimento
            </p>

            <h1 className="truncate text-2xl font-black tracking-tight text-white md:text-4xl xl:text-5xl">
              {business.name}
            </h1>
          </div>
        </div>

        {/* STATUS E HORÁRIO */}

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 lg:flex">
            {connected ? (
              <>
                <Wifi className="size-5 text-lima" />

                <span className="text-sm font-bold">
                  Fila ao vivo
                </span>

                <span className="relative ml-2 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lima opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-lima" />
                </span>
              </>
            ) : (
              <>
                <WifiOff className="size-5 text-red-400" />

                <span className="text-sm text-red-400">
                  Reconectando
                </span>
              </>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-2xl font-black tabular-nums text-lima md:text-4xl lg:px-6 lg:text-5xl">
            {horaAtual}
          </div>

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label="Alternar tela cheia"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-400 transition hover:text-white"
          >
            <Maximize2 className="size-5" />
          </button>
        </div>
      </header>

      {/* ========================================
          PAINEL PRINCIPAL
      ======================================== */}

      <main className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ====================================
            CHAMANDO AGORA
        ==================================== */}

        <section className="flex min-h-0 flex-col justify-between overflow-hidden rounded-3xl bg-lima p-6 text-grafite lg:p-8 xl:p-10">
          <div className="flex items-center justify-between border-b border-grafite/20 pb-5">
            <h2 className="text-xl font-black uppercase tracking-widest md:text-2xl xl:text-3xl">
              Chamando agora
            </h2>

            <span className="flex items-center gap-2 rounded-full bg-grafite/10 px-4 py-2 text-xs font-black uppercase">
              <span className="size-2 animate-pulse rounded-full bg-grafite" />
              Atendimento
            </span>
          </div>

          {calling ? (
            <div
              key={`${calling.id}-${calling.calledAt}`}
              className="flex min-h-0 flex-1 flex-col justify-center "
            >
              {/* SENHA */}

              <p className="text-xs font-black uppercase tracking-[0.3em] text-grafite/60">
                Senha chamada
              </p>

              <h3 className="mt-3 truncate text-[clamp(5rem,11vw,12rem)] font-black leading-none tracking-tighter">
                {calling.ticketCode}
              </h3>

              {/* CLIENTE */}

              <p className="mt-6 truncate text-[clamp(1.5rem,3.5vw,3.5rem)] font-black tracking-tight">
                {calling.customerName}
              </p>

              {calling.serviceName && (
                <p className="mt-2 truncate text-base font-semibold text-grafite/65 xl:text-xl">
                  {calling.serviceName}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
              <div className="flex size-24 items-center justify-center rounded-3xl bg-grafite/10">
                <Clock3 className="size-12" />
              </div>

              <h3 className="text-3xl font-black xl:text-5xl">
                Aguardando chamada
              </h3>

              <p className="max-w-md text-lg font-medium text-grafite/60">
                A próxima senha aparecerá aqui quando
                um cliente for chamado.
              </p>
            </div>
          )}

          {/* PROFISSIONAL / CADEIRA */}

          <div className="flex min-h-20 shrink-0 items-center gap-4 rounded-2xl bg-grafite/10 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-grafite text-lima">
              <ArrowRight className="size-7" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-grafite/60">
                Dirija-se para
              </p>

              <p className="truncate text-xl font-black xl:text-2xl">
                {calling
                  ? [
                      calling.chairLabel,
                      calling.professionalName,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "Aguarde orientação"
                  : "Aguardando atendimento"}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================
            PRÓXIMOS DA FILA
        ==================================== */}

        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 lg:p-8">
          <div className="flex shrink-0 items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white xl:text-2xl">
                Próximos da fila
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Acompanhe sua posição em tempo real
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 ">
              <Users className="size-5 text-lima" />

              <span className="text-xl font-black text-white">
                {waitingCount}
              </span>
            </div>
          </div>

          {/* LISTA */}

          <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
            {waiting.length > 0 ? (
              waiting.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex  h-20 items-center  justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-5"
                >
                    
                  <div className="flex min-w-0 items-center gap-5">
                    <span className="shrink-0 text-2xl font-black text-lima xl:text-3xl">
                      {entry.ticketCode}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-white xl:text-xl">
                        {formatCustomerName(
                          entry.customerName
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {index === 0
                          ? "Próximo a ser chamado"
                          : `${index + 1}º na espera`}
                      </p>
                    </div>
                  </div>

                  <UserRound className="size-6 shrink-0 text-zinc-600" />
                </div>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800">
                <Users className="size-10 text-zinc-600" />

                <p className="text-lg font-semibold text-zinc-400">
                  Nenhum cliente aguardando
                </p>
              </div>
            )}
          </div>

          {/* ====================================
              QR CODE
          ==================================== */}

          <div className="mt-5 flex shrink-0 items-center gap-5 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-4 xl:p-5">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-white p-2 xl:size-28">
              {publicUrl ? (
                <QRCodeSVG
                  value={publicUrl}
                  size={110}
                  level="M"
                  marginSize={0}
                  className="size-full"
                />
              ) : (
                <QrCode className="size-12 text-grafite" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-black uppercase tracking-tight text-lima xl:text-xl">
                Entre na fila pelo celular
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-zinc-400 xl:text-sm">
                Aponte a câmera para o QR Code e
                garanta sua vaga sem sair do lugar.
              </p>

              <p className="mt-2 truncate text-xs font-bold text-zinc-500">
                {publicUrl
                  ? publicUrl.replace(/^https?:\/\//, "")
                  : ""}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================
          RODAPÉ
      ======================================== */}

      <footer className="mt-5 flex shrink-0 items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-black text-lima">
            VEZ.
          </span>

          <span>
            Sua vez, sem complicação.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              connected ? "bg-lima" : "bg-red-500"
            }`}
          />

          <span>
            {connected
              ? "Atualização automática"
              : "Tentando reconectar..."}
          </span>
        </div>
      </footer>
    </div>
  );
}