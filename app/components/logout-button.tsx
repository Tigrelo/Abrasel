'use client';

import { signOutUser } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  // Este formulário simplesmente chama a Server Action de logout
  return (
    <form action={signOutUser}>
      <Button type="submit" variant="destructive">
        Sair
      </Button>
    </form>
  );
}