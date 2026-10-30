import { z } from "zod";

export const createBusinessSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "O nome precisa ter pelo menos 3 caracteres.")
      .max(150, "O nome deve ter no máximo 150 caracteres."),

    slug: z
      .string()
      .trim()
      .min(3, "O slug precisa ter pelo menos 3 caracteres.")
      .max(100, "O slug deve ter no máximo 100 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use apenas letras minúsculas, números e hífens."
      ),

    description: z
      .string()
      .trim()
      .max(1000, "A descrição deve ter no máximo 1000 caracteres."),

    phone: z
      .string()
      .trim()
      .regex(/^\d{10,11}$/, "Informe um telefone válido com DDD."),

    address: z
      .string()
      .trim()
      .max(200, "O endereço deve ter no máximo 200 caracteres."),

    queueEnabled: z.boolean(),

    maxQueueSize: z.number().int().min(1).max(200),

    notifyAhead: z.number().int().min(1).max(20),

    callTimeoutMinutes: z.number().int().min(1).max(30),

    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),

    showWaitTime: z.boolean(),

    showQueuePosition: z.boolean(),
  })
  .refine((data) => data.notifyAhead <= data.maxQueueSize, {
    message: "O aviso não pode superar o limite da fila.",
    path: ["notifyAhead"],
  });

export type CreateBusinessInput = z.infer<
  typeof createBusinessSchema
>;