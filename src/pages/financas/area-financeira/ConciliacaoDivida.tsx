// src/pages/negotiation/NegotiationScreen.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  Calendar1Icon,
  CoinsIcon,
  FileText,
  HandCoins,
  Home,
  Layers,
  Loader2,
  Lock,
  PencilLine,
  Percent,
  Receipt,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useDebtNegotiationDetailsConciliation } from "@/hooks/financas/dividas/use-debt-negotiation-conciliation";
import { toast } from "sonner";
import { useCreateConciliacaoDivida } from "@/hooks/financas/dividas/use-create-conciliacao-divida";
import {
  ConciliacaoResultModal,
  type ConciliacaoDividaErrorResponse,
  type ConciliacaoDividaResultItem,
} from "./components/ConciliacaoResultModal";

const NEGOTIATION_TYPE_LABEL: Record<number, string> = {
  1: "Total",
  2: "Parcial",
};

function itemKey(facturaCodigo: number, itemCodigo: number) {
  return `${facturaCodigo}:${itemCodigo}`;
}
function getItemKeys(key: string) {
  const keys = key.split(":");
  return {
    facturaCodigo: Number(keys[0]),
    itemCodigo: Number(keys[1]),
  };
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

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-AO");
}

// ALTERADO: bloco de aviso seguindo o modelo do EnrollmentStandardTimeframe,
// exibido quando a negociação já possui uma conciliação pendente.
function NegociacaoComConciliacaoPendente() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-800">
      <Lock className="h-4 w-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">
          Esta negociação já possui uma conciliação pendente.
        </p>
        <p className="text-xs text-amber-700/80 mt-0.5">
          Aguarda validação da conciliação existente antes de submeter uma nova.
        </p>
      </div>
    </div>
  );
}

