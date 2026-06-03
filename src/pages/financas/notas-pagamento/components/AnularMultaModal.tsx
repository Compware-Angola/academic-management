import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVoidPaymentTax } from "@/hooks/financas/area-financeira/use-mutation-void-payment-tax";
import { Loader2 } from "lucide-react";
import { useState } from "react";
interface AnularPagamentoProps {
  paymentId: number;
  open: boolean;
  onClose: () => void;
}
const AnularMultaModal = ({
  onClose,
  open,
  paymentId,
}: AnularPagamentoProps) => {
  const [motivo, setMotivo] = useState("");

  const { mutate: voidPaymentTax, isPending } = useVoidPaymentTax();

  const handleAnular = () => {
    voidPaymentTax({
      codigoPagamento: paymentId,
      motivo: "Pagamento realizado em duplicado",
    });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anular Pagamento</DialogTitle>
            <DialogDescription className="text-justify">
              Esta operação irá{" "}
              <span className="font-bold text-destructive">
                anular a multa de um pagamento{" "}
              </span>{" "}
              registado no sistema. Após a confirmação, o pagamento deixará de
              ser considerado para efeitos financeiros e académicos, podendo
              impactar processos ou serviços que dependam da sua validação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="motivoDesdiplomar">Motivo da anulação</Label>
            <Textarea
              id="motivoDesdiplomar"
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Descreva o motivo da anulação"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              O motivo será registado no log da operação.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={handleAnular}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Anular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { AnularMultaModal };
