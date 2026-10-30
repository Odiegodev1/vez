import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "./prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET!,

  trustHost: true,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Executado no primeiro login ou quando o token é criado
      if (user) {
        token.id = user.id;

        // Buscamos no banco a primeira empresa vinculada a este usuário através do BusinessMember
        const memberRelation = await prisma.businessMember.findFirst({
          where: { userId: user.id },
          include: {
            business: {
              select: { slug: true }
            }
          }
        });

        // Se o usuário possuir um vínculo, salvamos o slug no token
        token.companySlug = memberRelation?.business?.slug || null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        
        // Repassa o slug guardado no token diretamente para a sessão do cliente
        (session.user as any).companySlug = token.companySlug as string | null;
      }

      return session;
    },
  },
});
