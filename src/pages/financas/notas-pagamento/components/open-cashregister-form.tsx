import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { LockOpen, Loader2 } from "lucide-react";
import { useOpenCashRegister } from "@/hooks/financa/use-cash-register";
import { CaixasDisponiveisSelect } from "@/components/common/global-selects/CaixasDisponiveisSelect";

const QUICK_AMOUNTS = [0, 5_000, 10_000, 20_000, 50_000];

function formatAOA(value: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  }).format(value);
}

function CashRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [caixaSelecionado, setCaixaSelecionado] = useState<string>("");
  const [montanteInicial, setMontanteInicial] = useState<number | "">("");
  const [quickSelected, setQuickSelected] = useState<number | null>(null);

  const { mutateAsync: openCashRegister, isPending: isLoading } =
    useOpenCashRegister();

  const numericAmount = Number(montanteInicial) || 0;
  const isValid = caixaSelecionado !== "";

  const handleQuickAmount = (amount: number) => {
    setQuickSelected(amount);
    setMontanteInicial(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickSelected(null);
    const val = e.target.value;
    setMontanteInicial(val === "" ? "" : Number(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await openCashRegister({
      id: Number(caixaSelecionado),
      openingAmount: numericAmount,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      <div className="space-y-1.5">
        <CaixasDisponiveisSelect
          value={caixaSelecionado}
          onChangeValue={setCaixaSelecionado}
        />
      </div>

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
              {(amount / 1_000).toFixed(0)} 000
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 border border-border">
        <span className="text-sm text-muted-foreground">Saldo de abertura</span>
        <span className="text-base font-semibold tabular-nums">
          {formatAOA(numericAmount)}
        </span>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />A abrir caixa...
            </>
          ) : (
            <>
              <LockOpen className="w-4 h-4" />
              Abrir caixa
            </>
          )}
        </Button>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/25" />
        Sistema financeiro activo
      </div>
    </form>
  );
}

export function OpenCashRegisterTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <LockOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Nenhum caixa aberto
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              É necessário abrir um caixa antes de liquidar notas de pagamento.
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockOpen className="h-5 w-5 text-muted-foreground" />
              Abrir Caixa
            </DialogTitle>
            <DialogDescription>
              Selecione o caixa e defina o montante inicial para começar as
              operações financeiras.
            </DialogDescription>
          </DialogHeader>

          <CashRegisterForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
