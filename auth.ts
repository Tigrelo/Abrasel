import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma'; // Nosso cliente Prisma
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config'; // A config que acabamos de criar

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig, // Espalha a configuração base
  providers: [
    Credentials({
      async authorize(credentials) {
        // Valida os campos recebidos
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 1. Busca o usuário no banco
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });
          if (!user) return null; // Usuário não encontrado

          // 2. Compara a senha enviada com o hash no banco
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
             // Retorna o usuário (sem a senha) para o Next-Auth
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }
        
        // Se a senha não bater ou a validação falhar
        return null;
      },
    }),
  ],
  // Estratégia de Sessão: JWT
  session: { strategy: 'jwt' },
});