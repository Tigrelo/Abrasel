import NextAuth, { type DefaultSession, type User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Role } from '@prisma/client'; 

declare module 'next-auth' {
  /**
   * Extende o model User padrão
   */
  interface User {
    id: string;
    role: Role; // Usa o enum do Prisma
  }

  /**
   * Extende o model Session padrão
   */
  interface Session {
    user: {
      id: string;
      role: Role; // Adiciona a role para a sessão
    } & DefaultSession['user']; // Mantém as propriedades padrão (name, email, image)
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extende o token JWT padrão
   */
  interface JWT {
    id: string;
    role: Role;
  }
}