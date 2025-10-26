'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache'; 
import { auth } from '@/auth';

//AÇÃO DE DELETAR USUÁRIO 
export async function deleteUser(userId: string) {

  // Verifica se o usuário logado é admin
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, message: 'Não autorizado.' };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users'); // Atualiza a tabela na tela
    return { success: true, message: 'Usuário deletado.' };
  } catch (error) {
    return { success: false, message: 'Falha ao deletar.' };
  }
}

//AÇÃO DE EDITAR NOME 
const UpdateNameSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
});

export async function updateUserName(userId: string, formData: FormData) {
  // Verifica se o usuário logado é admin
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, message: 'Não autorizado.' };
  }

  const validatedFields = UpdateNameSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.name?.join(', ') || 'Erro de validação',
    };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: validatedFields.data.name },
    });

    revalidatePath('/admin/users'); // Atualiza a tabela na tela
    return { success: true, message: 'Nome atualizado.' };
  } catch (error) {
    return { success: false, message: 'Falha ao atualizar.' };
  }
}