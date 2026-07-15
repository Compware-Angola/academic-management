import { useQuery } from "@tanstack/react-query"

import {
    getPaymentComparison,
    getPaymentDailySummary,
    getPaymentMonthlySummary,
    getPaymentPerformanceMonthly,
    getPaymentSummary,
    getStudentStats,
    PaymentMonthlySummary,
    PaymentPerformanceMonthlyParams,
    PaymentSummaryParams,
    StudentStatsParams,
} from "@/services/statics/statitis.service"

const REFETCH_INTERVAL = 1000 * 60 * 2

const DASHBOARD_QUERY_OPTIONS = {
    staleTime: REFETCH_INTERVAL,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
}

export const useQueryPaymentDailySummary = (
    formaPagamento: number | undefined,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "payment-daily-summary", formaPagamento],
        queryFn: () => getPaymentDailySummary(formaPagamento),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}

export const useQueryPaymentMonthlySummary = (
    params: PaymentMonthlySummary | undefined,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "payment-monthly-summary", params],
        queryFn: () => getPaymentMonthlySummary(params),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}

export const useQueryPaymentComparison = (
    params: PaymentMonthlySummary,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "payment-comparison", params],
        queryFn: () => getPaymentComparison(params),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}

export const useQueryPaymentPerformanceMonthly = (
    params: PaymentPerformanceMonthlyParams,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "payment-performance-monthly", params],
        queryFn: () => getPaymentPerformanceMonthly(params),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}

export const useQueryStudentStats = (
    params: StudentStatsParams | undefined,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "student-stats", params],
        queryFn: () => getStudentStats(params),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}


export const useQueryPaymentSummary = (
    params: PaymentSummaryParams,
    isActive: boolean,
) => {
    return useQuery({
        queryKey: ["statics", "payment-summary", params],
        queryFn: () => getPaymentSummary(params),
        refetchInterval: isActive ? REFETCH_INTERVAL : false,
        ...DASHBOARD_QUERY_OPTIONS,
    })
}