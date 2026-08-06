// src/pages/negotiation/components/ConciliacaoResultModal.tsx
import { ArrowRight, CheckCircle2, FileWarning, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface ConciliacaoDividaResultItem {
  id: number;
  facturaOriginal: { Codigo: number };
  facturaPropostaAlteracao: { Codigo: number };
  descricaoCriacao: string;
  descricaoValidacao: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  validatedBy: number | null;
  validatedAt: string | null;
}

export interface ConciliacaoDividaErrorItem {
  invoiceId: number;
  mensagem: string;
}

export interface ConciliacaoDividaErrorResponse {
  message: string;
  errors: ConciliacaoDividaErrorItem[];
}

interface ConciliacaoResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ConciliacaoDividaResultItem[] | null;
  error: ConciliacaoDividaErrorResponse | null;
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-AO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ConciliacaoResultModal({
  open,
  onOpenChange,
  result,
  error,
}: ConciliacaoResultModalProps) {
  const isSuccess = !error && !!result && result.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <DialogTitle>
              {isSuccess ? "Conciliação Submetida" : "Falha na Conciliação"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isSuccess
              ? "A proposta de conciliação foi criada com sucesso e está a aguardar validação."
              : (error?.message ??
                "Não foi possível concluir a conciliação de dívida.")}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {isSuccess &&
            result!.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>#{item.facturaOriginal.Codigo}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>#{item.facturaPropostaAlteracao.Codigo}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-amber-800 text-[10px]"
                  >
                    {STATUS_LABEL[item.status] ?? item.status}
                  </Badge>
                </div>
                {item.descricaoCriacao && (
                  <p className="text-xs text-muted-foreground">
                    {item.descricaoCriacao}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Criado em {formatDateTime(item.createdAt)}
                </p>
              </div>
            ))}

          {!isSuccess &&
            error?.errors?.map((err, index) => (
              <div
                key={`${err.invoiceId}-${index}`}
                className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-1"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <FileWarning className="h-3.5 w-3.5 shrink-0" />
                  Factura #{err.invoiceId}
                </div>
                <p className="text-xs text-muted-foreground">{err.mensagem}</p>
              </div>
            ))}

          {!isSuccess && !error?.errors?.length && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum detalhe adicional disponível.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
