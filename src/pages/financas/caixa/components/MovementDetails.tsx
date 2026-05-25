import { Badge } from "@/components/ui/badge";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";
import { formatDate } from "../../notas-pagamento/components/form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MovementDetailsPDF } from "@/components/views/pdf/MovementDetailsPDF";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function MovementDetails({
  movement,
}: {
  movement: CashRegisterMovement;
}) {
  const formatTime = (time: string | null) => {
    if (!time) return "-";
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return time;
  };

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
            {movement.status === "aberto"
              ? "Aberto"
              : movement.status === "fechado"
                ? "Fechado"
                : movement.status}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Data de Abertura</p>
          <p className="font-medium">{formatDate(movement.date_at)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Hora de Abertura</p>
          <p className="font-mono text-sm">
            {formatTime(movement.opening_time)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Data de Fecho</p>
          <p className="font-medium">
            {movement.closing_date ? formatDate(movement.closing_date) : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Hora do Fecho</p>
          <p className="font-mono text-sm">
            {formatTime(movement.closing_time)}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Valores</h4>
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

      {movement.admin_status && movement.admin_status !== "pendente" && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Validação</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Status da Validação
              </p>
              <Badge
                variant={
                  movement.admin_status === "validado"
                    ? "default"
                    : "destructive"
                }
                className={
                  movement.admin_status === "validado"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : ""
                }
              >
                {movement.admin_status === "validado"
                  ? "Validado"
                  : "Rejeitado"}
              </Badge>
            </div>
            {movement.validation_date && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Data de Validação
                </p>
                <p className="text-sm">
                  {formatDate(movement.validation_date)}
                </p>
              </div>
            )}
            {movement.validation_time && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Hora da Validação
                </p>
                <p className="text-sm font-mono">
                  {formatTime(movement.validation_time)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {movement.observation && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Observação</h4>
          <p className="text-sm text-muted-foreground">
            {movement.observation}
          </p>
        </div>
      )}

      <div className="border-t pt-4 flex justify-end">
        <PDFDownloadLink
          document={<MovementDetailsPDF movement={movement} />}
          fileName={`movimento-${movement.code}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              {loading ? "Gerando PDF..." : "Baixar PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
