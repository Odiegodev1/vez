import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do serviço.")
    .max(120),

  description: z
    .string()
    .trim()
    .max(300),

  durationMinutes: z
    .number()
    .int()
    .min(5, "Duração mínima de 5 minutos.")
    .max(480),

  price: z.preprocess(
    (value) => {
      if (value === undefined || value === null) {
        return "";
      }

      return value;
    },
    z
      .string()
      .trim()
      .min(1, "Informe o preço do serviço.")
      .regex(
        /^\d{1,8}([.,]\d{1,2})?$/,
        "Informe um preço válido. Ex: 45,00"
      )
  ),

  active: z.boolean(),
});

export type ServiceFormValues = z.infer<
  typeof serviceSchema
>;

export type ServiceItem = ServiceFormValues & {
  id: string;
};