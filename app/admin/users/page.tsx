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

import { UserActions } from './user-actions';

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
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
          <Link href="/dashboard">Voltar ao Painel</Link>
        </Button>
      </div>

      <p className="mt-2 text-lg text-gray-600">
        Total de usuários cadastrados: {users.length}
      </p>

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
            {/* Se não houver usuários, mostra uma linha */}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
            
            {/* Lista os usuários */}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.city ? `${user.city} / ${user.state}` : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions userId={user.id} currentName={user.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}