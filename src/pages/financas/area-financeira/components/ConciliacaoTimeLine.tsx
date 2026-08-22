// src/pages/negotiation/components/ConciliacaoTimelineModal.tsx
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Receipt,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  Pencil,
  ChevronDown,
  Loader2,
  AlertCircle,
  Hash,
  Ban,
} from "lucide-react";
import { formatarData } from "@/util/date-formate";
import { formatCurrencyAOA } from "@/util/format-currency";
import { useConciliationDetails } from "@/hooks/financas/dividas/use-query-conciliacao-divida-details";
import type { ConciliationInvoiceItem } from "@/services/financas/conciliacao-divida/fetch-conciliacao-divida";
import { InvoiceEnum } from "@/enums/invoice.enum";

interface ConciliacaoTimelineModalProps {
  /** id da conciliação a consultar. null/undefined = modal fechado */
  conciliationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

const STATUS_BADGE: Record<string, string> = {
  PENDENTE: "border-warning/40 bg-warning/10 text-warning",
  APROVADO: "border-success/40 bg-success/10 text-success",
  REJEITADO: "border-destructive/40 bg-destructive/10 text-destructive",
};

// Estado da FACTURA em si (InvoiceEnum), diferente do estado da conciliação acima
const INVOICE_STATUS_LABEL: Record<number, string> = {
  [InvoiceEnum.PENDENTE]: "Pendente",
  [InvoiceEnum.PAGO]: "Pago",
  [InvoiceEnum.PARCELADO]: "Parcelado",
  [InvoiceEnum.ANULADO]: "Anulado",
  [InvoiceEnum.ISENTO]: "Isento",
};

const INVOICE_STATUS_BADGE: Record<number, string> = {
  [InvoiceEnum.PENDENTE]: "border-warning/40 bg-warning/10 text-warning",
  [InvoiceEnum.PAGO]: "border-success/40 bg-success/10 text-success",
  [InvoiceEnum.PARCELADO]:
    "border-sky-400/40 bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  [InvoiceEnum.ANULADO]:
    "border-destructive/40 bg-destructive/10 text-destructive",
  [InvoiceEnum.ISENTO]:
    "border-muted-foreground/30 bg-muted text-muted-foreground",
};

function InvoiceStatusBadge({ estado }: { estado: number }) {
  const label = INVOICE_STATUS_LABEL[estado] ?? "—";
  const cls =
    INVOICE_STATUS_BADGE[estado] ??
    "border-muted-foreground/30 bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {estado === InvoiceEnum.ANULADO && <Ban className="h-3 w-3" />}
      {label}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function diffItem(
  original: ConciliationInvoiceItem,
  proposta: ConciliationInvoiceItem,
) {
  const priceChanged = original.preco_unitario !== proposta.preco_unitario;
  const totalChanged = original.valor_total !== proposta.valor_total;
  return { priceChanged, totalChanged, changed: priceChanged || totalChanged };
}

function KpiBlock({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: any;
  accent: "info" | "success" | "warning" | "danger";
}) {
  const accentCfg: Record<string, string> = {
    info: "text-sky-600 bg-sky-100 dark:bg-sky-900/40",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
  };
  return (
    <div className="rounded-lg border p-3 flex items-center gap-3 bg-card">
      <span
        className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${accentCfg[accent]}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-bold truncate">{value}</p>
      </div>
    </div>
  );
}

export function ConciliacaoTimelineModal({
  conciliationId,
  open,
  onOpenChange,
}: ConciliacaoTimelineModalProps) {
  const {
    data: conciliation,
    isLoading,
    isError,
  } = useConciliationDetails(conciliationId ?? undefined);

  const [showItems, setShowItems] = useState(false);

  const pairs = useMemo(() => {
    if (!conciliation) return [];
    const propostaItens = conciliation.facturaPropostaAlteracao.itens;
    return conciliation.facturaOriginal.itens.map((original, index) => ({
      original,
      proposta: propostaItens[index] ?? original,
    }));
  }, [conciliation]);

  const totalOriginal = conciliation?.facturaOriginal.valorApagar ?? 0;
  const totalConciliado =
    conciliation?.facturaPropostaAlteracao.valorApagar ?? 0;
  const difference = totalConciliado - totalOriginal;
  const percentChange = totalOriginal ? (difference / totalOriginal) * 100 : 0;
  const changedCount = pairs.filter(
    (p) => diffItem(p.original, p.proposta).changed,
  ).length;
  const isDecided = !!conciliation && conciliation.status !== "PENDENTE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Transição da Conciliação de Dívida
          </p>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Receipt className="h-5 w-5 text-primary" />
            {conciliation?.facturaOriginal.codigo ??
              (isLoading ? "A carregar…" : "-")}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">A carregar conciliação…</span>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <span className="text-sm">
                Não foi possível carregar esta conciliação.
              </span>
            </div>
          )}

