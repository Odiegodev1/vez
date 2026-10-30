import { GridRelatorios } from "./components/GridRelatorios";
import { MaisPedidos } from "./components/MaisPedidos";
import { MovimentoPorHorario } from "./components/MovimentoPorHorario";
import { FiltroPeriodo } from "./components/FiltroPeriodo";
import { validarPeriodo } from "@/lib/relatorios/periodo";
import { getRelatoriosAction } from "./actions/get-relatorios-action";



type PageProps = {
  searchParams: Promise<{
    periodo?: string;
  }>;
};

export const instant= false
export default async function Relatorios({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const periodo = validarPeriodo(params.periodo);

  const relatorios = await getRelatoriosAction(periodo);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 bg-nevoa p-4 md:p-6">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="font-mono">
          <h1 className="text-3xl font-bold text-grafite md:text-4xl">
            Relatórios
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Veja como a fila anda e onde dá para atender mais rápido.
          </p>

          <p className="mt-2 text-xs text-cinzaapoio">
            {relatorios.dataInicio
              ? `${relatorios.dataInicio} até ${relatorios.dataFim}`
              : `Todo o histórico até ${relatorios.dataFim}`}
          </p>
        </div>

        <FiltroPeriodo periodo={periodo} />
      </header>

      <main className="flex flex-col gap-6">
        <GridRelatorios data={relatorios} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <MovimentoPorHorario
              data={relatorios.movimentoPorHorario}
            />
          </div>

          <div className="min-w-0">
            <MaisPedidos data={relatorios.servicosPopulares} />
          </div>
        </div>
      </main>
    </div>
  );
}