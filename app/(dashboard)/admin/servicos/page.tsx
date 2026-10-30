import { DialogServicos } from "./components/DialogServicos";
import { TabelaServicos } from "./components/TabelaServicos";
import { RegrasFila } from "./components/regrasfila";

export default function ServicosPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 bg-nevoa p-4 md:p-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="font-mono">
          <h1 className="text-3xl font-bold tracking-tight text-grafite md:text-4xl">
            Serviços e equipe
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            A duração de cada serviço define a previsão de espera
            que o cliente vê.
          </p>
        </div>

        <DialogServicos />
      </header>

      <main className="flex flex-col items-start gap-4 lg:flex-row">
        <TabelaServicos />

        <RegrasFila />
      </main>
    </div>
  );
}