import { z } from "zod";

export const queueRulesSchema = z
  .object({
    // Número máximo de clientes aguardando na fila
    maxWaiting: z
      .number({
        error: "Informe o limite de pessoas.",
      })
      .int("O valor deve ser um número inteiro.")
      .min(1, "O limite mínimo é de 1 pessoa.")
      .max(200, "O limite máximo é de 200 pessoas."),

    // Quantas pessoas faltam para enviar o aviso
    notifyAhead: z
      .number({
        error: "Informe quando o cliente deve ser avisado.",
      })
      .int("O valor deve ser um número inteiro.")
      .min(1, "O mínimo é 1 pessoa.")
      .max(20, "O máximo é 20 pessoas."),
  })
  .refine(
    (data) => data.notifyAhead <= data.maxWaiting,
    {
      message:
        "O aviso não pode superar o limite de pessoas na fila.",
      path: ["notifyAhead"],
    }
  );

export type QueueRulesValues = z.infer<
  typeof queueRulesSchema
>;