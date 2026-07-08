"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// ---------------------------------------------------------------------------
// MOCK — shape identico ao retorno da query (mes, nome_mes, label_ano_atual,
// valor_ano_atual, label_ano_anterior, valor_ano_anterior), ja ordenado
// Outubro -> Julho. Troca isto pelo resultado real da tua API/consulta.
// ---------------------------------------------------------------------------
const queryResultMock = [
    {
        "mes": 10,
        "nome_mes": "Outubro",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 145885246.68
    },
    {
        "mes": 11,
        "nome_mes": "Novembro",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 103976598.35
    },
    {
        "mes": 12,
        "nome_mes": "Dezembro",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 56318603.25
    },
    {
        "mes": 1,
        "nome_mes": "Janeiro",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 14731575.8
    },
    {
        "mes": 2,
        "nome_mes": "Fevereiro",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 71571662.35
    },
    {
        "mes": 3,
        "nome_mes": "Março",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 135937560.73
    },
    {
        "mes": 4,
        "nome_mes": "Abril",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 0,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 120160996.75
    },
    {
        "mes": 5,
        "nome_mes": "Maio",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 138455280.35,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 111367219.11
    },
    {
        "mes": 6,
        "nome_mes": "Junho",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 422684366.86,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 117267806.32
    },
    {
        "mes": 7,
        "nome_mes": "Julho",
        "label_ano_atual": "2025-2026",
        "valor_ano_atual": 44634222.67,
        "label_ano_anterior": "2024-2025",
        "valor_ano_anterior": 122497505.26
    }
]

// Labels reais dos anos vêm do próprio resultado (label_ano_atual / label_ano_anterior),
// já que são iguais em todas as linhas.
const labelAnoAtual = queryResultMock[0]?.label_ano_atual ?? "Ano atual"
const labelAnoAnterior = queryResultMock[0]?.label_ano_anterior ?? "Ano anterior"

const chartConfig = {
    valor_ano_atual: {
        label: labelAnoAtual,
        color: "var(--chart-1)",
    },
    valor_ano_anterior: {
        label: labelAnoAnterior,
        color: "var(--chart-2)",
    },
}

// Formatter compacto — usado no eixo Y (ex: "146 mi Kz")
// Nota: "currency" sozinho é ignorado pelo Intl.NumberFormat — é preciso
// declarar style: "currency" para ele entrar em vigor.
const kzCompactFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    //  currencyDisplay: "code",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
})

// Formatter completo — usado no tooltip (ex: "145.885.246,68 Kz")
const kzFullFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    //  currencyDisplay: "code",
    maximumFractionDigits: 2,
})

function formatKz(value) {
    return kzCompactFormatter.format(value)
}

function formatKzFull(value) {
    return kzFullFormatter.format(value)
}

export function PaymentComparisonChart() {
    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Pagamentos por ano lectivo</CardTitle>
                    <CardDescription>
                        Comparativo mensal — {labelAnoAtual} vs {labelAnoAnterior} (Out → Jul)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[300px] w-full"
                >
                    <AreaChart data={queryResultMock}>
                        <defs>
                            <linearGradient id="fillAnoAtual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-valor_ano_atual)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-valor_ano_atual)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillAnoAnterior" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-valor_ano_anterior)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-valor_ano_anterior)" stopOpacity={0.1} />
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
                            tickFormatter={formatKz}
                            width={64}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    // labelFormatter: formata o CABEÇALHO do tooltip (1x por tooltip).
                                    labelFormatter={(value) => `Mês: ${value}`}
                                    // formatter: quando customizado, substitui a linha INTEIRA da série
                                    // (perde-se o dot automático) — por isso recriamos o dot manualmente
                                    // para manter o mesmo layout do exemplo (cor + label + valor à direita).
                                    formatter={(value, name) => {
                                        const isAnoAtual = name === "valor_ano_atual"
                                        const label = isAnoAtual ? labelAnoAtual : labelAnoAnterior
                                        const color = isAnoAtual
                                            ? "var(--color-valor_ano_atual)"
                                            : "var(--color-valor_ano_anterior)"

                                        return (
                                            <div className="flex gap-1 w-full flex-1 items-center gap-2">
                                                <span
                                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <div className="flex gap-2 flex-1 items-center justify-between leading-none">
                                                    <span className="text-muted-foreground">{label}</span>
                                                    <span className="text-foreground font-mono font-medium tabular-nums">
                                                        {formatKzFull(Number(value))}
                                                    </span>
                                                </div>
                                            </div>
                                        )
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
            </CardContent>
        </Card>
    )
}