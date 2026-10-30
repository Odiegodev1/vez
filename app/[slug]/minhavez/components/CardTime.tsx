"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

type Props = {
  calledAt: string | null;
  callTimeoutMinutes: number;
};

function getRemainingSeconds(
  calledAt: string | null,
  callTimeoutMinutes: number
): number | null {
  if (!calledAt) return null;

  const calledTime = new Date(calledAt).getTime();

  if (Number.isNaN(calledTime)) {
    return null;
  }

  const expiresAt =
    calledTime + callTimeoutMinutes * 60 * 1000;

  return Math.max(
    0,
    Math.ceil((expiresAt - Date.now()) / 1000)
  );
}

export function CardTime({
  calledAt,
  callTimeoutMinutes,
}: Props) {
  const [remaining, setRemaining] = useState<
    number | null
  >(null);

  useEffect(() => {
    function update() {
      setRemaining(
        getRemainingSeconds(
          calledAt,
          callTimeoutMinutes
        )
      );
    }

    update();

    const interval = window.setInterval(
      update,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [calledAt, callTimeoutMinutes]);

  const minutes =
    remaining === null
      ? null
      : Math.floor(remaining / 60);

  const seconds =
    remaining === null
      ? null
      : remaining % 60;

  const formattedTime =
    minutes === null || seconds === null
      ? "--:--"
      : `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;

  const expired = remaining === 0;

  return (
    <section
      className={`flex items-center gap-3 rounded-2xl border p-4 ${
        expired
          ? "border-red-200 bg-red-50"
          : "border-grafite/15 bg-nevoa"
      }`}
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
          expired
            ? "bg-red-600 text-white"
            : "bg-grafite text-lima"
        }`}
      >
        <Timer className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">
          {expired
            ? "Tempo esgotado"
            : "Tempo para chegar"}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-cinzaapoio">
          {expired
            ? "Aguarde a atualização do status da sua senha."
            : "Procure o profissional antes do prazo indicado."}
        </p>
      </div>

      <p
        className={`shrink-0 font-mono text-xl font-extrabold tabular-nums sm:text-2xl ${
          expired ? "text-red-600" : "text-grafite"
        }`}
      >
        {formattedTime}
      </p>
    </section>
  );
}