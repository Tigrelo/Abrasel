import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Esta é uma Server Component (async)
export default async function ProfilePage() {
  // Pega a sessão do usuário (protegido por middleware)
  const session = await auth();

  // Busca os dados completos do usuário no banco
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      name: true,
      email: true,
      cep: true,
      state: true,
      city: true,
    },
  });

  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Seu Perfil</CardTitle>
          <CardDescription>
            Estes são os seus dados cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Nome Completo</p>
            <p className="text-lg">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">E-mail</p>
            <p className="text-lg">{user.email}</p>
          </div>
          
          {/* Mostra os dados de endereço se existirem */}
          {user.cep && (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">CEP</p>
                <p className="text-lg">{user.cep}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
                <p className="text-lg">
                  {user.city} / {user.state}
                </p>
              </div>
            </>
          )}

          <Button asChild className="mt-4 w-full">
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}