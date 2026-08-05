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
  Receipt,
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

const NEGOTIATION_TYPE_LABEL: Record<number, string> = {
  1: "Total",
  2: "Parcial",
};

// chave única para um item, já que o `codigo` do item pode repetir-se entre facturas
function itemKey(facturaCodigo: number, itemCodigo: number) {
  return `${facturaCodigo}:${itemCodigo}`;
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

export function ConciliacaoDivida() {
  const { id } = useParams<{ id: string }>();
  const negotiationId = id ? Number(id) : undefined;

  const {
    data: negotiation,
    isLoading,
    isError,
  } = useDebtNegotiationDetailsConciliation(negotiationId);

  const [negotiatedValues, setNegotiatedValues] = useState<Map<string, number>>(
    new Map(),
  );
  const [itemErrors, setItemErrors] = useState<Map<string, string>>(new Map());
  const [observation, setObservation] = useState("");

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
    return { original, negotiated };
  }, [allItems, negotiatedValues]);

  const canSubmit =
    itemErrors.size === 0 &&
    observation.trim().length > 0 &&
    allItems.length > 0;

  const handleSubmit = () => {
    if (!negotiation) return;
    // onSubmit({
    //   id: negotiation.id,
    //   observation: observation.trim(),
    //   itens: allItems.map(({ factura, item }) => ({
    //     facturaCodigo: factura.codigo,
    //     itemCodigo: item.codigo,
    //     valorNegociado:
    //       negotiatedValues.get(itemKey(factura.codigo, item.codigo)) ??
    //       item.valor_total,
    //   })),
    // });
  };

  if (isLoading) {
    return (
      <div className="max-w-11/12 mx-auto px-6 py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">A carregar negociação…</p>
      </div>
    );
  }

  if (isError || !negotiation) {
    return (
      <div className="max-w-11/12 mx-auto px-6 py-16 flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium">
          Não foi possível carregar os dados desta negociação.
        </p>
        <p className="text-xs text-muted-foreground">
          Verifica se o ID informado é válido.
        </p>
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

      <div>
        <h1 className="text-2xl font-bold">Conciliação de Dívida</h1>
        <p className="text-muted-foreground">
          Fazer a conciliação de dívida da negociação #{negotiation.id}.
        </p>
      </div>

      {/* ── Cabeçalho da negociação ── */}
      <Card className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
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

                      return (
                        <div
                          key={key}
                          className="rounded-lg border p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">
                              {item.descricao}
                            </p>
                            {item.mes_designacao && (
                              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 text-muted-foreground border-border bg-muted/40 shrink-0">
                                {item.mes_designacao}
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {item.quantidade}x{" "}
                              {formatCurrencyAOA(item.preco_unitario)}
                            </span>
                            <span className="font-semibold text-foreground">
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
                              className="h-8 text-sm bg-background"
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
          <Card className="p-4 space-y-3 sticky top-4">
            <h3 className="font-semibold text-sm">Preview</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Valor Original</span>
              <span className="font-medium">
                {formatCurrencyAOA(totals.original)}
              </span>
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
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full gap-2"
            >
              Confirmar Negociação
            </Button>

            {!canSubmit && allItems.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Preenche as observações para confirmar.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
