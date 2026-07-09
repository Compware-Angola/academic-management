"use client"

import * as React from "react"
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect"
import { useQueryPaymentDailySummary } from "@/hooks/statics"
import { parseFilter } from "@/util/parse-filter"
import { PaymentStatsCard } from "./payment-stats-card"

export function PaymenttDailyStatsCard() {
    const [formaPagamento, setFormaPagamento] = React.useState("")
    const {
        data: dataStatics,
        isLoading: isLoadingStatics,
        isError: isErrorStatics,
        error: errorStatics,
    } = useQueryPaymentDailySummary(parseFilter(formaPagamento))

    return (
        <PaymentStatsCard
            title="Pagamentos Diários"
            description="Total arrecadado"
            headerControls={
                <FormaPagamentoSelect
                    value={formaPagamento}
                    onChangeValue={setFormaPagamento}
                    allOption
                    allowAll
                />
            }
            data={dataStatics}
            isLoading={isLoadingStatics}
            isError={isErrorStatics}
            error={errorStatics}
        />
    )
}