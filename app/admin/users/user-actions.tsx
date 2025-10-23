'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserName, deleteUser } from '@/app/actions/admin-actions';

// Importa os componentes de UI
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Tipagem das props que o componente receberá
interface UserActionsProps {
  userId: string;
  currentName: string;
}

// O componente em si
export function UserActions({ userId, currentName }: UserActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newName, setNewName] = useState(currentName);

  //logica de Edição
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateUserName(userId, formData);

    if (result.success) {
      toast.success(result.message);
      setIsEditModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  // logica de Deleção
  const handleDeleteSubmit = async () => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success(result.message);
      setIsDeleteModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      {/*Botão de Dropdown*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>

            ... {/* (Você pode substituir por um ícone) */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            Editar Nome
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="text-red-600">
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nome</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Novo nome</Label>
              <Input
                id="name"
                name="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Deleção  */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente o usuário.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit}>
              Sim, deletar usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}