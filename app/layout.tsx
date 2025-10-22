import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Desafio Abrasel',
  description: 'Gerenciamento de usuários',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors /> {/* MUDANÇA AQUI: Adiciona o Toaster do Sonner */}
      </body>
    </html>
  );
}