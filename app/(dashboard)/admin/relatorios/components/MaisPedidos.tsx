import { Progress } from "@/components/ui/progress";

import type { RelatoriosData } from "../actions/get-relatorios-action";

type Props = {
  data: RelatoriosData["servicosPopulares"];
};

export function MaisPedidos({ data }: Props) {
  return (
    <section className="flex h-full w-full flex-col gap-5 rounded-2xl border border-zinc-200/80 bg-white p-5 font-mono shadow-sm md:p-6">
      <div>
        <h2 className="text-xl font-bold text-grafite md:text-2xl">
          Mais pedidos
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Serviços mais solicitados nos últimos 7 dias.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10 text-center text-sm text-muted-foreground">
          Nenhum serviço solicitado neste período.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {data.map((servico, index) => (
            <article key={servico.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-xs font-semibold text-cinzaapoio">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="truncate text-sm font-semibold text-grafite">
                    {servico.nome}
                  </h3>
                </div>

                <p className="shrink-0 text-sm font-medium text-cinzaapoio">
                  {servico.quantidade}
                </p>
              </div>

              <Progress
                value={servico.percentual}
                className="h-2 bg-zinc-100 [&_[data-slot=progress-indicator]]:bg-grafite"
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}