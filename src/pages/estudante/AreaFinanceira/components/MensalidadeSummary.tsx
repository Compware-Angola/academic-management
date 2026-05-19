// components/PaymentSummaryFooter.tsx

import { formatNumber } from "@/util/format-number";
import { Button } from "@/components/ui/button";
import { Loader2, Receipt } from "lucide-react";

const ANNUAL_DISCOUNT_MIN_ITEMS = 10;

type Props = {
  selectedCount: number;
  totalSelecionado: number;
  deveAplicarDesc5: boolean;
  valorDesc5: number;
  descTaxa: number;
  isPending: boolean;
  isMonthFetching: boolean;
  onCreateInvoice: () => void;
};

export function MensalidadeSummary({
  selectedCount,
  totalSelecionado,
  deveAplicarDesc5,
  valorDesc5,
  descTaxa,
  isPending,
  isMonthFetching,
  onCreateInvoice,
}: Props) {
  const faltam = ANNUAL_DISCOUNT_MIN_ITEMS - selectedCount;
  const progressoPct = Math.min(
    (selectedCount / ANNUAL_DISCOUNT_MIN_ITEMS) * 100,
    100,
  );
  const totalFinal = totalSelecionado - valorDesc5;

  return (
    <div className="border-t pt-6">
      <div className="rounded-lg border bg-background p-4">
        <div className="flex items-start justify-between gap-4">
          {/* ── Lado esquerdo: resumo ── */}
          <div className="flex-1 space-y-1 min-w-0">
            {/* Contador de meses */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Resumo</span>
              {selectedCount > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {selectedCount}{" "}
                  {selectedCount === 1 ? "mensalidade" : "mensalidades"}
                </span>
              )}
            </div>

            {deveAplicarDesc5 ? (
              /* ── COM DESCONTO ── */
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-sm font-medium">
                    {formatNumber(totalSelecionado)} Kz
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Desconto anual
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                      DESC5 · {descTaxa}%
                    </span>
                  </div>
                  <span className="text-sm font-medium text-success">
                    − {formatNumber(valorDesc5)} Kz
                  </span>
                </div>

                <div className="border-t my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Total a pagar</span>
                  <span className="text-2xl font-semibold">
                    {formatNumber(totalFinal)} Kz
                  </span>
                </div>
              </>
            ) : (
              /* ── SEM DESCONTO ── */
              <>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm text-muted-foreground mr-2">
                    Total a pagar
                  </span>
                  <span className="text-2xl font-semibold">
                    {formatNumber(totalSelecionado)} Kz
                  </span>
                </div>

                {/* Barra de progresso para desbloquear o desconto */}
                {selectedCount > 0 && faltam > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">
                        Seleccione {faltam} mais para desbloquear {descTaxa}% de
                        desconto anual
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCount}/{ANNUAL_DISCOUNT_MIN_ITEMS}
                      </p>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-300"
                        style={{ width: `${progressoPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Lado direito: botão ── */}
          <Button
            className="gap-2 shrink-0 self-start"
            size="lg"
            onClick={onCreateInvoice}
            disabled={selectedCount === 0 || isPending || isMonthFetching}
          >
            {isPending || isMonthFetching ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />A processar...
              </>
            ) : (
              <>
                <Receipt className="h-5 w-5" />
                Gerar Factura
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
