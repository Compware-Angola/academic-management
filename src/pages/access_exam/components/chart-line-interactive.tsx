"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { InscricaoPorDia } from "@/services/access_exam/fecth-inscricoes-por-dia.service";

interface ChartLineInteractiveProps {
  data: InscricaoPorDia[] | undefined;
  isLoading: boolean;
  title?: string;
  description?: string;
  totalInscricoes?: number;
  totalPagos?: number;
}

const chartConfig = {
  subtotal: {
    label: "Inscrições",
    color: "var(--chart-1)",
  },
  pagos: {
    label: "Pagamentos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive({
  data,
  isLoading,
  title = "Estatísticas Diárias",
  description = "Evolução do número de inscrições por dia",
  totalInscricoes,
  totalPagos,
}: ChartLineInteractiveProps) {
  const chartData = React.useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const [day, month, year] = item.data.split("/");
        const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        return {
          originalDate: item.data,
          date: isoDate,
          subtotal: item.subtotal || 0,
          pagos: item.pagos || 0,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date)); // strings ISO já ordenam corretamente
  }, [data]);

  const totalInscricoesPage = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.subtotal, 0),
    [chartData],
  );

  const totalPagosPage = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.pagos, 0),
    [chartData],
  );

  const totalInscricoesExibir = totalInscricoes ?? totalInscricoesPage;
  const totalPagosExibir = totalPagos ?? totalPagosPage;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Total de Inscrições
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {totalInscricoesExibir.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Total de Pagamentos
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
            {totalPagosExibir.toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(`${value}T00:00:00Z`).toLocaleDateString("pt-PT", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-40"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />

            <Line
              dataKey="subtotal"
              type="monotone"
              stroke="var(--color-subtotal)"
              strokeWidth={3.5}
              dot={{ r: 4, fill: "var(--color-subtotal)" }}
              activeDot={{ r: 6 }}
              name="Inscrições"
            />

            <Line
              dataKey="pagos"
              type="monotone"
              stroke="var(--color-pagos)"
              strokeWidth={3.5}
              strokeDasharray="6 4"
              dot={{ r: 4, fill: "var(--color-pagos)" }}
              activeDot={{ r: 6 }}
              name="Pagamentos"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
