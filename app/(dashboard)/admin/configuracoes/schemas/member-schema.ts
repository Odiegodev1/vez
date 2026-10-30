import { z } from "zod";

export const memberRoleSchema = z.enum([
  "MANAGER",
  "STAFF",
]);

export const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome.")
    .max(100),

  email: z
    .email("Informe um e-mail válido.")
    .transform((email) => email.trim().toLowerCase()),

  role: memberRoleSchema,
});

export type MemberFormValues = z.input<typeof memberSchema>;

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "PENDING";
  isOwner: boolean;
};