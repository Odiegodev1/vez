import { Suspense } from "react";
import { SettingsForm } from "./components/settings-form";
import { MembersSettings } from "./components/members-settings";
import { getBusinessAction } from "./actions/get-business-action";
import { Skeleton } from "@/components/ui/skeleton";

// Componente que acessa os dados dinâmicos
async function ConfiguracoesContent() {
  const business = await getBusinessAction();

  return (
    <div className="space-y-6">
      <SettingsForm business={business} />

      {business && <MembersSettings />}
    </div>
  );
}

// Skeleton exibido enquanto os dados são carregados
function ConfiguracoesLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <Skeleton className="mb-6 h-6 w-56" />

        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>

        <Skeleton className="mt-5 h-24 w-full" />

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <Skeleton className="mb-5 h-6 w-48" />
        <Skeleton className="h-16 w-full" />
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <Skeleton className="mb-5 h-6 w-48" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <main className="min-h-screen bg-nevoa px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-lima" />

            <span className="text-xs font-bold uppercase tracking-widest text-cinzaapoio">
              Painel do estabelecimento
            </span>
          </div>

          <h1 className="font-mono text-3xl font-extrabold tracking-tight text-grafite md:text-4xl">
            Configurações
          </h1>

          <p className="mt-2 text-sm text-cinzaapoio md:text-base">
            Personalize seu estabelecimento e gerencie sua equipe.
          </p>
        </div>

        {/* Dados dinâmicos */}
        <Suspense fallback={<ConfiguracoesLoading />}>
          <ConfiguracoesContent />
        </Suspense>
      </div>
    </main>
  );
}