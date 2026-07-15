"use client"

import * as React from "react"
import { Wallet, AlertTriangle, Landmark } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"


import { formatKz } from "../utils/payment-stats-format"
import { PaymentSummaryResponse } from "@/services/statics/statitis.service"

interface PaymentSummaryStatsCardProps {
    title: string
    description: React.ReactNode
    headerControls?: React.ReactNode
    data: PaymentSummaryResponse | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
}

export function PaymentSummaryStatsCard({
    title,
    description,
    headerControls,
    data,
    isLoading,
    isError,
    error,
}: PaymentSummaryStatsCardProps) {
    const items = data?.data ?? []

    const totalGeral = items.reduce((acc, item) => acc + item.totalPago, 0)
    const totalPagamentosGeral = items.reduce(
        (acc, item) => acc + item.totalPagamentos,
        0
    )

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="flex items-center gap-2">{headerControls}</div>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription>{description}</CardDescription>
                        {isLoading ? (
                            <Skeleton className="mt-2 h-7 w-40" />
                        ) : (
                            <CardTitle className="mt-1.5 font-mono text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
                                {formatKz(totalGeral)}
                            </CardTitle>
                        )}
                        {!isLoading && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {totalPagamentosGeral} pagamento
                                {totalPagamentosGeral === 1 ? "" : "s"} no período
                            </p>
                        )}
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Wallet className="size-5" />
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isError ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </span>
                        <p className="text-sm font-medium text-destructive">
                            Não foi possível carregar os dados
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {error instanceof Error
                                ? error.message
                                : "Tente novamente mais tarde."}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="divide-y">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-4 px-6 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-8 shrink-0 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Landmark className="size-5" />
                        </span>
                        <p className="text-sm font-medium text-muted-foreground">
                            Nenhum pagamento encontrado
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {items.map((item) => {
                            const percentual =
                                totalGeral > 0
                                    ? (item.totalPago / totalGeral) * 100
                                    : 0

                            return (
                                <div
                                    key={item.codigoFormaPagamento}
                                    className="flex items-center justify-between gap-4 px-6 py-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                "flex size-8 shrink-0 items-center justify-center rounded-full",
                                                "bg-primary/10 text-primary"
                                            )}
                                        >
                                            <Landmark className="size-4" />
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {item.tipoPagamento}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.totalPagamentos} pagamento
                                                {item.totalPagamentos === 1 ? "" : "s"} ·{" "}
                                                {percentual.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-semibold tabular-nums">
                                        {formatKz(item.totalPago)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}