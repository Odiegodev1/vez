"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PeriodoRelatorio } from "../actions/get-relatorios-action";

type Props = {
  periodo: PeriodoRelatorio;
};

export function FiltroPeriodo({ periodo }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: PeriodoRelatorio) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("periodo", value);

    router.push(`/admin/relatorios?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white sm:flex">
        <CalendarDays className="size-5 text-grafite" />
      </div>

      <Select
        value={periodo}
        onValueChange={(value) =>
          handleChange(value as PeriodoRelatorio)
        }
      >
        <SelectTrigger className="h-11 w-full min-w-44 rounded-xl border-zinc-200 bg-white font-mono text-sm font-semibold text-grafite sm:w-48">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="todos">Todo o período</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}