'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// 1. Definir o Schema de validação com Zod

const registerSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  // Exemplo de regra de senha de 8 
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.'),
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

// Tipagem para a resposta da action
export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[]; // Erro geral do formulário
  };
  success: boolean;
};

// 2. O Server Action
export async function registerUser(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // Converte o FormData para um objeto simples
  const data = Object.fromEntries(formData);

  // Valida os dados
  const validatedFields = registerSchema.safeParse(data);

  // Se a validação falhar, retorna os erros
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, email, password, cep, state, city } = validatedFields.data;

  try {
    // 3. Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        errors: { _form: ['Este e-mail já está em uso.'] },
        success: false,
      };
    }

    // 4. Faz o hash da senha
    const hashedPassword = await hash(password, 12);

    // 5. Salva o usuário no banco
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        cep,
        state,
        city,
        role: 'USER', // Função 1.a (Cadastro público)
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ['Algo deu errado. Tente novamente.'] },
      success: false,
    };
  }
}