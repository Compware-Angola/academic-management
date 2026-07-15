"use client"

import * as React from "react"
import {
    AlertTriangle,
    Calendar,
    GraduationCap,
    Users,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "../utils/student-stats-format"
import { StudentStatsData } from "@/services/statics/statitis.service"



interface StudentStatsCardProps {
    title: string
    description: React.ReactNode
    data?: StudentStatsData[]
    isLoading: boolean
    isError: boolean
    error: unknown
}


export function StudentStatsCard({
    title,
    description,
    data,
    isLoading,
    isError,
    error,
}: StudentStatsCardProps) {

    const rows = data ?? []


    return (
        <Card className="overflow-hidden">

            <CardHeader
                className="
                    border-b
                    bg-gradient-to-br
                    from-primary/10
                    via-primary/[0.03]
                    to-transparent
                "
            >

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <CardTitle className="text-xl font-bold">
                            {title}
                        </CardTitle>

                        <CardDescription className="mt-1">
                            {description}
                        </CardDescription>
                    </div>


                    <span
                        className="
                            flex size-10 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-primary/10
                            text-primary
                        "
                    >
                        <GraduationCap className="size-5" />
                    </span>

                </div>

            </CardHeader>


            <CardContent className="p-0">


                {isError && (

                    <div
                        className="
                            flex flex-col
                            items-center
                            justify-center
                            gap-2
                            px-6
                            py-10
                            text-center
                        "
                    >

                        <span
                            className="
                                flex size-10
                                items-center
                                justify-center
                                rounded-full
                                bg-destructive/10
                                text-destructive
                            "
                        >
                            <AlertTriangle className="size-5" />
                        </span>


                        <p className="text-sm font-medium text-destructive">
                            Não foi possível carregar os dados
                        </p>


                        <p className="text-xs text-muted-foreground">
                            {
                                error instanceof Error
                                    ? error.message
                                    : "Tente novamente mais tarde."
                            }
                        </p>

                    </div>

                )}


                {!isError && isLoading && (

                    <div className="divide-y">

                        {
                            Array.from({
                                length: 5
                            }).map((_, index) => (

                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        px-6
                                        py-4
                                    "
                                >

                                    <Skeleton className="h-5 w-32" />

                                    <div className="flex gap-6">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )}



                {!isError && !isLoading && rows.length === 0 && (

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            px-6
                            py-10
                        "
                    >
                        <p className="text-sm text-muted-foreground">
                            Sem dados disponíveis
                        </p>
                    </div>

                )}
                {!isError && !isLoading && rows.length > 0 && (

                    <div
                        className="
                            max-h-[420px]
                            overflow-y-auto
                            divide-y
                        "
                    >

                        {
                            rows.map((item) => (

                                <div
                                    key={item.academicYear}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        px-6
                                        py-4
                                    "
                                >

                                    {/* Ano letivo */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <span
                                            className="
                                                flex size-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-primary/10
                                                text-primary
                                            "
                                        >
                                            <Calendar className="size-4" />
                                        </span>


                                        <div>

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                "
                                            >
                                                {item.academicYear}
                                            </p>


                                            <p
                                                className="
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                Ano lectivo
                                            </p>

                                        </div>

                                    </div>



                                    {/* Valores */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-8
                                        "
                                    >

                                        <div className="text-right">

                                            <p
                                                className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                    text-xs
                                                    uppercase
                                                    text-muted-foreground
                                                "
                                            >
                                                <Users className="size-3.5" />
                                                Novos
                                            </p>


                                            <p
                                                className="
                                                    font-mono
                                                    text-xl
                                                    font-bold
                                                    text-primary
                                                "
                                            >
                                                {
                                                    formatNumber(
                                                        item.newStudents
                                                    )
                                                }
                                            </p>

                                        </div>



                                        <div className="text-right">

                                            <p
                                                className="
                                                    text-xs
                                                    uppercase
                                                    text-muted-foreground
                                                "
                                            >
                                                Total acumulado
                                            </p>


                                            <p
                                                className="
                                                    font-mono
                                                    text-xl
                                                    font-bold
                                                "
                                            >
                                                {
                                                    formatNumber(
                                                        item.accumulatedStudents
                                                    )
                                                }
                                            </p>

                                        </div>


                                    </div>


                                </div>

                            ))
                        }

                    </div>

                )}


            </CardContent>

        </Card>
    )
}