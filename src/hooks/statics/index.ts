
import { getPaymentDailySummary, getPaymentMonthlySummary, PaymentMonthlySummary } from "@/services/statics/statitis.service"
import { useQuery } from "@tanstack/react-query"

export const useQueryPaymentDailySummary = (formaPagamento?: number) => {
    return useQuery({
        queryKey: ["statics", "payment-daily-summary", formaPagamento],
        queryFn: () => getPaymentDailySummary(formaPagamento),
    })
}

export const useQueryPaymentMonthlySummary = (params?: PaymentMonthlySummary) => {
    return useQuery({
        queryKey: ["statics", "payment-monthly-summary", params],
        queryFn: () => getPaymentMonthlySummary(params),
    })
}