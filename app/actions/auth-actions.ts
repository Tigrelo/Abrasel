"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signOut } from "@/auth";

// 1. Definir o Schema de validação com Zod
const registerSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),

  //(registro)
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
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

// 2. O Server Action de Registro
export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
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
        errors: { _form: ["Este e-mail já está em uso."] },
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
        role: "USER", // Função 1.a (Cadastro público)
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ["Algo deu errado. Tente novamente."] },
      success: false,
    };
  }
}

// 1. Schema de validação do Login
const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

// 2. Tipagem do estado de retorno
export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success: boolean;
};

// 3. Server Action de Login
export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  // Converte o FormData para um objeto
  const data = Object.fromEntries(formData);

  // Valida os campos
  const validatedFields = loginSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 4. Tenta fazer o login usando a função signIn do Next-Auth
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Redireciona em caso de sucesso
    });

    return { success: true };
  } catch (error) {
    
    // 5. Captura erros específicos do Next-Auth
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // Erro de credenciais (email/senha errados)
          return {
            errors: { _form: ["Credenciais inválidas."] },
            success: false,
          };
        default:
          // Outros erros de autenticação
          return {
            errors: { _form: ["Algo deu errado com a autenticação."] },
            success: false,
          };
      }
    }

    // Se o erro não for do Next-Auth, joga para o catch geral
    throw error;
  }
}
export async function signOutUser() {
  await signOut({redirectTo: '/login'});
}
