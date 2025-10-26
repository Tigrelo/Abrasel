import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// página Server Component que apenas redireciona
export default async function HomePage() {
  
  // 1. Verifica se há uma sessão
  const session = await auth();

  // 2. Decide para onde redirecionar
  if (session?.user) {
    // Se está logado, vai para o dashboard
    redirect('/dashboard');
  } else {
    // Se não esta logado vai para o login
    redirect('/login');
  }

  // A pagina nunca sera renderizada
  return null;
}