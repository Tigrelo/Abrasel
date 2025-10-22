'use client'; 

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // <-- 1. IMPORTADO CORRETAMENTE

// Importa a action
import { registerUser, type RegisterState } from '@/app/actions/auth-actions';

// Importa os componentes de UI do Shadcn
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


// 1. Schema de validação
const formSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiúscula.')
    .regex(/[a-z]/, 'Pelo menos uma letra minúscula.')
    .regex(/[0-9]/, 'Pelo menos um número.'),
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  
  // O 'useToast()' foi removido

  // 2. useFormState
  const initialState: RegisterState = { errors: {}, success: false };
  const [state, dispatch] = useFormState(registerUser, initialState);

  // 3. react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      cep: '',
      state: '',
      city: '',
    },
  });

  // 4. Observa o campo CEP
  const cepValue = form.watch('cep');
  useEffect(() => {
    const cleanCep = cepValue?.replace(/\D/g, '');

    if (cleanCep && cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            form.setValue('state', data.uf);
            form.setValue('city', data.localidade);
          } else {
            // 2. CHAMADA CORRIGIDA
            toast.error('CEP não encontrado'); 
            form.setValue('state', '');
            form.setValue('city', '');
          }
        })
        .catch(() => {
           // 2. CHAMADA CORRIGIDA
           toast.error('Erro ao buscar CEP');
        });
    }
  }, [cepValue, form]); // <-- 3. DEPENDÊNCIA REMOVIDA

  // 5. Lida com a resposta
  useEffect(() => {
    if (state.success) {
      // 2. CHAMADA CORRIGIDA
      toast.success('Cadastro realizado com sucesso!', {
         description: 'Você será redirecionado para o login.',
      });
      setTimeout(() => router.push('/login'), 2000);
    }
    if (state.errors?._form) {
       // 2. CHAMADA CORRIGIDA
      toast.error('Erro no cadastro', {
        description: state.errors._form.join(', '),
      });
    }
  }, [state, router]); // <-- 3. DEPENDÊNCIA REMOVIDA

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Criar Conta</h1>
        
        <Form {...form}>
          <form action={dispatch} className="space-y-4">
            
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            
            {/* Campo CEP */}
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Estado (preenchido via API) */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Cidade (preenchido via API) */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}