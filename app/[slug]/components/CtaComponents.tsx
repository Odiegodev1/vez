import {
    ArrowDown,
    Clock3,
    UsersRound,
  } from "lucide-react";
  
  type Props = {
    waiting: number;
    isOpen: boolean;
    isFull: boolean;
  };
  
  export function CtaComponents({
    waiting,
    isOpen,
    isFull,
  }: Props) {
    return (
      <section>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-grafite/10 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          <span className="size-2 rounded-full bg-lima" />
          Sua vez começa aqui
        </div>
  
        <h2 className="max-w-xl font-mono text-[clamp(2.4rem,8vw,4.3rem)] font-black leading-[1.08] tracking-[-0.055em]">
          Menos espera.
          <br />
          <span className="text-cinzaapoio">Mais praticidade.</span>
        </h2>
  
        <p className="mt-4 max-w-md text-sm leading-6 text-cinzaapoio sm:text-base">
          Entre na fila pelo celular e acompanhe sua vez.
          Sem precisar ficar perguntando quanto tempo falta.
        </p>
  
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-grafite/10 bg-white p-4">
            <UsersRound className="size-5 text-cinzaapoio" />
  
            <p className="mt-3 font-mono text-3xl font-black">
              {waiting}
            </p>
  
            <p className="mt-1 text-xs font-medium text-cinzaapoio">
              {waiting === 1
                ? "Pessoa aguardando"
                : "Pessoas aguardando"}
            </p>
          </div>
  
          <div className="rounded-2xl bg-grafite p-4 text-white">
            <Clock3 className="size-5 text-lima" />
  
            <p className="mt-3 font-mono text-lg font-black">
              {!isOpen
                ? "Fechada"
                : isFull
                  ? "Fila cheia"
                  : "Disponível"}
            </p>
  
            <p className="mt-1 text-xs text-zinc-400">
              Situação da fila agora
            </p>
          </div>
        </div>
  
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-cinzaapoio">
          <ArrowDown className="size-4" />
          Preencha os dados para participar
        </div>
      </section>
    );
  }