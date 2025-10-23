import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Esta é uma Server Component (async)
export default async function AdminUsersPage() {
  // 1. Busca a sessão (só admins chegam aqui, graças ao middleware)
  const session = await auth();

  // 2. Busca TODOS os usuários no banco (Req 5.a.i)
  const users = await prisma.user.findMany({
    // Não vamos retornar o admin atual na lista para ele não se auto-deletar
    where: {
      id: { not: session?.user?.id },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Button asChild>
          <Link href="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>

      <p className="mt-2 text-lg text-gray-600">
        Total de usuários cadastrados: {users.length}
      </p>

      {/* 3. Renderiza a tabela de usuários */}
      <div className="mt-6 rounded-lg border shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.city ? `${user.city} / ${user.state}` : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {/* TODO: Adicionar botões de Editar e Deletar */}
                  ...
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}