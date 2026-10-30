"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe2,
  ImageDown,
  Link2,
  Loader2,
  MessageCircle,
  Monitor,
  Printer,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Business = {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
};

type Props = {
  business: Business;
};

type DownloadType = "poster" | "qr" | null;

function sanitizeFilename(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "") || "estabelecimento"
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function QrCodeClient({ business }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] =
    useState<DownloadType>(null);

  const [copied, setCopied] = useState(false);

  const [origin, setOrigin] = useState("");

  const publicUrl = useMemo(() => {
    if (!origin) return "";

    return `${origin}/${encodeURIComponent(business.slug)}`;
  }, [origin, business.slug]);

  const displayUrl = publicUrl
    ? publicUrl.replace(/^https?:\/\//, "")
    : `vez.digital/${business.slug}`;

  const filename = sanitizeFilename(business.name);

  const originRef = useCallback((node: HTMLDivElement | null) => {
    if (node && typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  async function handleCopy() {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);
      toast.success("Link copiado!");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  function handleWhatsApp() {
    if (!publicUrl) return;

    const message = [
      `Olá! 👋`,
      "",
      `Entre na fila da ${business.name} pelo celular.`,
      "",
      `Acesse: ${publicUrl}`,
      "",
      "Acompanhe sua vez sem precisar ficar esperando no balcão!",
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleDownloadPoster() {
    if (!posterRef.current || downloading) return;

    try {
      setDownloading("poster");

      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#111412",
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      downloadBlob(blob, `vez-cartaz-${filename}.png`);

      toast.success("Cartaz baixado com sucesso!");
    } catch (error) {
      console.error("[POSTER_DOWNLOAD_ERROR]", error);
      toast.error("Não foi possível gerar o cartaz.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadQr() {
    if (!qrRef.current || downloading) return;

    try {
      setDownloading("qr");

      const dataUrl = await toPng(qrRef.current, {
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: "#FFFFFF",
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      downloadBlob(blob, `vez-qrcode-${filename}.png`);

      toast.success("QR Code baixado com sucesso!");
    } catch (error) {
      console.error("[QR_DOWNLOAD_ERROR]", error);
      toast.error("Não foi possível baixar o QR Code.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div
      ref={originRef}
      className="min-h-screen w-full bg-nevoa px-4 py-6 font-sans text-grafite md:px-8 md:py-10"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* =====================================
            HEADER
        ===================================== */}

        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cinzaapoio">
              <span className="flex size-7 items-center justify-center rounded-lg bg-lima text-grafite">
                <QrCode className="size-4" />
              </span>

              Divulgação da fila
            </div>

            <div>
              <h1 className="font-mono text-3xl font-black tracking-tight md:text-4xl">
                QR Code e link da fila
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cinzaapoio md:text-base">
                Deixe seus clientes entrarem na fila com um
                simples toque. Compartilhe o link ou imprima
                um cartaz para seu estabelecimento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>

            Link público configurado
          </div>
        </header>

        {/* =====================================
            GRID PRINCIPAL
        ===================================== */}

        <main className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(350px,0.9fr)]">
          {/* =====================================
              COLUNA ESQUERDA - CARTAZ
          ===================================== */}

          <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            {/* CARD HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100">
                  <Printer className="size-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold">
                    Prévia do cartaz
                  </h2>

                  <p className="text-xs text-cinzaapoio">
                    Pronto para imprimir
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-cinzaapoio">
                Formato vertical
              </span>
            </div>

            {/* ÁREA DE PRÉVIA */}

            <div className="bg-[#E8EAE5] p-4 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-[420px] overflow-hidden rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
                {/* CARTAZ REAL - ESTE ELEMENTO SERÁ EXPORTADO */}

                <div
                  ref={posterRef}
                  className="relative flex aspect-[3/4] w-full flex-col overflow-hidden bg-[#111412] p-[7%] text-white"
                >
                  {/* DECORAÇÃO */}

                  <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full border-[45px] border-[#C8F31D]/10" />

                  <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full border-[45px] border-[#C8F31D]/10" />

                  {/* TOPO */}

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-[#C8F31D] text-[#111412]">
                        <span className="font-mono text-xl font-black">
                          V
                        </span>
                      </div>

                      <span className="font-mono text-xl font-black tracking-tight">
                        vez<span className="text-[#C8F31D]">.</span>
                      </span>
                    </div>

                    <span className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white/70">
                      Fila digital
                    </span>
                  </div>

                  {/* TÍTULO */}

                  <div className="relative z-10 mt-auto pt-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8F31D]">
                      {business.name}
                    </p>

                    <h2 className="font-mono text-[clamp(27px,5vw,42px)] font-black leading-[1.05] tracking-tight">
                      Sua vez,
                      <br />
                      <span className="text-[#C8F31D]">
                        sem esperar
                      </span>
                      <br />
                      no balcão.
                    </h2>

                    <p className="mt-3 max-w-[280px] text-[11px] leading-relaxed text-white/60 sm:text-xs">
                      Aponte a câmera, entre na fila e
                      acompanhe sua posição pelo celular.
                    </p>
                  </div>

                  {/* QR CODE */}

                  <div className="relative z-10 mt-5 flex items-center gap-4 rounded-2xl bg-white p-3 sm:p-4">
                    <div className="flex size-[115px] shrink-0 items-center justify-center rounded-xl bg-white sm:size-[140px]">
                      {publicUrl ? (
                        <QRCodeSVG
                          value={publicUrl}
                          size={140}
                          level="H"
                          marginSize={0}
                          bgColor="#FFFFFF"
                          fgColor="#111412"
                          className="size-full"
                        />
                      ) : (
                        <QrCode className="size-14 text-grafite" />
                      )}
                    </div>

                    <div className="min-w-0 text-[#111412]">
                      <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-[#C8F31D]">
                        <ArrowRight className="size-4" />
                      </div>

                      <p className="font-mono text-base font-black leading-tight sm:text-lg">
                        Escaneie
                        <br />e entre na fila
                      </p>

                      <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                        Rápido, grátis e sem baixar aplicativo.
                      </p>
                    </div>
                  </div>

                  {/* RODAPÉ */}

                  <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
                    <span className="truncate text-[10px] font-medium text-white/60">
                      {displayUrl}
                    </span>

                    <span className="shrink-0 text-[9px] font-bold text-[#C8F31D]">
                      Powered by vez.
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIÇÃO */}

              <div className="mx-auto mt-5 flex max-w-[420px] items-start gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-cinzaapoio" />

                <p className="text-xs leading-relaxed text-cinzaapoio">
                  Este é o cartaz que seus clientes verão.
                  Baixe e imprima para colocar no balcão,
                  na recepção ou na entrada.
                </p>
              </div>
            </div>

            {/* AÇÕES DO CARTAZ */}

            <div className="grid gap-3 border-t border-zinc-100 p-5 sm:grid-cols-2 md:p-6">
              <Button
                onClick={handleDownloadPoster}
                disabled={!publicUrl || downloading !== null}
                className="h-12 rounded-xl bg-grafite font-semibold text-white hover:bg-grafite/90"
              >
                {downloading === "poster" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImageDown className="size-4" />
                )}

                Baixar cartaz
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadQr}
                disabled={!publicUrl || downloading !== null}
                className="h-12 rounded-xl font-semibold"
              >
                {downloading === "qr" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}

                Baixar só o QR
              </Button>
            </div>
          </section>

          {/* =====================================
              COLUNA DIREITA
          ===================================== */}

          <div className="space-y-6">
            {/* COMPARTILHAR LINK */}

            <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-lima">
                  <Link2 className="size-5 text-grafite" />
                </div>

                <div>
                  <h2 className="font-mono text-xl font-black">
                    Compartilhar link
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-cinzaapoio">
                    Envie o endereço da sua fila para seus
                    clientes entrarem de qualquer lugar.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-cinzaapoio">
                Link público da fila
              </label>

              <div className="flex items-center gap-2">
                <div className="flex h-12 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-xl border border-zinc-200 bg-nevoa px-3">
                  <Globe2 className="size-4 shrink-0 text-cinzaapoio" />

                  <span className="truncate text-sm font-semibold">
                    {displayUrl}
                  </span>
                </div>

                <Button
                  onClick={handleCopy}
                  disabled={!publicUrl}
                  className="h-12 shrink-0 rounded-xl bg-grafite px-4 text-white hover:bg-grafite/90"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}

                  <span className="hidden sm:inline">
                    {copied ? "Copiado" : "Copiar"}
                  </span>
                </Button>
              </div>

              {/* BOTÕES DE COMPARTILHAMENTO */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={handleWhatsApp}
                  disabled={!publicUrl}
                  className="h-12 justify-center rounded-xl border-emerald-200 bg-emerald-50 font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </Button>

                <Button
                  variant="outline"
                  disabled={!publicUrl}
                  onClick={() =>
                    window.open(
                      publicUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="h-12 justify-center rounded-xl font-semibold"
                >
                  <ExternalLink className="size-4" />
                  Abrir minha fila
                </Button>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-nevoa p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cinzaapoio" />

                <p className="text-xs leading-relaxed text-cinzaapoio">
                  Seus clientes não precisam criar uma
                  conta ou instalar aplicativo para acessar
                  o link da fila.
                </p>
              </div>
            </section>

            {/* QR CODE ISOLADO */}

            <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-mono text-xl font-black">
                    QR Code original
                  </h2>

                  <p className="mt-1 text-sm text-cinzaapoio">
                    Use em seus próprios materiais.
                  </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-nevoa">
                  <ScanLine className="size-5" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-zinc-200 bg-nevoa p-6">
                <div
                  ref={qrRef}
                  className="flex size-[220px] items-center justify-center bg-white p-5"
                >
                  {publicUrl ? (
                    <QRCodeSVG
                      value={publicUrl}
                      size={180}
                      level="H"
                      marginSize={0}
                      bgColor="#FFFFFF"
                      fgColor="#111412"
                    />
                  ) : (
                    <QrCode className="size-24 text-grafite" />
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold">
                    {business.name}
                  </p>

                  <p className="mt-1 text-xs text-cinzaapoio">
                    QR Code com link direto para a fila
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleDownloadQr}
                disabled={!publicUrl || downloading !== null}
                className="mt-4 h-11 w-full rounded-xl"
              >
                <ArrowDownToLine className="size-4" />
                Baixar QR Code em PNG
              </Button>
            </section>

            {/* COMO USAR */}

            <section className="rounded-[28px] bg-grafite p-6 text-white">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-lima text-grafite">
                  <Smartphone className="size-5" />
                </div>

                <h2 className="font-mono text-xl font-black">
                  Como seus clientes usam?
                </h2>
              </div>

              <div className="space-y-5">
                {[
                  {
                    number: "01",
                    title: "Escaneiam o QR Code",
                    description:
                      "Basta apontar a câmera do celular.",
                  },
                  {
                    number: "02",
                    title: "Entram na fila",
                    description:
                      "Escolhem o serviço e informam seus dados.",
                  },
                  {
                    number: "03",
                    title: "Acompanham sua vez",
                    description:
                      "Visualizam a posição e aguardam a chamada.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex items-start gap-4"
                  >
                    <span className="font-mono text-lg font-black text-lima">
                      {step.number}
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        {step.title}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-400">
                <CheckCircle2 className="size-4 text-lima" />
                Simples para você e seus clientes.
              </div>
            </section>
          </div>
        </main>

        {/* =====================================
            DICA FINAL
        ===================================== */}

        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lima/40">
              <Monitor className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold">
                Você também pode usar o telão de atendimento
              </p>

              <p className="mt-1 text-xs text-cinzaapoio">
                Exiba as senhas chamadas e os próximos clientes
                em uma TV no seu estabelecimento.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            disabled={!origin}
            onClick={() =>
              window.open(
                `${origin}/${encodeURIComponent(business.slug)}/tela`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="w-full shrink-0 rounded-xl sm:w-auto"
          >
            Abrir telão
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}