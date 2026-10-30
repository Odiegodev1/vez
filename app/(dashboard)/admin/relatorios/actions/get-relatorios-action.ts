"use server";

import prisma from "@/lib/prisma";
import { requireQueueMember } from "../../actions/fila-permissions";
import { validarPeriodo, type PeriodoRelatorio } from "@/lib/relatorios/periodo";

export type MovimentoHorario = {
  hour: string;
  clientes: number;
};

export type ServicoPopular = {
  id: string;
  nome: string;
  quantidade: number;
  percentual: number;
};

export type RelatoriosData = {
  periodo: PeriodoRelatorio;
  dataInicio: string | null;
  dataFim: string;

  atendimentos: number;
  entradas: number;
  desistencias: number;
  percentualDesistencias: number;

  esperaMediaMinutos: number | null;
  tempoMedioAtendimentoMinutos: number | null;

  movimentoPorHorario: MovimentoHorario[];
  servicosPopulares: ServicoPopular[];
};


function getLocalDay(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function subtractDays(day: string, days: number): string {
  const date = new Date(`${day}T12:00:00Z`);

  date.setUTCDate(date.getUTCDate() - days);

  return date.toISOString().slice(0, 10);
}

function getLocalHour(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Number(
    parts.find((part) => part.type === "hour")?.value ?? 0
  );
}

function mediaMinutos(
  valores: number[]
): number | null {
  if (valores.length === 0) {
    return null;
  }

  const soma = valores.reduce((total, valor) => total + valor, 0);

  return Number((soma / valores.length).toFixed(1));
}

export async function getRelatoriosAction(
    periodoInput: PeriodoRelatorio = "7d"
): Promise<RelatoriosData> {
  const member = await requireQueueMember();

  const business = await prisma.business.findUnique({
    where: {
      id: member.businessId,
    },
    select: {
      timezone: true,
    },
  });

  if (!business) {
    throw new Error("Estabelecimento não encontrado.");
  }

  const timezone = business.timezone || "America/Sao_Paulo";
  const periodo = validarPeriodo(periodoInput);

  const hoje = getLocalDay(new Date(), timezone);

  const dataInicio =
    periodo === "hoje"
      ? hoje
      : periodo === "7d"
        ? subtractDays(hoje, 6)
        : periodo === "30d"
          ? subtractDays(hoje, 29)
          : null;

  const entries = await prisma.queueEntry.findMany({
    where: {
      businessId: member.businessId,
      queueDay: {
        ...(dataInicio ? { gte: dataInicio } : {}),
        lte: hoje,
      },
    },
    select: {
      id: true,
      status: true,
      joinedAt: true,
      startedAt: true,
      completedAt: true,
      serviceId: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Indicadores gerais
  const entradas = entries.length;

  const atendimentos = entries.filter(
    (entry) => entry.status === "COMPLETED"
  ).length;

  const desistencias = entries.filter((entry) =>
    ["CANCELED", "NO_SHOW", "EXPIRED"].includes(entry.status)
  ).length;

  const percentualDesistencias =
    entradas > 0
      ? Number(((desistencias / entradas) * 100).toFixed(1))
      : 0;

  // Tempo entre entrada na fila e início do atendimento
  const temposEspera = entries
    .filter(
      (entry) =>
        entry.startedAt !== null &&
        entry.startedAt >= entry.joinedAt
    )
    .map(
      (entry) =>
        (entry.startedAt!.getTime() -
          entry.joinedAt.getTime()) /
        60000
    );

  const esperaMediaMinutos = mediaMinutos(temposEspera);

  // Tempo entre início e conclusão do atendimento
  const temposAtendimento = entries
    .filter(
      (entry) =>
        entry.status === "COMPLETED" &&
        entry.startedAt !== null &&
        entry.completedAt !== null &&
        entry.completedAt >= entry.startedAt
    )
    .map(
      (entry) =>
        (entry.completedAt!.getTime() -
          entry.startedAt!.getTime()) /
        60000
    );

  const tempoMedioAtendimentoMinutos =
    mediaMinutos(temposAtendimento);

  // Número de dias usado para calcular a média diária
  const primeiroDia =
    dataInicio ??
    (entries.length > 0
      ? getLocalDay(
          entries.reduce(
            (menor, entry) =>
              entry.joinedAt < menor ? entry.joinedAt : menor,
            entries[0].joinedAt
          ),
          timezone
        )
      : hoje);

  const diasPeriodo = Math.max(
    1,
    Math.round(
      (Date.parse(`${hoje}T00:00:00Z`) -
        Date.parse(`${primeiroDia}T00:00:00Z`)) /
        86400000
    ) + 1
  );

  // Movimento por horário
  const horas = Array.from({ length: 24 }, (_, index) => index);

  const movimentoPorHorario = horas.map((hour) => {
    const quantidade = entries.filter(
      (entry) => getLocalHour(entry.joinedAt, timezone) === hour
    ).length;

    return {
      hour: `${String(hour).padStart(2, "0")}h`,
      clientes: Number((quantidade / diasPeriodo).toFixed(1)),
    };
  });

  // Serviços mais pedidos
  const servicosMap = new Map<
    string,
    {
      id: string;
      nome: string;
      quantidade: number;
    }
  >();

  for (const entry of entries) {
    const atual = servicosMap.get(entry.serviceId);

    if (atual) {
      atual.quantidade++;
    } else {
      servicosMap.set(entry.serviceId, {
        id: entry.service.id,
        nome: entry.service.name,
        quantidade: 1,
      });
    }
  }

  const ordenados = [...servicosMap.values()]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const maiorQuantidade = ordenados[0]?.quantidade ?? 0;

  const servicosPopulares = ordenados.map((servico) => ({
    ...servico,
    percentual:
      maiorQuantidade > 0
        ? Math.round(
            (servico.quantidade / maiorQuantidade) * 100
          )
        : 0,
  }));

  return {
    periodo,
    dataInicio,
    dataFim: hoje,
    atendimentos,
    entradas,
    desistencias,
    percentualDesistencias,
    esperaMediaMinutos,
    tempoMedioAtendimentoMinutos,
    movimentoPorHorario,
    servicosPopulares,
  };
}