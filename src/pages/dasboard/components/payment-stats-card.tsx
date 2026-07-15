"use client"

import * as React from "react"
import { Wallet, AlertTriangle } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { PaymentStatsData, paymentStatsRows } from "../utils/payment-stats-rows"
import { formatKz } from "../utils/payment-stats-format"


interface PaymentStatsCardProps {
    title: string
    description: React.ReactNode
    headerControls?: React.ReactNode
    data: PaymentStatsData | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
}

export function PaymentStatsCard({
    title,
    description,
    headerControls,
    data,
    isLoading,
    isError,
    error,
}: PaymentStatsCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent pb-6 h-48">
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
                                {formatKz(data?.totalCollected ?? 0)}
                            </CardTitle>
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
                ) : (
                    <div className="divide-y">
                        {paymentStatsRows.map(({ key, label, icon: Icon, format, accent, chip }) => (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-4 px-6 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "flex size-8 shrink-0 items-center justify-center rounded-full",
                                            chip,
                                            accent
                                        )}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {label}
                                    </span>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-24" />
                                ) : (
                                    <span className="font-mono text-sm font-semibold tabular-nums">
                                        {format(data?.[key] ?? 0)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}