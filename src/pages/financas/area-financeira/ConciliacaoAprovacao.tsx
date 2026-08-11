// src/pages/negotiation/ConciliacaoAprovacao.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Hash,
  Home,
  Loader2,
  Pencil,
  Receipt,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyAOA } from "@/util/format-currency";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import type { ConciliationInvoiceItem } from "@/services/financas/conciliacao-divida/fetch-conciliacao-divida";
import { useValidateConciliation } from "@/hooks/financas/dividas/use-validate-conciliacao-divida";
import { useConciliationDetails } from "@/hooks/financas/dividas/use-query-conciliacao-divida-details";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

interface ItemDiff {
  priceChanged: boolean;
  totalChanged: boolean;
  changed: boolean;
}

function diffItem(
  original: ConciliationInvoiceItem,
  proposta: ConciliationInvoiceItem,
): ItemDiff {
  const priceChanged = original.preco_unitario !== proposta.preco_unitario;
  const totalChanged = original.valor_total !== proposta.valor_total;
  return {
    priceChanged,
    totalChanged,
    changed: priceChanged || totalChanged,
  };
}

function OriginalItemCard({ item }: { item: ConciliationInvoiceItem }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-2">
      <p className="text-sm font-medium">
        {item.descricao.replace(/propina/gi, "Mensalidade")}
        {item.mes_designacao && (
          <span className="ml-1 text-xs text-muted-foreground">
            ({item.mes_designacao})
          </span>
        )}
      </p>
      <div className="grid grid-cols-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Quantidade</span>
        <span className="text-right font-medium">{item.quantidade}</span>
        <span className="text-muted-foreground">Preço Unitário</span>
        <span className="text-right font-medium">
          {formatCurrencyAOA(item.preco_unitario)}
        </span>
      </div>
      <Separator />
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Total</span>
        <span>{formatCurrencyAOA(item.valor_total)}</span>
      </div>
    </div>
  );
}

