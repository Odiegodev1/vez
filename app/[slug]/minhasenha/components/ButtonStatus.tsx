"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader2,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { leaveQueueAction } from "../actions/leave-queue-action";

type Props = {
  slug: string;
  token: string;
  status: string;
  onCanceled: () => Promise<void>;
};

export function ButtonStatus({
  slug,
  token,
  status,
  onCanceled,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] = useState<string | null>(
    null
  );

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const canCancel = status === "WAITING";

  function handleCancel() {
    setError(null);

    startTransition(async () => {
      const result = await leaveQueueAction(
        slug,
        token
      );

      if (!result.success) {
        setError(result.message);
        setShowConfirmation(false);
        return;
      }

      setShowConfirmation(false);

      await onCanceled();
    });
  }

  if (!canCancel) {
    return (
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${slug}`)}
          className="h-13 w-full rounded-2xl border-grafite/15 bg-white font-bold"
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar ao estabelecimento
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!showConfirmation ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowConfirmation(true)}
            className="h-14 rounded-2xl border-grafite/15 bg-white font-bold"
          >
            <X className="mr-1 size-4" />
            Sair da fila
          </Button>

          <Button
            type="button"
            disabled
            title="Disponível em breve"
            className="h-14 rounded-2xl bg-grafite font-bold text-lima"
          >
            <MapPin className="mr-1 size-4" />
            Estou a caminho
          </Button>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div>
            <p className="font-bold text-red-900">
              Deseja realmente sair da fila?
            </p>

            <p className="mt-1 text-sm text-red-700">
              Sua senha será cancelada e você
              perderá sua posição atual.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                setShowConfirmation(false)
              }
              className="h-12 rounded-xl bg-white"
            >
              Voltar
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={handleCancel}
              className="h-12 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saindo...
                </>
              ) : (
                "Confirmar saída"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}