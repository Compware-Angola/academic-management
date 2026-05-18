import { Badge } from "@/components/ui/badge";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";

export function MovementDetails({
  movement,
}: {
  movement: CashRegisterMovement;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Código</p>
          <p className="font-medium">
            #{String(movement.code).padStart(3, "0")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Abertura</p>
          <p className="font-medium">
            {new Date(movement.date_at).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Fecho</p>
          <p className="font-medium">
            {movement.closing_date
              ? new Date(movement.closing_date).toLocaleString()
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            variant={
              movement.status === "aberto"
                ? "default"
                : movement.status === "fechado"
                  ? "secondary"
                  : "destructive"
            }
          >
            {movement.status}
          </Badge>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Valores</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Valor de Abertura</p>
            <p className="font-medium text-green-600">
              {formatCurrencyAOA(movement.opening_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Arrecadado</p>
            <p className="font-medium text-blue-600">
              {formatCurrencyAOA(movement.total_collected_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Depósitos</p>
            <p className="font-medium">
              {formatCurrencyAOA(movement.collected_deposit_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TPA</p>
            <p className="font-medium">
              {formatCurrencyAOA(movement.collected_tpa_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pagamentos</p>
            <p className="font-medium">
              {formatCurrencyAOA(movement.collected_payment_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Facturado</p>
            <p className="font-medium">
              {formatCurrencyAOA(movement.invoiced_payment_amount)}
            </p>
          </div>
        </div>
      </div>

      {movement.observation && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Observação</h4>
          <p className="text-sm">{movement.observation}</p>
        </div>
      )}
    </div>
  );
}
