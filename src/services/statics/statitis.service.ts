import { axiosNestFinance } from "@/lib/axios-nest-finance"
import { axiosNestGa } from "@/lib/axios-nest-ga"

export type PaymentMonthlySummary = {
    month?: number
    year?: number
    formaPagamento?: number
}

export type PaymentComparison = {
    label: string
    totalPayments: number
    totalAmount: number
}
export async function getPaymentComparison(params: PaymentMonthlySummary) {
    const response = await axiosNestFinance.get<PaymentComparison[]>(`payment/statics/summary/comparison`, {
        params
    })
    return response.data
}

export type PaymentPerformanceMonthlyResponse = {
    mensal: MonthlyPaymentItem[]
    totalAnual: TotalAnual
}

export type MonthlyPaymentItem = {
    ordem: number
    mes: string
    nome_mes: string
    label_ano_atual: string
    valor_ano_atual: number
    label_ano_anterior: string
    valor_ano_anterior: number
}

export type TotalAnual = {
    anoAtual: PaymentPerformanceMonthlySummary
    anoAnterior: PaymentPerformanceMonthlySummary
}

export type PaymentPerformanceMonthlySummary = {
    label: string
    totalValor: number
    totalPagamentos: number
}

export type PaymentPerformanceMonthlyParams = {
    currentYear: number
    previousYear: number
}




export async function getPaymentPerformanceMonthly(params: PaymentPerformanceMonthlyParams) {
    const response = await axiosNestFinance.get<PaymentPerformanceMonthlyResponse>(`payment/statics/summary/performance/monthly`, {
        params
    })
    return response.data
}



export type StudentStatsData = {
    academicYear: string
    newStudents: number
    accumulatedStudents: number

}

export type StudentStatsResponse = {

    data: StudentStatsData[]

}



export async function getStudentStats()
    : Promise<StudentStatsResponse> {

    const response =
        await axiosNestGa.get<StudentStatsResponse>(
            "/stats/students",
        )


    return response.data
}

type PaymentSummaryItem = {
    codigoFormaPagamento: number
    tipoPagamento: string
    totalPagamentos: number
    totalPago: number
}
export type PaymentSummaryResponse = {
    data: PaymentSummaryItem[]
}
export type PaymentSummaryParams = {
    dataInicio?: string
    dataFim?: string
    codigoFormaPagamento?: number
}
export async function getPaymentSummary(params?: PaymentSummaryParams) {
    const response = await axiosNestFinance.get<PaymentSummaryResponse>(`payment/statics/summary`, {
        params

    })
    return response.data
}


