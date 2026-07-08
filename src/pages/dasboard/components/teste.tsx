"use client"

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

import { Wallet, Receipt, GraduationCap, type LucideIcon } from "lucide-react"

export interface PaymentServiceItem {
    label: string
    name: string
    totalPayments: number
    totalAmount: number
    color: string
    icon: LucideIcon
}

interface PaymentServiceComparisonWidgetProps {
    data?: PaymentServiceItem[]
    title?: string
    description?: string
}

const defaultData: PaymentServiceItem[] = [
    {
        label: "PROP",
        name: "Propinas",
        totalPayments: 325,
        totalAmount: 4_200_000,
        color: "var(--chart-1)",
        icon: GraduationCap,
    },
    {
        label: "OUTROS",
        name: "Outros Serviços",
        totalPayments: 187,
        totalAmount: 2_350_000,
        color: "var(--chart-2)",
        icon: Receipt,
    },
]

const currencyFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("pt-AO")

function formatMoney(value: number) {
    return currencyFormatter.format(value)
}

export function PaymentServiceComparisonWidget({
    data = defaultData,
    title = "Receita por Serviço",
    description = "Distribuição da arrecadação no período selecionado",
}: PaymentServiceComparisonWidgetProps) {
    const total = data.reduce((sum, item) => sum + item.totalAmount, 0)
    const totalPayments = data.reduce((sum, item) => sum + item.totalPayments, 0)

    const chartConfig = Object.fromEntries(
        data.map((item) => [item.label, { label: item.name }])
    )

    if (data.length === 0 || total === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Ainda não há receita registada neste período.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>

                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold">{formatMoney(total)}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 items-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[280px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />

                            <Pie
                                data={data}
                                dataKey="totalAmount"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={4}
                            >
                                {data.map((item) => (
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
                                                    {numberFormatter.format(totalPayments)}
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

                    <div className="space-y-4">
                        {data.map((item) => {
                            const percent = (item.totalAmount / total) * 100
                            const Icon = item.icon

                            return (
                                <div key={item.label} className="rounded-xl border p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="rounded-lg p-2"
                                                style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                                            >
                                                <Icon className="h-5 w-5" style={{ color: item.color }} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <p className="font-medium">{item.name}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {numberFormatter.format(item.totalPayments)} pagamentos
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold">{formatMoney(item.totalAmount)}</p>
                                            <p className="text-sm text-muted-foreground">{percent.toFixed(1)}%</p>
                                        </div>
                                    </div>

                                    {/* barra de progresso relativa ao total, reforça a % visualmente */}
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
                </div>
            </CardContent>
        </Card>
    )
}