"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { EstudanteMatriculadoEstatistica } from "@/services/registrations/fetch-estatistica-estudantes-matriculados.service";

const chartConfig = {
  total: {
    label: "Estudantes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartEstudantesMatriculadosProps {
  data: EstudanteMatriculadoEstatistica[] | undefined;
  isLoading: boolean;
}

export function ChartEstudantesMatriculados({
  data,
  isLoading,
}: ChartEstudantesMatriculadosProps) {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const totalEstudantes = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.total, 0),
    [chartData],
  );

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Estudantes Matriculados por Ano Curricular</CardTitle>
          <CardDescription>
            Distribuição de estudantes matriculados por ano curricular
          </CardDescription>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Total de Estudantes
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {totalEstudantes.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Nenhum dado disponível para os filtros selecionados.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="anoCurricular"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