          {!isLoading && !isError && conciliation && (
            <>
              {/* Cabeçalho: aluno + estado */}
              <div className="rounded-lg border p-4 bg-muted/20">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                      {getInitials(conciliation.estudante?.nome ?? "—")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {conciliation.estudante?.nome ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Nº {conciliation.estudante?.codigoMatricula ?? "—"}
                        {conciliation.estudante?.curso
                          ? ` · ${conciliation.estudante.curso}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[conciliation.status]}`}
                  >
                    {STATUS_LABEL[conciliation.status]}
                  </span>
                </div>
              </div>

              {/* Transição visual: Original -> Conciliada */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Transição de Facturas
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 rounded-lg border p-4 bg-card">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Factura Original
                          </p>
                          <p className="text-sm font-semibold truncate">
                            {conciliation.facturaOriginal.codigo}
                          </p>
                        </div>
                      </div>
                      <InvoiceStatusBadge
                        estado={conciliation.facturaOriginal.estado}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Hash className="h-3 w-3 shrink-0" />
                      <span className="font-mono">
                        {conciliation.facturaOriginal.codigo}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatarData(conciliation.facturaOriginal.data)}
                    </p>
                    <p
                      className={`text-2xl font-bold text-muted-foreground mt-2 ${
                        conciliation.facturaOriginal.estado ===
                        InvoiceEnum.ANULADO
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {formatCurrencyAOA(totalOriginal)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conciliation.facturaOriginal.itens.length} itens
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center justify-center gap-1 shrink-0 py-2">
                    <div className="h-9 w-9 rounded-full bg-success/15 flex items-center justify-center rotate-90 sm:rotate-0">
                      <ArrowRight className="h-[18px] w-[18px] text-success" />
                    </div>
                    <span className="text-[11px] font-medium text-success whitespace-nowrap">
                      {percentChange > 0 ? "+" : ""}
                      {percentChange.toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex-1 rounded-lg border border-primary/40 p-4 bg-primary/5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Receipt className="h-4 w-4 text-primary" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Factura Conciliada
                          </p>
                          <p className="text-sm font-semibold truncate">
                            {conciliation.facturaPropostaAlteracao.codigo}
                          </p>
                        </div>
                      </div>
                      <InvoiceStatusBadge
                        estado={conciliation.facturaPropostaAlteracao.estado}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Hash className="h-3 w-3 shrink-0" />
                      <span className="font-mono">
                        {conciliation.facturaPropostaAlteracao.codigo}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatarData(conciliation.facturaPropostaAlteracao.data)}
                    </p>
                    <p
                      className={`text-2xl font-bold text-primary mt-2 ${
                        conciliation.facturaPropostaAlteracao.estado ===
                        InvoiceEnum.ANULADO
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {formatCurrencyAOA(totalConciliado)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conciliation.facturaPropostaAlteracao.itens.length} itens
                    </p>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <KpiBlock
                  label="Diferença"
                  value={formatCurrencyAOA(difference)}
                  icon={TrendingDown}
                  accent={difference <= 0 ? "success" : "danger"}
                />
                <KpiBlock
                  label="Itens Alterados"
                  value={`${changedCount} de ${pairs.length}`}
                  icon={Pencil}
                  accent="warning"
                />
                <KpiBlock
                  label="Data da Proposta"
                  value={formatarData(
                    conciliation.facturaPropostaAlteracao.data,
                  )}
                  icon={Clock}
                  accent="info"
                />
              </div>

              {/* Linha do tempo de eventos */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Histórico</h3>
                <ol className="relative border-l-2 border-dashed border-border ml-3 space-y-5">
                  <li className="ml-6">
                    <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background bg-muted text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <div className="rounded-lg border p-3.5 bg-card">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-0 bg-muted text-muted-foreground"
                          >
                            Emissão Original
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatarData(conciliation.facturaOriginal.data)}
                          </span>
                        </div>
                        <span className="text-sm font-bold">
                          {formatCurrencyAOA(totalOriginal)}
                        </span>
                      </div>
                    </div>
                  </li>

                  {conciliation.facturaOriginal.estado ===
                    InvoiceEnum.ANULADO && (
                    <li className="ml-6">
                      <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background bg-destructive/15 text-destructive">
                        <Ban className="h-3.5 w-3.5" />
                      </span>
                      <div className="rounded-lg border p-3.5 bg-card ring-1 ring-destructive/20">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-0 bg-destructive/10 text-destructive"
                            >
                              Factura Original Anulada
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {conciliation.facturaOriginal.codigo}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          A factura original foi anulada e substituída pela
                          proposta de conciliação abaixo.
                        </p>
                      </div>
                    </li>
                  )}

                  <li className="ml-6">
                    <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background bg-primary/15 text-primary">
                      <Receipt className="h-3.5 w-3.5" />
                    </span>
                    <div className="rounded-lg border p-3.5 bg-card ring-1 ring-primary/20">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-0 bg-primary/10 text-primary"
                          >
                            Proposta de Conciliação
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatarData(conciliation.createdAt)}
                          </span>
                          <InvoiceStatusBadge
                            estado={
                              conciliation.facturaPropostaAlteracao.estado
                            }
                          />
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {formatCurrencyAOA(totalConciliado)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground font-mono">
                        {conciliation.facturaPropostaAlteracao.codigo}
                      </p>
                      {conciliation.descricaoCriacao && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {conciliation.descricaoCriacao}
                        </p>
                      )}
                    </div>
                  </li>

                  {isDecided && (
                    <li className="ml-6">
                      <span
                        className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${
                          conciliation.status === "APROVADO"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {conciliation.status === "APROVADO" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div
                        className={`rounded-lg border p-3.5 bg-card ring-1 ${
                          conciliation.status === "APROVADO"
                            ? "ring-success/20"
                            : "ring-destructive/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`border-0 ${
                              conciliation.status === "APROVADO"
                                ? "bg-success/10 text-success"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {STATUS_LABEL[conciliation.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {conciliation.validatedAt
                              ? formatarData(conciliation.validatedAt)
                              : "—"}
                          </span>
                        </div>
                        {conciliation.descricaoValidacao && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {conciliation.descricaoValidacao}
                          </p>
                        )}
                      </div>
                    </li>
                  )}
                </ol>
              </div>

              {/* Itens alterados (colapsável) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowItems((v) => !v)}
                  className="flex items-center justify-between w-full text-sm font-semibold"
                >
                  <span>
                    Itens Alterados ({changedCount} de {pairs.length})
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${showItems ? "rotate-180" : ""}`}
                  />
                </button>

                {showItems && (
                  <div className="mt-3 space-y-2">
                    {changedCount === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Nenhum item foi alterado nesta conciliação.
                      </p>
                    )}
                    {pairs.map(({ original, proposta }) => {
                      const diff = diffItem(original, proposta);
                      if (!diff.changed) return null;
                      return (
                        <div
                          key={proposta.codigo}
                          className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs space-y-1.5"
                        >
                          <p className="font-medium">
                            {proposta.descricao}
                            {proposta.mes_designacao
                              ? ` (${proposta.mes_designacao})`
                              : ""}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground line-through">
                              {formatCurrencyAOA(original.valor_total)}
                            </span>
                            <ArrowRight className="h-3 w-3 text-warning shrink-0" />
                            <span className="font-semibold text-warning">
                              {formatCurrencyAOA(proposta.valor_total)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
