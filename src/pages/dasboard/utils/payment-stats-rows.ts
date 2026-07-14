import {
    Receipt,
    Calculator,
    ArrowDownToLine,
    ArrowUpToLine,
} from "lucide-react"
import { formatKz, formatCount } from "./payment-stats-format"

export const paymentStatsRows = [
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

export type PaymentStatsData = Record<string, number> & {
    totalCollected?: number
}