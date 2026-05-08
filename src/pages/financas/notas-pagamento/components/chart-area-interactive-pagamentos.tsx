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

interface ChartAreaInteractivePagamentosProps {
  data: any[] | undefined;
  isLoading: boolean;
  chartConfig: ChartConfig;
  title?: string;
  description?: string;
}

export function ChartAreaInteractivePagamentos({
  data,
  isLoading,
  chartConfig,
  title = "Estatísticas de Pagamentos",
  description = "Pagamentos por data",
}: ChartAreaInteractivePagamentosProps) {

  const dataKeys = Object.keys(chartConfig)

  const gradientId = (key: string) => `fill_${key}`

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full rounded-lg" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                {dataKeys.map((key) => (
                  <linearGradient key={key} id={gradientId(key)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
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
              {dataKeys.map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#${gradientId(key)})`}
                  stroke={`var(--color-${key})`}
                  stackId="a"
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}