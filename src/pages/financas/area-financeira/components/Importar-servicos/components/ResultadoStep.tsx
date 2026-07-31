import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { CreateServicesMassResponse } from "@/services/financas/create-services-mass";

interface ResultadoStepProps {
  resultado: CreateServicesMassResponse;
  origemLabel: string;
  destinoLabel: string;
  onNovaImportacao: () => void;
}

export function ResultadoStep({
  resultado,
  origemLabel,
  destinoLabel,
  onNovaImportacao,
}: ResultadoStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center py-8">
        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 p-5">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">Importação concluída</h2>
        <p className="text-muted-foreground mt-1">
          Serviços copiados de <b>{origemLabel}</b> para <b>{destinoLabel}</b>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {resultado.message}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Total Recebidos
            </div>
            <div className="text-3xl font-bold mt-1">
              {resultado.totalRecebidos}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Importados com Sucesso
            </div>
            <div className="text-3xl font-bold mt-1">
              {resultado.totalCadastrados}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-amber-200/60">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Não Importados
            </div>
            <div className="text-3xl font-bold mt-1">
              {resultado.totalDuplicados}
            </div>
          </CardContent>
        </Card>
      </div>

      {[
        {
          key: "cadastrados" as const,
          titulo: "Importados",
          icon: CheckCircle2,
          cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
          badge: "Importado",
        },
        {
          key: "duplicados" as const,
          titulo: "Não importados",
          icon: AlertTriangle,
          cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
          badge: "Não importado",
        },
      ].map((sec) => {
        const itens = resultado[sec.key];
        if (!itens || itens.length === 0) return null;
        const Icon = sec.icon;
        return (
          <div key={sec.key} className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <Icon className="h-4 w-4" /> {sec.titulo}
              <Badge variant="secondary">{itens.length}</Badge>
            </h3>
            <div className="space-y-2.5">
              {itens.map((it, idx) => (
                <div
                  key={`${it.sigla}-${idx}`}
                  className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium leading-tight">
                        {it.descricao.replace(/propina/gi, "Mensalidade")}
                      </span>
                    </div>

                    {it.motivo && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {it.motivo}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={`shrink-0 border-0 font-medium ${sec.cls}`}
                  >
                    {sec.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onNovaImportacao} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Nova importação
        </Button>
      </div>
    </div>
  );
}
