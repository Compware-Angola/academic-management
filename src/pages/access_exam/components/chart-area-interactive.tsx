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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { InscricaoPorData } from "@/services/access_exam/fetch-estatistica-inscricoes-candidatos.service";

const chartConfig = {
  qt_diurno: {
    label: "Laboral",
    color: "var(--chart-1)",
  },
  qt_noturno: {
    label: "Pós-Laboral",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: InscricaoPorData[] | undefined;
  isLoading: boolean;
}

export function ChartAreaInteractive({
  data,
  isLoading,
}: ChartAreaInteractiveProps) {
  const chartData = React.useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const [day, month, year] = item.data.split("/");
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

        return {
          originalDate: item.data,
          date: dateObj.toISOString().split("T")[0],
          subtotal: item.total_dia || 0,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const totalInscricoes = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.subtotal, 0),
    [chartData],
  );

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Inscrições por Data</CardTitle>
          <CardDescription>Laboral vs Pós-Laboral</CardDescription>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Total de Inscrições
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {totalInscricoes.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillLaboral" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-qt_diurno)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-qt_diurno)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPosLaboral" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-qt_noturno)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-qt_noturno)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="data"
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
                dataKey="qt_noturno"
                type="natural"
                fill="url(#fillPosLaboral)"
                stroke="var(--color-qt_noturno)"
                stackId="a"
              />
              <Area
                dataKey="qt_diurno"
                type="natural"
                fill="url(#fillLaboral)"
                stroke="var(--color-qt_diurno)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
