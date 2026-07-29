// src/pages/negotiation/NegotiationScreen.tsx
import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar1Icon,
  CheckCircle2,
  Circle,
  CoinsIcon,
  FileText,
  GraduationCap,
  HandCoins,
  Receipt,
  Sparkles,
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
  Negotiation,
  NegotiationType,
  NEGOTIATION_TYPE_LABEL,
  NegotiationItem,
  NegotiationSubmitPayload,
} from "./types/ConciliacaoDivida.types";

export const MOCK_NEGOTIATION: Negotiation = {
  id: 1,
  student: {
    id: 101,
    name: "Ana Beatriz Sultuane",
    number: "20231045",
  },
  course: {
    id: 1,
    name: "Licenciatura em Gestão",
  },
  type: NegotiationType.PARCIAL,
  items: [
    {
      id: 1,
      invoiceItemId: 501,
      description: "Propina — 1º Semestre",
      originalValue: 85000,
      negotiatedValue: 85000,
      discountValue: 1200,
      fineValue: 300,
      valueToPay: 75000,
    },
    {
      id: 2,
      invoiceItemId: 502,
      description: "Propina — 2º Semestre",
      originalValue: 85000,
      negotiatedValue: 68000,
      discountValue: 1200,
      fineValue: 300,
      valueToPay: 75000,
    },
    {
      id: 3,
      invoiceItemId: 503,
      description: "Taxa de Inscrição",
      originalValue: 15000,
      negotiatedValue: 15000,
      discountValue: 1200,
      fineValue: 300,
      valueToPay: 75000,
    },
  ],
};

type ItemLineState = "unchanged" | "reduced";

function getItemLineState(original: number, negotiated: number): ItemLineState {
  if (negotiated < 0 || negotiated > original) return "reduced";
  if (negotiated < original) return "reduced";
  return "unchanged";
}

const ITEM_STATE_CFG: Record<
  ItemLineState,
  { card: string; badge: string; label: string; icon: React.ReactNode }
> = {
  reduced: {
    card: "border-emerald-300 bg-emerald-50/60",
    badge: "text-emerald-700 border-emerald-300 bg-emerald-100",
    label: "Mensalidade",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  unchanged: {
    card: "border-border bg-background",
    badge: "text-muted-foreground border-border bg-muted/40",
    label: "Outros Serviços",
    icon: <Circle className="h-3 w-3" />,
  },
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

export function ConciliacaoDivida() {
  const negotiation = MOCK_NEGOTIATION;
  const [items, setItems] = useState<NegotiationItem[]>(negotiation.items);
  const [observation, setObservation] = useState("");
  const [itemErrors, setItemErrors] = useState<Map<number, string>>(new Map());

  const setItemValue = useCallback((itemId: number, raw: string) => {
    if (raw.trim() === "") return;

    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;

      const value = parseFloat(raw);

      if (isNaN(value) || value < 0) {
        setItemErrors((errs) =>
          new Map(errs).set(itemId, "O valor não pode ser negativo."),
        );
        return prev;
      }

      if (value > item.originalValue) {
        setItemErrors((errs) =>
          new Map(errs).set(
            itemId,
            "O valor negociado não pode ser superior ao valor original.",
          ),
        );
        return prev;
      }

      setItemErrors((errs) => {
        const next = new Map(errs);
        next.delete(itemId);
        return next;
      });

      return prev.map((i) =>
        i.id === itemId ? { ...i, negotiatedValue: value } : i,
      );
    });
  }, []);

  const totals = useMemo(() => {
    const original = items.reduce((sum, i) => sum + i.originalValue, 0);
    const negotiated = items.reduce((sum, i) => sum + i.negotiatedValue, 0);
    return { original, negotiated };
  }, [items]);

  const canSubmit =
    itemErrors.size === 0 && observation.trim().length > 0 && items.length > 0;

  const handleSubmit = () => {
    // onSubmit({
    //   studentId: negotiation.student.id,
    //   courseId: negotiation.course.id,
    //   type: negotiation.type,
    //   observation: observation.trim(),
    //   items: items.map((i) => ({
    //     invoiceItemId: i.invoiceItemId,
    //     negotiatedValue: i.negotiatedValue,
    //   })),
    // });
  };

  return (
    <div className="max-w-11/12 mx-auto px-6 py-6 space-y-6">
      {/* ── Cabeçalho da negociação ── */}
      <Card className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {getInitials(negotiation.student.name)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Aluno
              </p>
              <p className="text-sm font-semibold">
                {negotiation.student.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Nº {negotiation.student.number}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Curso
              </p>
              <p className="text-sm font-semibold">{negotiation.course.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HandCoins className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Tipo de Negociação
              </p>
              <p className="text-sm font-semibold">
                {NEGOTIATION_TYPE_LABEL[negotiation.type]}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CoinsIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Valor da Divida
              </p>
              <p className="text-sm font-semibold">120.0000kz</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar1Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Data da Negociação
              </p>
              <p className="text-sm font-semibold">12/12/2024</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <Card className="p-5">
          {/* ── Itens da factura ── */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-sm">
              <Receipt className="h-4 w-4 text-primary" />
              Itens da Factura
            </h3>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground text-center rounded-lg border border-dashed">
                <Receipt className="h-8 w-8 text-primary/30" />
                <p className="text-sm">
                  Nenhum item associado a esta negociação.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const state = getItemLineState(
                    item.originalValue,
                    item.negotiatedValue,
                  );
                  const cfg = ITEM_STATE_CFG[state];
                  const error = itemErrors.get(item.id);
                  const itemDiscount = item.discountValue;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-3 space-y-2 transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">
                          {item.description}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 ${cfg.badge}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs font-semibold mt-2">
                        <span>Total</span>
                        <span>{formatCurrencyAOA(item.valueToPay)}</span>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Valor Real (AOA)
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={item.originalValue}
                          step={0.01}
                          value={item.negotiatedValue}
                          onChange={(e) =>
                            setItemValue(item.id, e.target.value)
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
            )}

            <div className="space-y-2">
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
              disabled={!canSubmit || false}
              onClick={handleSubmit}
              className="w-full gap-2"
            >
              {false ? "A gravar…" : "Confirmar Negociação"}
            </Button>

            {!canSubmit && items.length > 0 && (
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
