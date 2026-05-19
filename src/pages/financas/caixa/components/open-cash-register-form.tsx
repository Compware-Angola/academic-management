import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DialogFooter } from "@/components/ui/dialog";

import { useOpenCashRegister } from "@/hooks/financa/use-cash-register";

import { CashRegister } from "@/services/finance/cash-register.service";
import { AvaliableOperatorsSelect } from "@/components/common/global-selects/AvaliableOperators";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, LockOpen, Wallet } from "lucide-react";
import { formatCurrencyAOA } from "@/util/format-currency";

const QUICK_AMOUNTS = [0, 5_000, 10_000, 20_000, 50_000];
export function OpenCashRegisterForm({
  register,
  onSuccess,
  onCancel,
}: {
  register: CashRegister;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [montanteInicial, setMontanteInicial] = useState<number | "">(0);
  const [quickSelected, setQuickSelected] = useState<number | null>(0);
  const [operatorId, setOperatorId] = useState<string | null>(null);

  const { mutateAsync: openCashRegister, isPending: isLoading } =
    useOpenCashRegister();

  const numericAmount = Number(montanteInicial) || 0;

  const handleQuickAmount = (amount: number) => {
    setQuickSelected(amount);
    setMontanteInicial(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickSelected(null);
    const val = e.target.value;
    setMontanteInicial(val === "" ? "" : Number(val));
  };

  const handleSubmit = async () => {
    if (!operatorId) {
      toast.error("Selecione um operador");
      return;
    }
    await openCashRegister({
      id: register.id,
      openingAmount: numericAmount,
      operatorId: Number(operatorId),
    });
    onSuccess();
  };

  return (
    <div className="space-y-5 pt-1">
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">{register.name}</p>
          {register.code && (
            <p className="text-xs text-muted-foreground">
              Cód: {register.code}
            </p>
          )}
        </div>
      </div>
      <AvaliableOperatorsSelect
        onChangeValue={setOperatorId}
        value={operatorId ?? ""}
      />
      <div className="space-y-1.5">
        <Label htmlFor="montanteInicial" className="text-sm font-medium">
          Montante inicial
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none select-none">
            AOA
          </span>
          <Input
            id="montanteInicial"
            type="number"
            min={0}
            step={1000}
            value={montanteInicial}
            onChange={handleAmountChange}
            placeholder="0,00"
            className="pl-14 bg-muted/40"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Valor em Kwanzas para abertura do caixa
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAmount(amount)}
              className={[
                "px-3 py-1 rounded-full text-xs border transition-all",
                quickSelected === amount
                  ? "bg-primary/10 border-primary text-primary font-medium"
                  : "bg-muted/50 border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              ].join(" ")}
            >
              {amount === 0
                ? "Sem saldo"
                : `${(amount / 1_000).toFixed(0)} 000`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">Saldo de abertura</span>
        <span className="text-base font-semibold tabular-nums">
          {formatCurrencyAOA(numericAmount)}
        </span>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !operatorId}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />A abrir...
            </>
          ) : (
            <>
              <LockOpen className="h-4 w-4" />
              Abrir caixa
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
