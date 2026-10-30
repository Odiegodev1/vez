import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      companySlug?: string | null;
    } & DefaultSession["user"];
  }
}