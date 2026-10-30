export type PeriodoRelatorio = "hoje" | "7d" | "30d" | "todos";

export function validarPeriodo(
  periodo?: string
): PeriodoRelatorio {
  if (
    periodo === "hoje" ||
    periodo === "7d" ||
    periodo === "30d" ||
    periodo === "todos"
  ) {
    return periodo;
  }

  return "7d";
}