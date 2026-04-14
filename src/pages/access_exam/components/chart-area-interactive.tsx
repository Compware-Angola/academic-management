"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartLegend, ChartLegendContent,
  ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { InscricaoPorData } from "@/services/access_exam/fetch-estatistica-inscricoes-candidatos.service"


const chartConfig = {
  qt_diurno: {
    label: "Laboral",
    color: "var(--chart-1)",
  },
  qt_noturno: {
    label: "Pós-Laboral",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data: InscricaoPorData[] | undefined;
  isLoading: boolean;
}

export function ChartAreaInteractive({ data, isLoading }: ChartAreaInteractiveProps) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Inscrições por Data</CardTitle>
          <CardDescription>Laboral vs Pós-Laboral</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillLaboral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-qt_diurno)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-qt_diurno)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPosLaboral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-qt_noturno)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-qt_noturno)" stopOpacity={0.1} />
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
  )
}