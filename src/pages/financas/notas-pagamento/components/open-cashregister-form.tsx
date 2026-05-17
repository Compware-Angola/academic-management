import { useState } from "react";
import { Button } from "@/components/ui/button";

import { LockOpen } from "lucide-react";

export function OpenCashRegisterTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <LockOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Nenhum caixa aberto para seu usuário
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              Solicite ao admin do sistema que abra um caixa para o seu usuário.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => setOpen(true)}
        >
          <LockOpen className="h-4 w-4" />
          Abrir caixa
        </Button>
      </div>
    </>
  );
}
