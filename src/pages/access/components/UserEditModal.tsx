// src/pages/components/UserEditModal.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff } from "lucide-react";

import { User } from "@/services/access/fect-users.service";
import { useUpdateUserPassword } from "@/hooks/acess/use-mutation-updade-user";



interface UserEditModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserEditModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserEditModalProps) {
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { mutateAsync: updatePassword ,isPending} = useUpdateUserPassword();

  const passwordsIguais = novaPassword === confirmarPassword && novaPassword !== "";
  const podeGuardar = passwordsIguais && novaPassword.length >= 6; 

  async function handleChangePassword() {
    if (!podeGuardar) return;

    try {
      await updatePassword({
        utilizadorId: user.codigo,
       novaSenha: novaPassword,
      });

      onSuccess?.();
      onOpenChange(false);

      // Reset campos
      setNovaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      console.error("Erro ao alterar password:", error);
      // O hook pode lançar toast de erro
    }
  }

  // Reset ao abrir/fechar
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNovaPassword("");
      setConfirmarPassword("");
      setMostrarPassword(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Key className="h-6 w-6 text-primary" />
            Alterar Password – {user.nome}
            <Badge variant="outline">Código: {user.codigo}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nova-password">Nova password</Label>
            <div className="relative">
              <Input
                id="nova-password"
                type={mostrarPassword ? "text" : "password"}
                value={novaPassword}
                onChange={(e) => setNovaPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmar-password">Confirmar password</Label>
            <Input
              id="confirmar-password"
              type={mostrarPassword ? "text" : "password"}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••••••"
              className={
                confirmarPassword && novaPassword !== confirmarPassword
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {confirmarPassword && novaPassword !== confirmarPassword && (
              <p className="text-sm text-destructive">As passwords não coincidem</p>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            A password deve ter pelo menos 6 caracteres.
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={!podeGuardar || isPending}
          >
            {isPending ? "A alterar..." : "Alterar password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}