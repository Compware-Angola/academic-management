import { axiosNestFinance } from "@/lib/axios-nest-finance"


type PaymentSummary = {
    totalPayments: number
    totalCollected: number
    averagePayment: number
    smallestPayment: number
    largestPayment: number
}
export async function getPaymentDailySummary(formaPagamento?: number) {
    const response = await axiosNestFinance.get<PaymentSummary>(`payment/statics/summary/daily`, {
        params: {
            formaPagamento
        }
    })
    return response.data
}

export type PaymentMonthlySummary = {
    month?: number
    year?: number
    formaPagamento?: number
}
export async function getPaymentMonthlySummary(params?: PaymentMonthlySummary) {
    const response = await axiosNestFinance.get<PaymentSummary>(`payment/statics/summary/monthly`, {
        params
    })
    return response.data
}