function ConciliatedItemCard({
  original,
  proposta,
}: {
  original: ConciliationInvoiceItem;
  proposta: ConciliationInvoiceItem;
}) {
  const diff = diffItem(original, proposta);

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 transition-colors ${
        diff.changed
          ? "border-warning/40 bg-warning/10"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">
          {proposta.descricao.replace(/propina/gi, "Mensalidade")}
          {proposta.mes_designacao && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({proposta.mes_designacao})
            </span>
          )}
        </p>
        {diff.changed && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-medium text-warning shrink-0">
            Alterado
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Quantidade</span>
        <span className="text-right font-medium">{proposta.quantidade}</span>

        <span className="text-muted-foreground">Preço Unitário</span>
        <span
          className={`text-right font-medium ${diff.priceChanged ? "text-warning" : ""}`}
        >
          {formatCurrencyAOA(proposta.preco_unitario)}
        </span>
      </div>

      {diff.totalChanged && (
        <div className="flex flex-col items-center gap-0.5 rounded-md bg-warning/10 px-2 py-1.5 text-[11px]">
          <span className="text-muted-foreground line-through">
            {formatCurrencyAOA(original.valor_total)}
          </span>
          <ArrowDown className="h-3 w-3 text-warning" />
          <span className="font-semibold text-warning">
            {formatCurrencyAOA(proposta.valor_total)}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Total</span>
        <span className={diff.totalChanged ? "text-warning" : ""}>
          {formatCurrencyAOA(proposta.valor_total)}
        </span>
      </div>
    </div>
  );
}

export function ConciliacaoAprovacao() {
  const { id } = useParams<{ id: string }>();
  const conciliationId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const {
    data: conciliation,
    isLoading,
    isError,
  } = useConciliationDetails(conciliationId);
  const { mutate: validateConciliation, isPending } = useValidateConciliation();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [approveNote, setApproveNote] = useState("");

  const pairs = useMemo(() => {
    if (!conciliation) return [];
    const propostaItens = conciliation.facturaPropostaAlteracao.itens;
    return conciliation.facturaOriginal.itens.map((original, index) => ({
      original,
      proposta: propostaItens[index] ?? original,
    }));
  }, [conciliation]);

  const summary = useMemo(() => {
    if (!conciliation) {
      return {
        totalOriginal: 0,
        totalConciliado: 0,
        difference: 0,
        percentChange: 0,
        changedCount: 0,
        unchangedCount: 0,
      };
    }
    const totalOriginal = conciliation.facturaOriginal.valorApagar;
    const totalConciliado = conciliation.facturaPropostaAlteracao.valorApagar;
    const changedCount = pairs.filter(
      (p) => diffItem(p.original, p.proposta).changed,
    ).length;
    const difference = totalConciliado - totalOriginal;
    return {
      totalOriginal,
      totalConciliado,
      difference,
      percentChange: totalOriginal ? (difference / totalOriginal) * 100 : 0,
      changedCount,
      unchangedCount: pairs.length - changedCount,
    };
  }, [conciliation, pairs]);

  const handleApprove = () => {
    if (!conciliationId) return;
    validateConciliation(
      {
        id: conciliationId,
        payload: {
          decisao: "APROVADO",
          descricaoValidacao: approveNote.trim() || "Conciliação aprovada",
        },
      },
      {
        onSuccess: () => {
          setApproveOpen(false);
          setApproveNote("");
          navigate(-1);
        },
      },
    );
  };

  const handleReject = () => {
    if (!conciliationId) return;
    validateConciliation(
      {
        id: conciliationId,
        payload: {
          decisao: "REJEITADO",
          descricaoValidacao: rejectReason.trim(),
        },
      },
      {
        onSuccess: () => {
          setRejectOpen(false);
          setRejectReason("");
          navigate(-1);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !conciliation) {
    return (
      <div className="max-w-11/12 mx-auto px-6 py-12 text-center space-y-2">
        <p className="text-sm font-medium">
          Não foi possível carregar a conciliação.
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  const isDecided = conciliation.status !== "PENDENTE";

  return (
    <div className="max-w-11/12 mx-auto px-6 py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Negociação de Divida</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Aprovação Conciliação</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Aprovação Conciliação de Divida</h1>
      <p className="text-muted-foreground">
        Aprovar ou Rejeitar uma conciliação de divida.
      </p>

      {/* ── Cabeçalho ── */}
      <Card className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr_1fr] gap-6 items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Estado
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium mt-1 ${STATUS_BADGE[conciliation.status]}`}
            >
              {STATUS_LABEL[conciliation.status]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {getInitials(conciliation?.estudante?.nome ?? "—")}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Aluno
              </p>
              <p className="text-sm font-semibold">
                {conciliation?.estudante?.nome ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Nº {conciliation?.estudante?.codigoMatricula ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Referência
              </p>
              <p className="text-sm font-semibold">
                {conciliation.facturaOriginal?.referencia}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Curso
              </p>
              <p className="text-sm font-semibold">
                {conciliation?.estudante?.curso ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {conciliation.descricaoCriacao && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Motivo da Conciliação
              </p>
              <p className="text-sm">{conciliation?.descricaoCriacao}</p>
            </div>
          </>
        )}

        {isDecided && conciliation.descricaoValidacao && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Nota da Validação
              </p>
              <p className="text-sm">{conciliation?.descricaoValidacao}</p>
            </div>
          </>
        )}
      </Card>

      {/* ── Comparação lado a lado ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-sm">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Factura Original
          </h3>
          <div className="space-y-3">
            {pairs.map(({ original }) => (
              <OriginalItemCard key={original?.codigo} item={original} />
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-sm">
            <Receipt className="h-4 w-4 text-primary" />
            Factura Conciliada
          </h3>
          <div className="space-y-3">
            {pairs.map(({ original, proposta }) => (
              <ConciliatedItemCard
                key={proposta.codigo}
                original={original}
                proposta={proposta}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ── Resumo comparativo ── */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-sm">Resumo Comparativo</h3>

        <div className="flex items-center justify-center gap-6 rounded-lg bg-muted/40 px-4 py-5">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Original</p>
            <p className="text-xl font-medium text-muted-foreground line-through decoration-border">
              {formatCurrencyAOA(summary.totalOriginal)}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="h-9 w-9 rounded-full bg-success/15 flex items-center justify-center">
              <ArrowRight className="h-[18px] w-[18px] text-success" />
            </div>
            <span className="text-[11px] font-medium text-success">
              {summary.percentChange > 0 ? "+" : ""}
              {summary.percentChange.toFixed(0)}%
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Total Conciliado
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrencyAOA(summary.totalConciliado)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-success/10 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown className="h-[15px] w-[15px] text-success" />
              <span className="text-xs text-success">Diferença</span>
            </div>
            <p className="text-lg font-medium text-success">
              {formatCurrencyAOA(summary.difference)}
            </p>
          </div>

          <div className="rounded-lg bg-warning/10 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Pencil className="h-[15px] w-[15px] text-warning" />
              <span className="text-xs text-warning">Itens Alterados</span>
            </div>
            <p className="text-lg font-medium text-warning">
              {summary.changedCount} de {pairs.length}
            </p>
          </div>

          <div className="rounded-lg bg-muted/60 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Check className="h-[15px] w-[15px] text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Sem Alteração
              </span>
            </div>
            <p className="text-lg font-medium">
              {summary.unchangedCount} de {pairs.length}
            </p>
          </div>
        </div>

        <div className="flex gap-[3px] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-warning"
            style={{ flex: summary.changedCount || 0.001 }}
          />
          <div
            className="bg-border"
            style={{ flex: summary.unchangedCount || 0.001 }}
          />
        </div>
      </Card>

      {/* ── Ações ── */}
      {!isDecided && (
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setRejectOpen(true)}
            disabled={isPending}
          >
            <XCircle className="h-4 w-4" />
            Rejeitar
          </Button>
          <Button
            className="gap-2"
            onClick={() => setApproveOpen(true)}
            disabled={isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
            Aprovar Conciliação
          </Button>
        </div>
      )}

      {/* ── Modal de aprovação ── */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Conciliação</DialogTitle>
            <DialogDescription>
              Podes adicionar uma nota sobre a aprovação (opcional).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="approve-note">Nota</Label>
            <Textarea
              id="approve-note"
              placeholder="Ex: Conciliação validada conforme acordo com o aluno…"
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal de rejeição ── */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Conciliação</DialogTitle>
            <DialogDescription>
              Indica o motivo da rejeição. Esta informação será enviada ao autor
              da negociação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Descreve o motivo da rejeição…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={rejectReason.trim().length === 0 || isPending}
              onClick={handleReject}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
