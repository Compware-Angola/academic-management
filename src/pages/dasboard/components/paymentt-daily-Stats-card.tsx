"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { useQueryPaymentSummary } from "@/hooks/statics"
import { useUserActivity } from "@/hooks/use-user-activity"

import { PaymentSummaryStatsCard } from "./payment-summary-stats-card"
import { DateRangeFilter } from "./date-range-filter"
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect"
import { parseFilter } from "@/util/parse-filter"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

function getInitialRange(): DateRange {
    const today = new Date()
    return { from: today, to: today }
}

export function PaymentDailyStatsCard() {
    const isActive = useUserActivity()
    const [formaPagamento, setFormaPagamento] = React.useState("")
    const [range, setRange] = React.useState<DateRange | undefined>(getInitialRange)

    const params = React.useMemo(
        () => ({
            dataInicio: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
            dataFim: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
            codigoFormaPagamento: parseFilter(formaPagamento)
        }),
        [range, formaPagamento]
    )

    const isFiltered = formaPagamento !== "" || range?.from?.toDateString() !== new Date().toDateString() || range?.to?.toDateString() !== new Date().toDateString()

    const reset = () => {
        setFormaPagamento("")
        setRange(getInitialRange())
    }

    const {
        data: dataStatics,
        isLoading: isLoadingStatics,
        isError: isErrorStatics,
        error: errorStatics,
    } = useQueryPaymentSummary(params, isActive)

    return (
        <PaymentSummaryStatsCard
            title="Pagamentos"
            description="Total arrecadado"
            headerControls={
                <>
                    {isFiltered && (
                        <Button aria-label="Limpar filtros" size="icon-sm" variant="outline" onClick={reset}>
                            <X />
                        </Button>
                    )}
                    <FormaPagamentoSelect
                        value={formaPagamento}
                        onChangeValue={setFormaPagamento}
                        allOption
                        allowAll
                    />
                    <DateRangeFilter value={range} onChangeValue={setRange} />
                </>

            }
            data={dataStatics}
            isLoading={isLoadingStatics}
            isError={isErrorStatics}
            error={errorStatics}
        />
    )
}