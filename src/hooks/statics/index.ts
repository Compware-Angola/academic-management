import {
  getPaymentComparison,
  getPaymentDailySummary,
  getPaymentMonthlySummary,
  getPaymentPerformanceMonthly,
  PaymentMonthlySummary,
  PaymentPerformanceMonthlyParams,
} from "@/services/statics/statitis.service";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_QUERY_OPTIONS = {
  staleTime: 0,
  gcTime: 1000 * 60 * 5,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

export const useQueryPaymentDailySummary = (formaPagamento?: number) => {
  return useQuery({
    queryKey: ["statics", "payment-daily-summary", formaPagamento],
    queryFn: () => getPaymentDailySummary(formaPagamento),
    refetchInterval: 1000,
    ...DASHBOARD_QUERY_OPTIONS,
  });
};

export const useQueryPaymentMonthlySummary = (params?: PaymentMonthlySummary) => {
  return useQuery({
    queryKey: ["statics", "payment-monthly-summary", params],
    queryFn: () => getPaymentMonthlySummary(params),
    refetchInterval: 5000,
    ...DASHBOARD_QUERY_OPTIONS,
  });
};

export const useQueryPaymentComparison = (params: PaymentMonthlySummary) => {
  return useQuery({
    queryKey: ["statics", "payment-comparison", params],
    queryFn: () => getPaymentComparison(params),
    refetchInterval: 5000,
    ...DASHBOARD_QUERY_OPTIONS,
  });
};

export const useQueryPaymentPerformanceMonthly = (
  params: PaymentPerformanceMonthlyParams,
) => {
  return useQuery({
    queryKey: ["statics", "payment-performance-monthly", params],
    queryFn: () => getPaymentPerformanceMonthly(params),
    refetchInterval: 5000,
    ...DASHBOARD_QUERY_OPTIONS,
  });
};
