"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { PieChart, Pie, Cell, Label } from "recharts"

import {
    Wallet,
    type LucideIcon,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCount, formatKz } from "../utils/payment-stats-format"
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect"
import { MonthYearPicker } from "./month-year-picker"
import { useQueryPaymentComparison } from "@/hooks/statics"
import { parseFilter } from "@/util/parse-filter"

interface PaymentServiceComparisonWidgetProps {
    title?: string
    description?: string
}

interface RawServiceItem {
    label: string
    totalPayments: number
    totalAmount: number
}

interface ServiceItem extends RawServiceItem {
    displayName: string
    icon: LucideIcon
    color: string
}


const SERVICE_APPEARANCE: Record<string, { displayName: string; icon: LucideIcon; color: string }> = {
    PROP: { displayName: "Mensalidades", icon: Wallet, color: "var(--chart-1)" },
    OUTROS: { displayName: "Outros Serviços", icon: Wallet, color: "var(--chart-2)" },
    TAXA: { displayName: "Taxas", icon: Wallet, color: "var(--chart-3)" },
    DOCUMENTO: { displayName: "Documentos", icon: Wallet, color: "var(--chart-4)" },
}

const FALLBACK_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

function getAppearance(label: string, index: number) {
    return (
        SERVICE_APPEARANCE[label] ?? {
            displayName: label,
            icon: Wallet,
            color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        }
    )
}

interface ServiceDistributionChartProps {
    items: ServiceItem[]
    totalPayments: number
}

function ServiceDistributionChart({ items, totalPayments }: ServiceDistributionChartProps) {
    const chartConfig = Object.fromEntries(
        items.map((item) => [item.label, { label: item.displayName, color: item.color }])
    )

    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[280px]">
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => (
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full"
                                            style={{ backgroundColor: item.payload.color }}
                                        />
                                        <span className="text-muted-foreground">{name}</span>
                                    </div>
                                    <span className="font-mono font-medium tabular-nums text-foreground">
                                        {formatKz(value as number)}
                                    </span>
                                </div>
                            )}
                        />
                    }
                />
                <Pie
                    data={items}
                    dataKey="totalAmount"
                    nameKey="displayName"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                >
                    {items.map((item) => (
                        <Cell key={item.label} fill={item.color} />
                    ))}

                    <Label
                        content={({ viewBox }) => {
                            if (!viewBox || !("cx" in viewBox)) return null

                            return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                    <tspan
                                        x={viewBox.cx}
                                        dy="-0.3em"
                                        className="fill-foreground text-xl font-bold"
                                    >
                                        {formatCount(totalPayments)}
                                    </tspan>
                                    <tspan
                                        x={viewBox.cx}
                                        dy="1.5em"
                                        className="fill-muted-foreground text-xs"
                                    >
                                        pagamentos
                                    </tspan>
                                </text>
                            )
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}


interface ServiceBreakdownListProps {
    items: ServiceItem[]
    total: number
}

function ServiceBreakdownList({ items, total }: ServiceBreakdownListProps) {
    return (
        <div className="space-y-4 p-4">
            {items.map((item) => {
                const percent = total > 0 ? (item.totalAmount / total) * 100 : 0
                const Icon = item.icon
                return (
                    <div key={item.label} className="rounded-xl border p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className="rounded-lg p-2"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                                    }}
                                >
                                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <p className="font-medium">{item.displayName}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCount(item.totalPayments)} pagamentos
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">{formatKz(item.totalAmount)}</p>
                                <p className="text-sm text-muted-foreground">{percent.toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${percent}%`, backgroundColor: item.color }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function PaymentServiceComparison({
    title = "Receita por Serviço",
    description = "Distribuição da arrecadação no período selecionado",
}: PaymentServiceComparisonWidgetProps) {
    const [formaPagamento, setFormaPagamento] = React.useState("")
    const [date, setDate] = React.useState<Date>(new Date())

    const { data: comparison, isLoading: isLoadingComparison } = useQueryPaymentComparison({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        formaPagamento: parseFilter(formaPagamento),
    })

    const items: ServiceItem[] = React.useMemo(
        () =>
            (comparison ?? []).map((item: RawServiceItem, index: number) => ({
                ...item,
                ...getAppearance(item.label, index),
            })),
        [comparison]
    )

    const total = items.reduce((sum, item) => sum + item.totalAmount, 0)
    const totalPayments = items.reduce((sum, item) => sum + item.totalPayments, 0)
    const hasData = !isLoadingComparison && items.length > 0

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent pb-6 h-48">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="flex items-center gap-2">
                        <FormaPagamentoSelect
                            allOption
                            value={formaPagamento}
                            onChangeValue={setFormaPagamento}
                            allowAll
                        />
                        <MonthYearPicker date={date} onChange={setDate} />
                    </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription>{description}</CardDescription>
                        {isLoadingComparison ? (
                            <Skeleton className="mt-2 h-7 w-40" />
                        ) : (
                            <CardTitle className="mt-1.5 font-mono text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
                                {formatKz(total)}
                            </CardTitle>
                        )}
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Wallet className="size-5" />
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isLoadingComparison ? (
                    <div className="grid gap-6 md:grid-cols-2 items-center p-4">
                        <Skeleton className="mx-auto h-[280px] w-[280px] rounded-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full rounded-xl" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                    </div>
                ) : !hasData ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Sem dados para o período selecionado
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-[1fr_1.5fr] items-center">
                        <ServiceDistributionChart items={items} totalPayments={totalPayments} />
                        <ServiceBreakdownList items={items} total={total} />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}