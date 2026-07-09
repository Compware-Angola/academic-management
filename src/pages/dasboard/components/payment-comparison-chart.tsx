"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatKz, formatKzCompact } from "../utils/payment-stats-format";
import { Wallet, CalendarRange, AlertCircle, RefreshCw } from "lucide-react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryPaymentPerformanceMonthly } from "@/hooks/statics";

type ErrorWithResponseMessage = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function PaymentComparisonChart() {
  const [activeYear, setActiveYear] = React.useState<string>("");
  const [compareYear, setCompareYear] = React.useState<string>("");
  const hasSelection = Boolean(activeYear) && Boolean(compareYear);
  const {
    data: monthlyPaymentComparison,
    isLoading: isLoadingMonthlyPaymentComparison,
    isError: isErrorMonthlyPaymentComparison,
    error: errorMonthlyPaymentComparison,
    refetch: refetchMonthlyPaymentComparison,
  } = useQueryPaymentPerformanceMonthly({
    currentYear: Number(activeYear),
    previousYear: Number(compareYear),
  });

  const errorMessage =
    (errorMonthlyPaymentComparison as ErrorWithResponseMessage)?.response?.data
      ?.message ??
    (errorMonthlyPaymentComparison as Error | undefined)?.message ??
    "Não foi possível carregar os dados de pagamentos. Tente novamente.";

  const labelAnoAtual =
    monthlyPaymentComparison?.totalAnual?.anoAtual.label ??
    monthlyPaymentComparison?.mensal[0]?.label_ano_atual ??
    "Ano atual";
  const labelAnoAnterior =
    monthlyPaymentComparison?.totalAnual?.anoAnterior.label ??
    monthlyPaymentComparison?.mensal[0]?.label_ano_anterior ??
    "Ano anterior";

  const chartConfig = React.useMemo(
    () => ({
      valor_ano_atual: {
        label: labelAnoAtual,
        color: "var(--chart-1)",
      },
      valor_ano_anterior: {
        label: labelAnoAnterior,
        color: "var(--chart-2)",
      },
    }),
    [labelAnoAtual, labelAnoAnterior],
  );

  const totalValorAtual =
    monthlyPaymentComparison?.totalAnual?.anoAtual.totalValor ?? 0;
  const totalValorAnterior =
    monthlyPaymentComparison?.totalAnual?.anoAnterior.totalValor ?? 0;
  const totalPagamentosAtual =
    monthlyPaymentComparison?.totalAnual?.anoAtual.totalPagamentos ?? 0;
  const totalPagamentosAnterior =
    monthlyPaymentComparison?.totalAnual?.anoAnterior.totalPagamentos ?? 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-primary/[0.03] h-48 to-transparent pb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Pagamentos por ano lectivo</h3>
          <div className="flex items-center gap-2">
            <AcademicYearSelect
              enableDefaultActiveYear
              value={activeYear}
              label="Ano Lectivo: Inicio"
              onChangeValue={(value) => setActiveYear(value)}
            />
            <AcademicYearSelect
              value={compareYear}
              enableDefaultActiveYear
              label="Ano Lectivo: Fim"
              onChangeValue={(value) => setCompareYear(value)}
            />
          </div>
        </div>

        {hasSelection && !isErrorMonthlyPaymentComparison && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 flex-wrap gap-6">
              {isLoadingMonthlyPaymentComparison ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <CardDescription>{labelAnoAtual}</CardDescription>
                    <CardTitle className="mt-1 font-mono text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
                      {formatKz(totalValorAtual)}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {totalPagamentosAtual.toLocaleString("pt-PT")} pagamentos
                    </span>
                  </div>

                  <div>
                    <CardDescription>{labelAnoAnterior}</CardDescription>
                    <CardTitle className="mt-1 font-mono text-xl font-semibold tabular-nums tracking-tight text-muted-foreground sm:text-2xl">
                      {formatKz(totalValorAnterior)}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {totalPagamentosAnterior.toLocaleString("pt-PT")} pagamentos
                    </span>
                  </div>
                </>
              )}
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wallet className="size-5" />
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!hasSelection ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarRange className="size-6" />
            </span>
            <div>
              <p className="font-medium">Selecione os anos lectivos</p>
              <p className="text-sm text-muted-foreground">
                Escolha os dois anos acima para ver o comparativo de pagamentos.
              </p>
            </div>
          </div>
        ) : isErrorMonthlyPaymentComparison ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </span>
            <div className="max-w-sm">
              <p className="font-medium text-destructive">
                Erro ao carregar os dados
              </p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => refetchMonthlyPaymentComparison()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </div>
        ) : isLoadingMonthlyPaymentComparison ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={monthlyPaymentComparison?.mensal ?? []}>
              <defs>
                <linearGradient id="fillAnoAtual" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-valor_ano_atual)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-valor_ano_atual)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillAnoAnterior"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-valor_ano_anterior)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-valor_ano_anterior)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="nome_mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatKzCompact}
                width={64}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => `Mês: ${value}`}
                    formatter={(value, name) => {
                      const isAnoAtual = name === "valor_ano_atual";
                      const label = isAnoAtual
                        ? labelAnoAtual
                        : labelAnoAnterior;
                      const color = isAnoAtual
                        ? "var(--color-valor_ano_atual)"
                        : "var(--color-valor_ano_anterior)";

                      return (
                        <div className="flex w-full flex-1 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                            <span className="text-foreground font-mono font-medium tabular-nums">
                              {formatKz(Number(value))}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Area
                dataKey="valor_ano_anterior"
                type="natural"
                fill="url(#fillAnoAnterior)"
                stroke="var(--color-valor_ano_anterior)"
                name="valor_ano_anterior"
              />
              <Area
                dataKey="valor_ano_atual"
                type="natural"
                fill="url(#fillAnoAtual)"
                stroke="var(--color-valor_ano_atual)"
                name="valor_ano_atual"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