export function ConciliacaoDivida() {
  const { id } = useParams<{ id: string }>();
  const negotiationId = id ? Number(id) : undefined;

  const {
    data: negotiation,
    isLoading,
    isError,
  } = useDebtNegotiationDetailsConciliation(negotiationId);
  const {
    mutate: createConciliacaoDivivda,
    isPending: isPendingConciliacaoDivida,
  } = useCreateConciliacaoDivida();

  const [negotiatedValues, setNegotiatedValues] = useState<Map<string, number>>(
    new Map(),
  );
  const [itemErrors, setItemErrors] = useState<Map<string, string>>(new Map());
  const [observation, setObservation] = useState("");

  // ALTERADO: estado do modal de resultado da conciliação
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [conciliacaoResult, setConciliacaoResult] = useState<
    ConciliacaoDividaResultItem[] | null
  >(null);
  const [conciliacaoError, setConciliacaoError] =
    useState<ConciliacaoDividaErrorResponse | null>(null);

  const jaPossuiConciliacaoPendente = negotiation?.isReconciliado ?? false;

  useEffect(() => {
    if (!negotiation) return;
    const initial = new Map<string, number>();
    negotiation.facturas.forEach((factura) => {
      factura.itens.forEach((item) => {
        initial.set(itemKey(factura.codigo, item.codigo), item.valor_total);
      });
    });
    setNegotiatedValues(initial);
    setItemErrors(new Map());
  }, [negotiation]);

  const setItemValue = (
    facturaCodigo: number,
    itemCodigo: number,
    originalValue: number,
    raw: string,
  ) => {
    if (raw.trim() === "") return;
    const key = itemKey(facturaCodigo, itemCodigo);
    const value = parseFloat(raw);

    if (isNaN(value) || value < 0) {
      setItemErrors((errs) =>
        new Map(errs).set(key, "O valor não pode ser negativo."),
      );
      return;
    }

    if (value > originalValue) {
      setItemErrors((errs) =>
        new Map(errs).set(
          key,
          "O valor negociado não pode ser superior ao valor original.",
        ),
      );
      return;
    }

    setItemErrors((errs) => {
      const next = new Map(errs);
      next.delete(key);
      return next;
    });

    setNegotiatedValues((prev) => new Map(prev).set(key, value));
  };

  const allItems = useMemo(
    () =>
      negotiation?.facturas.flatMap((factura) =>
        factura.itens.map((item) => ({ factura, item })),
      ) ?? [],
    [negotiation],
  );

  const totals = useMemo(() => {
    const original = allItems.reduce(
      (sum, { item }) => sum + item.valor_total,
      0,
    );
    const negotiated = allItems.reduce((sum, { factura, item }) => {
      const key = itemKey(factura.codigo, item.codigo);
      return sum + (negotiatedValues.get(key) ?? item.valor_total);
    }, 0);
    const discount = original - negotiated;
    const discountPct = original > 0 ? (discount / original) * 100 : 0;
    const negotiatedPct = original > 0 ? (negotiated / original) * 100 : 100;
    return { original, negotiated, discount, discountPct, negotiatedPct };
  }, [allItems, negotiatedValues]);

  const changedItemsCount = useMemo(
    () =>
      allItems.reduce((count, { factura, item }) => {
        const key = itemKey(factura.codigo, item.codigo);
        const value = negotiatedValues.get(key) ?? item.valor_total;
        return value !== item.valor_total ? count + 1 : count;
      }, 0),
    [allItems, negotiatedValues],
  );

  const canSubmit =
    !jaPossuiConciliacaoPendente &&
    itemErrors.size === 0 &&
    observation.trim().length > 0 &&
    allItems.length > 0;

  const handleSubmit = () => {
    if (!negotiation) return;
    const payload = {
      codigoNegociacaoDivida: Number(id),
      descricao: observation.trim(),
      invoices: negotiation.facturas
        .map((factura) => ({
          invoiceId: factura.codigo,
          itens: factura.itens
            .filter((item) => {
              const key = itemKey(factura.codigo, item.codigo);
              return negotiatedValues.get(key) !== item.valor_total;
            })
            .map((item) => ({
              InvoiceItemId: item.codigo,
              valor: negotiatedValues.get(itemKey(factura.codigo, item.codigo)),
            })),
        }))
        .filter((factura) => factura.itens.length > 0),
    };
    if (payload.invoices.length == 0) {
      toast.error("Deves pelo menos mudar o valor de um item");
      return;
    }
    // ALTERADO: ao concluir a mutação, guarda o resultado (sucesso ou erro)
    // e abre o modal com os detalhes retornados pela rota.
    createConciliacaoDivivda(payload, {
      onSuccess: (data: ConciliacaoDividaResultItem[]) => {
        setConciliacaoResult(data);
        setConciliacaoError(null);
        setResultModalOpen(true);
      },
      onError: (error: any) => {
        const apiError = error?.data as
          | ConciliacaoDividaErrorResponse
          | undefined;
        setConciliacaoResult(null);

        setConciliacaoError(
          apiError ?? {
            message: "Não foi possível concluir a conciliação de dívida.",
            errors: apiError?.errors ?? [],
          },
        );
        setResultModalOpen(true);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-11/12 mx-auto px-6 py-16">
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground border-dashed">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">A carregar negociação…</p>
        </Card>
      </div>
    );
  }

  if (isError || !negotiation) {
    return (
      <div className="max-w-11/12 mx-auto px-6 py-16">
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-medium">
            Não foi possível carregar os dados desta negociação.
          </p>
          <p className="text-xs text-muted-foreground">
            Verifica se o ID informado é válido.
          </p>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbPage>Negociação de Dívida</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Conciliação de Dívida</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Conciliação de Dívida</h1>
          <p className="text-muted-foreground">
            Fazer a conciliação de dívida da negociação #{negotiation.id}.
          </p>
        </div>
        {/* ALTERADO: badge de estado no topo, dá contexto imediato sem ter de ler o preview */}
        {changedItemsCount > 0 && (
          <Badge className="gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 px-3 py-1">
            <PencilLine className="h-3.5 w-3.5" />
            {changedItemsCount}{" "}
            {changedItemsCount === 1 ? "item alterado" : "itens alterados"}
          </Badge>
        )}
      </div>

      {/* ── Cabeçalho da negociação ── */}
      {/* ALTERADO: fundo em gradiente subtil + borda para destacar do resto da página */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-card to-card border-primary/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            {/* ALTERADO: avatar com anel e sombra suave */}
            <div className="h-11 w-11 rounded-full bg-primary/10 ring-2 ring-primary/15 flex items-center justify-center text-sm font-semibold text-primary shrink-0 shadow-sm">
              {getInitials(negotiation.nome)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Aluno
              </p>
              <p className="text-sm font-semibold">{negotiation.nome}</p>
              <p className="text-xs text-muted-foreground">
                Matrícula {negotiation.codigo_matricula}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Curso
              </p>
              <p className="text-sm font-semibold">{negotiation.curso}</p>
              <p className="text-xs text-muted-foreground">
                {negotiation.faculdade}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HandCoins className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Tipo de Negociação
              </p>
              <p className="text-sm font-semibold">
                {NEGOTIATION_TYPE_LABEL[negotiation.tipo_negociacao_id] ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CoinsIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Valor da Dívida
              </p>
              <p className="text-sm font-semibold">
                {formatCurrencyAOA(negotiation.valor_divida)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar1Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Data da Negociação
              </p>
              <p className="text-sm font-semibold">
                {formatDate(negotiation.data_criacao)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Prestações
              </p>
              <p className="text-sm font-semibold">
                {negotiation.prestacoes}x de{" "}
                {formatCurrencyAOA(negotiation.valor_prestacao)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ALTERADO: aviso quando a negociação já tem uma conciliação pendente */}
      {jaPossuiConciliacaoPendente && <NegociacaoComConciliacaoPendente />}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <Card className="p-5">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-sm">
              <Receipt className="h-4 w-4 text-primary" />
              Itens da Factura
            </h3>

            {allItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground text-center rounded-lg border border-dashed">
                <Receipt className="h-8 w-8 text-primary/30" />
                <p className="text-sm">
                  Nenhum item associado a esta negociação.
                </p>
              </div>
            ) : (
              negotiation.facturas.map((factura) => (
                <div key={factura.codigo} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {factura.descricao} · Ref. {factura.referencia}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground border-border bg-muted/40 text-[10px]"
                    >
                      Vence {formatDate(factura.data_vencimento)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {factura.itens.map((item) => {
                      const key = itemKey(factura.codigo, item.codigo);
                      const error = itemErrors.get(key);
                      const value =
                        negotiatedValues.get(key) ?? item.valor_total;
                      const isChanged = value !== item.valor_total;
                      const itemDiscount = item.valor_total - value;

                      return (
                        <div
                          key={key}
                          className={`rounded-lg border p-3 space-y-2 transition-colors ${
                            isChanged
                              ? "border-amber-300 bg-amber-50/60"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">
                              {item.descricao}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.mes_designacao && (
                                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground border-border bg-muted/40">
                                  {item.mes_designacao}
                                </span>
                              )}
                              {/* ALTERADO: badge "Alterado" por item, com o valor do desconto */}
                              {isChanged && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-medium">
                                  <TrendingDown className="h-3 w-3" />-
                                  {formatCurrencyAOA(itemDiscount)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {item.quantidade}x{" "}
                              {formatCurrencyAOA(item.preco_unitario)}
                            </span>
                            <span
                              className={`font-semibold ${
                                isChanged
                                  ? "text-muted-foreground line-through decoration-1"
                                  : "text-foreground"
                              }`}
                            >
                              {formatCurrencyAOA(item.valor_total)}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Valor Negociado (AOA)
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              max={item.valor_total}
                              step={0.01}
                              value={value}
                              onChange={(e) =>
                                setItemValue(
                                  factura.codigo,
                                  item.codigo,
                                  item.valor_total,
                                  e.target.value,
                                )
                              }
                              // ALTERADO: input destaca-se visualmente quando o valor foi editado
                              className={`h-8 text-sm bg-background ${
                                isChanged
                                  ? "border-amber-400 focus-visible:ring-amber-400/40"
                                  : ""
                              }`}
                            />
                            {error && (
                              <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {error}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="negotiation-observation">
                Observações <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="negotiation-observation"
                placeholder="Descreva o motivo da negociação…"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </Card>

        {/* ── Preview ── */}
        <div className="space-y-3">
          {/* ALTERADO: card do preview reformulado com barra de progresso e desconto total */}
          <Card className="p-5 space-y-4 sticky top-4 border-primary/15 shadow-sm">
            <h3 className="font-semibold text-sm">Resumo</h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Valor Original</span>
              <span className="font-medium">
                {formatCurrencyAOA(totals.original)}
              </span>
            </div>

            {/* ALTERADO: barra de progresso do valor negociado sobre o original */}
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, totals.negotiatedPct))}%`,
                  }}
                />
              </div>
              {totals.discount > 0 && (
                <div className="flex items-center justify-between text-xs text-amber-700">
                  <span className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Diferença de <a href="mailto:"></a>
                  </span>
                  <span className="font-medium">
                    -{formatCurrencyAOA(totals.discount)} (
                    {totals.discountPct.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Valor Final Negociado
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrencyAOA(totals.negotiated)}
                </span>
              </div>
            </div>

            <Button
              disabled={!canSubmit || isPendingConciliacaoDivida}
              onClick={handleSubmit}
              className="w-full gap-2"
            >
              {isPendingConciliacaoDivida && (
                <Loader2 className="animate-spin" />
              )}
              Confirmar Negociação
            </Button>

            {!canSubmit && allItems.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                {jaPossuiConciliacaoPendente
                  ? "Já existe uma conciliação pendente para esta negociação."
                  : itemErrors.size > 0
                    ? "Corrige os valores assinalados a vermelho."
                    : "Preenche as observações para confirmar."}
              </p>
            )}
          </Card>
        </div>
      </div>

      <ConciliacaoResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        result={conciliacaoResult}
        error={conciliacaoError}
      />
    </div>
  );
}
