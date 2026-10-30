import { z } from "zod";

export const settingsSchema = z.object({
  // Estabelecimento
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),

  slug: z
    .string()
    .trim()
    .min(3, "O endereço deve ter pelo menos 3 caracteres.")
    .max(50, "O endereço deve ter no máximo 50 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    ),

  description: z
    .string()
    .max(300, "A descrição deve ter no máximo 300 caracteres."),

  phone: z
    .string()
    .regex(/^\d{10,11}$/, "Informe um telefone com DDD, apenas números."),

  address: z.string().max(200),

  // Funcionamento
  queueEnabled: z.boolean(),

  // Regras da fila
  maxQueueSize: z
    .number()
    .int()
    .min(1, "O limite mínimo é 1 cliente.")
    .max(200, "O limite máximo é 200 clientes."),

  notifyAhead: z
    .number()
    .int()
    .min(1, "Informe pelo menos 1 pessoa.")
    .max(20, "O máximo é 20 pessoas."),

  callTimeoutMinutes: z
    .number()
    .int()
    .min(1, "O tempo mínimo é 1 minuto.")
    .max(30, "O tempo máximo é 30 minutos."),

  // Personalização
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal válida."),

  showWaitTime: z.boolean(),
  showQueuePosition: z.boolean(),
}).refine(
  (data) => data.notifyAhead <= data.maxQueueSize,
  {
    message: "O aviso não pode superar o limite da fila.",
    path: ["notifyAhead"],
  }
);

export type SettingsFormValues = z.infer<typeof settingsSchema>;