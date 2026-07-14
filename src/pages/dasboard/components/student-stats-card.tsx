"use client"

import * as React from "react"
import { AlertTriangle, Calendar, GraduationCap, Users } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { formatNumber } from "../utils/student-stats-format.ts"
import { StudentStatsData } from "@/services/statics/statitis.service.ts"




interface StudentStatsCardProps {
    title: string
    description: React.ReactNode
    headerControls?: React.ReactNode
    data?: StudentStatsData[]
    isLoading: boolean
    isError: boolean
    error: unknown
}

export function StudentStatsCard({
    title,
    description,
    headerControls,
    data,
    isLoading,
    isError,
    error,
}: StudentStatsCardProps) {
    const rows = data ?? []

    const totalEnrollments = rows.reduce(
        (sum, item) => sum + (item.totalEnrollments ?? 0),
        0
    )

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
                            <Skeleton className="mt-2 h-9 w-40" />
                        ) : (
                            <CardTitle className="mt-1.5 font-mono text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
                                {formatNumber(totalEnrollments)}
                            </CardTitle>
                        )}
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GraduationCap className="size-5" />
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
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-4 px-6 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-8 shrink-0 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Sem registos para este tipo de candidatura
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {rows.map((item) => (
                            <div
                                key={`${item.academicYear}-${item.applicationTypeCode}`}
                                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                                            "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <Calendar className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {item.academicYear}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.applicationType}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="flex items-center justify-end gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            <GraduationCap className="size-3.5" />
                                            Matrículas
                                        </p>
                                        <p className="font-mono text-xl font-bold tabular-nums text-primary">
                                            {formatNumber(item.totalEnrollments)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="flex items-center justify-end gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            <Users className="size-3.5" />
                                            Total de Alunos
                                        </p>
                                        <p className="font-mono text-xl font-bold tabular-nums">
                                            {formatNumber(item.totalStudents)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}