'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

// Importa a nova action
import { loginUser, type LoginState } from '@/app/actions/auth-actions';

// Importa os componentes de UI
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// 1. Schema de validação do formulário
const formSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  // 2. useFormState para lidar com a resposta do Server Action
  const initialState: LoginState = { errors: {}, success: false };
  const [state, dispatch] = useActionState(loginUser, initialState);

  // 3. react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 4. Lida com a resposta do Server Action
  useEffect(() => {
    
    // Mostra erros gerais do formulário (ex: credenciais inválidas)
    if (state.errors?._form) {
      toast.error('Erro no Login', {
        description: state.errors._form.join(', '),
      });
    }
    // O sucesso é tratado pelo 'redirectTo' no Server Action
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

        <Form {...form}>
          {/* O formulário chama o Server Action dispatch */}
          <form action={dispatch} className="space-y-4">
            
            {/* Campo E-mail */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemplo@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Entrar
            </Button>

            {/* Link para a pagina de Cadastro */}
            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Cadastre-se
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}




