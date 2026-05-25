import { useState } from "react";

import { LockOpen, Loader2, RefreshCw } from "lucide-react";

import { AuthStorage } from "@/util/auth-storage";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import {
  useVerifyMyCashRegisterOpeningCode,
  useRecoveryOpeningCode,
} from "@/hooks/financa/use-cash-register";
import { CashRegister } from "@/services/finance/cash-register.service";

export function CashRegisterConfirmationAlert({
  myCaixa,
}: {
  myCaixa: CashRegister;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [openingCode, setOpeningCode] = useState("");

  const verifyOpeningCodeMutation = useVerifyMyCashRegisterOpeningCode();
  const recoveryOpeningCodeMutation = useRecoveryOpeningCode();

  const handleVerifyOpeningCode = async () => {
    await verifyOpeningCodeMutation.mutateAsync(openingCode);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <LockOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {myCaixa && myCaixa.status === "aberto"
                ? "Por favor confirme o caixa"
                : "Nenhum caixa aberto para seu usuário"}
            </p>

            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              {myCaixa && myCaixa.status === "aberto"
                ? "Informe o código de abertura do caixa para continuar."
                : "Solicite ao administrador do sistema que abra um caixa para o seu usuário."}
            </p>
          </div>
        </div>

        {myCaixa && myCaixa.status === "aberto" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="shrink-0 gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <LockOpen className="h-4 w-4" />
              Confirmar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={() => recoveryOpeningCodeMutation.mutate()}
              disabled={recoveryOpeningCodeMutation.isPending}
            >
              {recoveryOpeningCodeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Recuperar Código
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar código de abertura</AlertDialogTitle>

            <AlertDialogDescription>
              Informe o código de abertura do caixa para validar o acesso.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            type="number"
            placeholder="Digite o código"
            value={openingCode}
            onChange={(e) => setOpeningCode(e.target.value)}
          />

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>

            <Button
              onClick={handleVerifyOpeningCode}
              disabled={verifyOpeningCodeMutation.isPending || !openingCode}
            >
              {verifyOpeningCodeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
