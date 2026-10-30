"use client";

import { Card, CardContent } from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import type { RelatoriosData } from "../actions/get-relatorios-action";

type Props = {
  data: RelatoriosData["movimentoPorHorario"];
};

const chartConfig = {
  clientes: {
    label: "Clientes/dia",
    color: "var(--color-grafite)",
  },
} satisfies ChartConfig;

export function MovimentoPorHorario({ data }: Props) {
  const ranking = [...data]
    .filter((item) => item.clientes > 0)
    .sort((a, b) => b.clientes - a.clientes)
    .slice(0, 3)
    .map((item) => item.hour);

  return (
    <Card className="h-full w-full rounded-2xl border border-zinc-200/80 bg-white p-4 font-mono shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-grafite md:text-2xl">
          Movimento por horário
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Média diária de clientes que entraram na fila nos
          últimos 7 dias.
        </p>
      </div>

      <CardContent className="p-0">
        {data.every((item) => item.clientes === 0) ? (
          <div className="flex h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
            Ainda não há movimentação registrada neste período.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 25,
                right: 5,
                left: -20,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar dataKey="clientes" radius={[8, 8, 0, 0]}>
                {data.map((entry) => {
                  const position = ranking.indexOf(entry.hour);

                  let fill = "var(--color-cinzaapoio)";
                  let stroke = "transparent";
                  let strokeWidth = 0;

                  if (position === 0) {
                    fill = "var(--color-lima)";
                    stroke = "var(--color-grafite)";
                    strokeWidth = 2;
                  } else if (position === 1 || position === 2) {
                    fill = "var(--color-grafite)";
                  }

                  return (
                    <Cell
                      key={entry.hour}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  );
                })}

                <LabelList
                  dataKey="clientes"
                  position="top"
                  offset={10}
                  className="fill-grafite font-mono text-xs"
                  formatter={(value: unknown) =>
                    typeof value === "number" && value > 0
                      ? value.toLocaleString("pt-BR")
                      : ""
                  }
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}