/**
 * Retorna a data atual no formato YYYY-MM-DD,
 * respeitando o fuso horário do estabelecimento.
 *
 * Exemplo: "2026-10-29"
 */
export function getQueueDay(
    timezone: string = "America/Sao_Paulo"
  ): string {
    const now = new Date();
  
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  
    const parts = formatter.formatToParts(now);
  
    const year = parts.find(
      (part) => part.type === "year"
    )?.value;
  
    const month = parts.find(
      (part) => part.type === "month"
    )?.value;
  
    const day = parts.find(
      (part) => part.type === "day"
    )?.value;
  
    if (!year || !month || !day) {
      throw new Error("Não foi possível obter a data da fila.");
    }
  
    return `${year}-${month}-${day}`;
  }