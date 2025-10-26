import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  // Define a página de login customizada
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Este callback controla o acesso as rotas
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnAdminPanel) {
        // Se estiver no painel admin, precisa estar logado E ser admin
        if (isLoggedIn && auth.user.role === 'ADMIN') return true;
        return false; // Redireciona para /login (ou onde o middleware decidir)
      }
      
      if (isOnDashboard) {
         // Se estiver no dashboard, só precisa estar logado
        if (isLoggedIn) return true;
        return false; // Redireciona para /login
      }

      // Se usuário logado tentar acessar /login ou /register, redireciona
      if (isLoggedIn && (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register'))) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      // Permite todas as outras rotas (como /login, /register, /)
      return true;
    },

    // Adiciona o 'id' e 'role' do banco de dados ao token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Adicionando a role do usuário ao token
      }
      return token;
    },

    // Adiciona o id e role do JWT para a sessão (disponível no frontend/backend)
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    },
  },
  providers: [], // Deixamos vazio por enquanto, será preenchido no proximo arquivo
} satisfies NextAuthConfig;