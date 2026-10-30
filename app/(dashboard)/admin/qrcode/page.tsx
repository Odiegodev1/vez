import { redirect } from "next/navigation";

import { getQrCodeAction } from "./actions/get-qrcode-action";
import { QrCodeClient } from "./components/qrcode-client";

export const instant = false;

export default async function QrCodePage() {
  const result = await getQrCodeAction();

  if (!result.success) {
    if (result.code === "UNAUTHORIZED") {
      redirect("/login");
    }

    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-nevoa p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center">
          <h1 className="font-mono text-2xl font-bold text-grafite">
            Não foi possível carregar a página
          </h1>

          <p className="mt-3 text-sm text-cinzaapoio">
            {result.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <QrCodeClient business={result.data.business} />
  );
}