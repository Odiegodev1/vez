import { z } from "zod";

export const schemaform = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(100, "O nome deve ter até 100 caracteres."),

  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{10,11}$/, "Informe um WhatsApp com DDD válido.")
    ),

  servicos: z.string().min(1, "Selecione um serviço."),

  profissional: z.string().min(1, "Selecione um profissional."),
});

export type Schemaform = z.input<typeof schemaform>;