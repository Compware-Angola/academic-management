"use client"

import * as React from "react"
import {
    Wallet,
    Receipt,
    Calculator,
    ArrowDownToLine,
    ArrowUpToLine,
    AlertTriangle,
    Calendar1,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect"
import { useQueryPaymentMonthlySummary } from "@/hooks/statics"
import { parseFilter } from "@/util/parse-filter"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const kzFullFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
})

const countFormatter = new Intl.NumberFormat("pt-AO")

function formatKz(value: number) {
    return kzFullFormatter.format(value ?? 0)
}

function formatCount(value: number) {
    return countFormatter.format(value ?? 0)
}

const rows = [
    {
        key: "totalPayments",
        label: "Nº de pagamentos",
        icon: Receipt,
        format: formatCount,
        accent: "text-sky-600 dark:text-sky-400",
        chip: "bg-sky-500/10",
    },
    {
        key: "averagePayment",
        label: "Pagamento médio",
        icon: Calculator,
        format: formatKz,
        accent: "text-violet-600 dark:text-violet-400",
        chip: "bg-violet-500/10",
    },
    {
        key: "smallestPayment",
        label: "Menor pagamento",
        icon: ArrowDownToLine,
        format: formatKz,
        accent: "text-amber-600 dark:text-amber-400",
        chip: "bg-amber-500/10",
    },
    {
        key: "largestPayment",
        label: "Maior pagamento",
        icon: ArrowUpToLine,
        format: formatKz,
        accent: "text-emerald-600 dark:text-emerald-400",
        chip: "bg-emerald-500/10",
    },
] as const

const monthYearFormatter = new Intl.DateTimeFormat("pt-AO", {
    month: "long",
    year: "numeric",
})

const monthShortFormatter = new Intl.DateTimeFormat("pt-AO", {
    month: "short",
})

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) => {
    const label = monthShortFormatter.format(new Date(2000, i, 1))
    return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "")
})

function formatMonthYear(date: Date) {
    const label = monthYearFormatter.format(date)
    return label.charAt(0).toUpperCase() + label.slice(1)
}

interface MonthYearPickerProps {
    date: Date
    onChange: (date: Date) => void
}

function MonthYearPicker({ date, onChange }: MonthYearPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [viewYear, setViewYear] = React.useState(date.getFullYear())

    React.useEffect(() => {
        if (open) setViewYear(date.getFullYear())
    }, [open, date])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[180px] justify-between text-left font-normal"
                >
                    <span className="truncate">{formatMonthYear(date)}</span>
                    <Calendar1 className="size-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
                <div className="mb-2 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setViewYear((y) => y - 1)}
                        aria-label="Ano anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-semibold tabular-nums">
                        {viewYear}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setViewYear((y) => y + 1)}
                        aria-label="Próximo ano"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {MONTH_LABELS.map((label, index) => {
                        const isSelected =
                            date.getFullYear() === viewYear &&
                            date.getMonth() === index
                        return (
                            <Button
                                key={label}
                                type="button"
                                variant={isSelected ? "default" : "ghost"}
                                size="sm"
                                className="h-8 px-0 text-xs font-medium"
                                onClick={() => {
                                    onChange(new Date(viewYear, index, 1))
                                    setOpen(false)
                                }}
                            >
                                {label}
                            </Button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function PaymentMonthlyStatsCard() {
    const [formaPagamento, setFormaPagamento] = React.useState("")
    const [date, setDate] = React.useState<Date>(new Date())

    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const {
        data: dataStatics,
        isLoading: isLoadingStatics,
        isError: isErrorStatics,
        error: errorStatics,
    } = useQueryPaymentMonthlySummary({
        month,
        year,
        formaPagamento: parseFilter(formaPagamento),
    })

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">Pagamentos Mensais</h3>
                    <div className="flex items-center gap-2">
                        <FormaPagamentoSelect
                            allOption
                            value={formaPagamento}
                            onChangeValue={(value) => setFormaPagamento(value)}
                            allowAll
                        />
                        <MonthYearPicker date={date} onChange={setDate} />
                    </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardDescription>
                            Total arrecadado em {formatMonthYear(date)}
                        </CardDescription>
                        {isLoadingStatics ? (
                            <Skeleton className="mt-2 h-7 w-40" />
                        ) : (
                            <CardTitle className="mt-1.5 font-mono text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
                                {formatKz(dataStatics?.totalCollected ?? 0)}
                            </CardTitle>
                        )}
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Wallet className="size-5" />
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isErrorStatics ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </span>
                        <p className="text-sm font-medium text-destructive">
                            Não foi possível carregar os dados
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {errorStatics instanceof Error
                                ? errorStatics.message
                                : "Tente novamente mais tarde."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {rows.map(({ key, label, icon: Icon, format, accent, chip }) => (
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
                                {isLoadingStatics ? (
                                    <Skeleton className="h-4 w-24" />
                                ) : (
                                    <span className="font-mono text-sm font-semibold tabular-nums">
                                        {format(dataStatics?.[key] ?? 0)}
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