import {
  CheckCircle2,
  CircleX,
  Info,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ResultadoUC = {
  codigoDisciplina: number;
  designacao: string;
  status: "adicionada" | "reativada" | "jaNoPlano" | "falha";
  motivo?: string;
};

interface ResultadoAddUCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultados: ResultadoUC[];
}

const statusMeta: Record<
  ResultadoUC["status"],
  {
    label: string;
    badge: string;
    icon: typeof CheckCircle2;
    iconColor: string;
  }
> = {
  adicionada: {
    label: "Adicionada",
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  reativada: {
    label: "Reativada",
    badge: "bg-sky-500/10 text-sky-700 border-sky-500/30",
    icon: RefreshCcw,
    iconColor: "text-sky-500",
  },
  jaNoPlano: {
    label: "Já no plano",
    badge: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    icon: Info,
    iconColor: "text-amber-500",
  },
  falha: {
    label: "Falhou",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    icon: CircleX,
    iconColor: "text-destructive",
  },
};

export function ResultadoAddUCModal({
  open,
  onOpenChange,
  resultados,
}: ResultadoAddUCModalProps) {
  const totalOk = resultados.filter(
    (r) => r.status === "adicionada" || r.status === "reativada",
  ).length;
  const totalJaNoPlano = resultados.filter(
    (r) => r.status === "jaNoPlano",
  ).length;
  const totalFalhas = resultados.filter((r) => r.status === "falha").length;

  const resumo = [
    totalOk > 0 && `${totalOk} adicionada(s)`,
    totalJaNoPlano > 0 && `${totalJaNoPlano} já no plano`,
    totalFalhas > 0 && `${totalFalhas} falha(s)`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl! p-0 overflow-hidden shadow-2xl border-border/40">
        <div className="px-6 pt-6 pb-4 border-b bg-muted/20">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Resultado da Adição ao Plano
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {resumo || (
                <>
                  Processadas{" "}
                  <strong className="font-semibold text-foreground">
                    {resultados.length}
                  </strong>{" "}
                  unidade(s) curricular(es)
                </>
              )}
            </p>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh] px-6 py-4">
          {resultados.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma unidade curricular foi processada.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {resultados.map((r, index) => {
                const meta = statusMeta[r.status];
                const Icon = meta.icon;
                return (
                  <li
                    key={`${r.codigoDisciplina}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-lg border bg-card p-3.5"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <Icon
                        className={cn("h-5 w-5 shrink-0 mt-0.5", meta.iconColor)}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {r.designacao}
                        </p>
                        {r.motivo && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {r.motivo}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 whitespace-nowrap",
                        meta.badge,
                      )}
                    >
                      {meta.label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}