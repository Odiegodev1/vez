import { getFilaAction } from "./actions/get-fila-action";
import { FilaClient } from "./components/fila-client";


export const instant = false;

export default async function FilaPage() {
  const result = await getFilaAction();

  if (!result.success) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-nevoa p-6">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center">
          <h1 className="font-mono text-2xl font-black">
            Não foi possível carregar a fila
          </h1>
          <p className="mt-3 text-sm text-cinzaapoio">
            {result.message}
          </p>
        </div>
      </main>
    );
  }

  return <FilaClient initialData={result.data} />;
}