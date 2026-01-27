
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
import { Key, Eye, EyeOff, Check, X } from "lucide-react";

import { User } from "@/services/access/fect-users.service";
import { useUpdateUserPassword } from "@/hooks/acess/use-mutation-updade-user";

interface UserEditModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}


// 🔹 função para validar cada requisito individual
function validatePasswordSteps(password: string) {
  return {
    minLength: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{}|;:',.<>/?~]/.test(password),
  };
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
  const { mutateAsync: updatePassword, isPending } = useUpdateUserPassword();

  // 🔹 validações
  const passwordsIguais = novaPassword === confirmarPassword && novaPassword !== "";
  const steps = validatePasswordSteps(novaPassword);
  const senhaForte = Object.values(steps).every(Boolean);
  const podeGuardar = passwordsIguais && senhaForte;

  // 🔹 handler para alterar a senha
  async function handleChangePassword() {
    if (!podeGuardar) return;

    try {
      await updatePassword({
        utilizadorId: user.codigo,
        novaSenha: novaPassword,
      });

      onSuccess?.();
      handleOpenChange(false);

      // Reset campos
      setNovaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      console.error("Erro ao alterar password:", error);
    }
  }

  // 🔹 reset ao abrir/fechar modal
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
          {/* Nova senha */}
          <div className="space-y-2">
            <Label htmlFor="nova-password">Nova password</Label>
            <div className="relative">
              <Input
                id="nova-password"
                type={mostrarPassword ? "text" : "password"}
                value={novaPassword}
                onChange={(e) => setNovaPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                autoComplete="new-password"
                name="nova-senha-unique"
                className={novaPassword && !senhaForte ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* 🔹 passos da senha */}
            {novaPassword && (
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  {steps.minLength ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center gap-2">
                  {steps.upperCase ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  Pelo menos 1 letra maiúscula
                </li>
                <li className="flex items-center gap-2">
                  {steps.lowerCase ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  Pelo menos 1 letra minúscula
                </li>
                <li className="flex items-center gap-2">
                  {steps.number ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  Pelo menos 1 número
                </li>
                <li className="flex items-center gap-2">
                  {steps.symbol ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  Pelo menos 1 símbolo
                </li>
              </ul>
            )}
          </div>

          {/* Confirmar senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmar-password">Confirmar password</Label>
            <Input
              id="confirmar-password"
              type={mostrarPassword ? "text" : "password"}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              name="confirmar-senha-unique"
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
        </div>

        {/* Ações */}
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
