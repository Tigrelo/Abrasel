import { auth } from '@/auth';
import { LogoutButton } from '@/app/components/logout-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth(); // Pega a sessão
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 text-center shadow-lg">
        
        <h1 className="mb-4 text-3xl font-bold">
          Painel de Controle
        </h1>
        <p className="mb-6 text-lg">
          Seja bem-vindo(a), {firstName}!
        </p>
        <div className="flex w-full flex-col space-y-2">
          
          {/* 1. Mostra o Painel Admin se for ADMIN */}
          {user?.role === 'ADMIN' && (
            <Button asChild variant="secondary">
              <Link href="/admin/users">Gerenciar Usuários</Link>
            </Button>
          )}

          {/* 2. Link para a página de Perfil (todos veem) */}
          <Button asChild>
            <Link href="/dashboard/profile">Ver Meu Perfil</Link>
          </Button>

          {/* 3. Botão de Logout */}
          <LogoutButton />
        </div>
        
      </div>
    </div>
  );
}