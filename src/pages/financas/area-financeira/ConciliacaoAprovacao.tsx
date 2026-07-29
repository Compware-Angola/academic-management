// src/pages/negotiation/ConciliacaoAprovacao.tsx
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Hash,
  Home,
  Link,
  Pencil,
  Receipt,
  TrendingDown,
  User,
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
  APPROVAL_STATUS_BADGE,
  APPROVAL_STATUS_LABEL,
  ApprovalStatus,
  ConciliationApproval,
  InvoiceLineItem,
} from "./types/ConciliacaoAprovacao.types";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export const MOCK_APPROVAL: ConciliationApproval = {
  id: 1,
  invoiceCode: "FT 2024/00842",
  status: ApprovalStatus.PENDENTE,
  student: {
    id: 101,
    name: "Ana Beatriz Sultuane",
    number: "20231045",
  },
  course: {
    id: 1,
    name: "Licenciatura em Gestão",
  },
  originalItems: [
    {
      id: 1,
      service: "Propina — 1º Semestre",
      quantity: 1,
      price: 85000,
      iva: 1200,
      total: 86200,
    },
    {
      id: 2,
      service: "Propina — 2º Semestre",
      quantity: 1,
      price: 85000,
      iva: 1200,
      total: 86200,
    },
    {
      id: 3,
      service: "Taxa de Inscrição",
      quantity: 1,
      price: 15000,
      iva: 0,
      total: 15000,
    },
  ],
  conciliatedItems: [
    {
      id: 1,
      service: "Propina — 1º Semestre",
      quantity: 1,
      price: 85000,
      iva: 1200,
      total: 86200,
    },
    {
      id: 2,
      service: "Propina — 2º Semestre",
      quantity: 1,
      price: 68000,
      iva: 1200,
      total: 69200,
    },
    {
      id: 3,
      service: "Taxa de Inscrição",
      quantity: 1,
      price: 15000,
      iva: 0,
      total: 15000,
    },
  ],
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
  ivaChanged: boolean;
  totalChanged: boolean;
  changed: boolean;
}

function diffItem(
  original: InvoiceLineItem,
  conciliated: InvoiceLineItem,
): ItemDiff {
  const priceChanged = original.price !== conciliated.price;
  const ivaChanged = original.iva !== conciliated.iva;
  const totalChanged = original.total !== conciliated.total;
  return {
    priceChanged,
    ivaChanged,
    totalChanged,
    changed: priceChanged || ivaChanged || totalChanged,
  };
}

function OriginalItemCard({ item }: { item: InvoiceLineItem }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-2">
      <p className="text-sm font-medium">{item.service}</p>
      <div className="grid grid-cols-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Quantidade</span>
        <span className="text-right font-medium">{item.quantity}</span>
        <span className="text-muted-foreground">Preço</span>
        <span className="text-right font-medium">
          {formatCurrencyAOA(item.price)}
        </span>
        <span className="text-muted-foreground">IVA</span>
        <span className="text-right font-medium">
          {formatCurrencyAOA(item.iva)}
        </span>
      </div>
      <Separator />
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Total</span>
        <span>{formatCurrencyAOA(item.total)}</span>
      </div>
    </div>
  );
}

function ConciliatedItemCard({
  original,
  conciliated,
}: {
  original: InvoiceLineItem;
  conciliated: InvoiceLineItem;
}) {
  const diff = diffItem(original, conciliated);

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 transition-colors ${
        diff.changed
          ? "border-warning/40 bg-warning/10"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{conciliated.service}</p>
        {diff.changed && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-medium text-warning shrink-0">
            Alterado
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Quantidade</span>
        <span className="text-right font-medium">{conciliated.quantity}</span>

        <span className="text-muted-foreground">Preço</span>
        <span
          className={`text-right font-medium ${diff.priceChanged ? "text-warning" : ""}`}
        >
          {formatCurrencyAOA(conciliated.price)}
        </span>

        <span className="text-muted-foreground">IVA</span>
        <span
          className={`text-right font-medium ${diff.ivaChanged ? "text-warning" : ""}`}
        >
          {formatCurrencyAOA(conciliated.iva)}
        </span>
      </div>

      {diff.priceChanged && (
        <div className="flex flex-col items-center gap-0.5 rounded-md bg-warning/10 px-2 py-1.5 text-[11px]">
          <span className="text-muted-foreground line-through">
            {formatCurrencyAOA(original.price)}
          </span>
          <ArrowDown className="h-3 w-3 text-warning" />
          <span className="font-semibold text-warning">
            {formatCurrencyAOA(conciliated.price)}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Total</span>
        <span className={diff.totalChanged ? "text-warning" : ""}>
          {formatCurrencyAOA(conciliated.total)}
        </span>
      </div>
    </div>
  );
}

export function ConciliacaoAprovacao() {
  const approval = MOCK_APPROVAL;
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const pairs = useMemo(
    () =>
      approval.originalItems.map((original) => {
        const conciliated = approval.conciliatedItems.find(
          (c) => c.id === original.id,
        );
        return { original, conciliated: conciliated ?? original };
      }),
    [approval],
  );

  const summary = useMemo(() => {
    const totalOriginal = approval.originalItems.reduce(
      (sum, i) => sum + i.total,
      0,
    );
    const totalConciliated = approval.conciliatedItems.reduce(
      (sum, i) => sum + i.total,
      0,
    );
    const changedCount = pairs.filter(
      (p) => diffItem(p.original, p.conciliated).changed,
    ).length;
    const difference = totalConciliated - totalOriginal;
    return {
      totalOriginal,
      totalConciliated,
      difference,
      percentChange: totalOriginal ? (difference / totalOriginal) * 100 : 0,
      changedCount,
      unchangedCount: pairs.length - changedCount,
    };
  }, [approval, pairs]);

  const handleApprove = () => {
    // onApprove({ conciliationId: approval.id });
  };

  const handleReject = () => {
    // onReject({ conciliationId: approval.id, reason: rejectReason.trim() });
    setRejectOpen(false);
    setRejectReason("");
  };

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
            <BreadcrumbPage>Conciliação de Prova</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* ── Cabeçalho ── */}

      <Card className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr_1fr] gap-6 items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Estado
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium mt-1 ${APPROVAL_STATUS_BADGE[approval.status]}`}
            >
              {APPROVAL_STATUS_LABEL[approval.status]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {getInitials(approval.student.name)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Aluno
              </p>
              <p className="text-sm font-semibold">{approval.student.name}</p>
              <p className="text-xs text-muted-foreground">
                Nº {approval.student.number}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Código da Factura
              </p>
              <p className="text-sm font-semibold">{approval.invoiceCode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Curso
              </p>
              <p className="text-sm font-semibold">{approval.course.name}</p>
            </div>
          </div>
        </div>
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
              <OriginalItemCard key={original.id} item={original} />
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-sm">
            <Receipt className="h-4 w-4 text-primary" />
            Factura Conciliada
          </h3>
          <div className="space-y-3">
            {pairs.map(({ original, conciliated }) => (
              <ConciliatedItemCard
                key={conciliated.id}
                original={original}
                conciliated={conciliated}
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
              {formatCurrencyAOA(summary.totalConciliated)}
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
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setRejectOpen(true)}
        >
          <XCircle className="h-4 w-4" />
          Rejeitar
        </Button>
        <Button className="gap-2" onClick={handleApprove}>
          <CheckCircle2 className="h-4 w-4" />
          Aprovar Conciliação
        </Button>
      </div>

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
              disabled={rejectReason.trim().length === 0}
              onClick={handleReject}
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
