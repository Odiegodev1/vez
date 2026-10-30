import Image from "next/image";
import { Scissors } from "lucide-react";

type Props = {
  name: string;
  logoUrl: string | null;
  isOpen: boolean;
};

export function HeaderComponents({
  name,
  logoUrl,
  isOpen,
}: Props) {
  return (
    <header className="flex min-w-0 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-grafite text-lima sm:size-14">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`Logo de ${name}`}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <Scissors className="size-6" />
          )}
        </div>

        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-cinzaapoio">
            Bem-vindo à
          </span>

          <h1 className="truncate text-base font-extrabold tracking-tight sm:text-lg">
            {name}
          </h1>
        </div>
      </div>

      <div
        className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
          isOpen
            ? "bg-grafite text-lima"
            : "bg-zinc-200 text-zinc-600"
        }`}
      >
        <span
          className={`size-2 rounded-full ${
            isOpen ? "bg-lima" : "bg-zinc-400"
          }`}
        />

        {isOpen ? "Aberta" : "Fechada"}
      </div>
    </header>
  );
}