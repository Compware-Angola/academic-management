import { axiosNestFinance } from "@/lib/axios-nest-finance";

type PaymentSummary = {
  totalPayments: number;
  totalCollected: number;
  averagePayment: number;
  smallestPayment: number;
  largestPayment: number;
};

export async function getPaymentDailySummary(formaPagamento?: number) {
  const response = await axiosNestFinance.get<PaymentSummary>(
    "payment/statics/summary/daily",
    {
      params: {
        formaPagamento,
      },
    },
  );
  return response.data;
}

export type PaymentMonthlySummary = {
  month?: number;
  year?: number;
  formaPagamento?: number;
};

export async function getPaymentMonthlySummary(params?: PaymentMonthlySummary) {
  const response = await axiosNestFinance.get<PaymentSummary>(
    "payment/statics/summary/monthly",
    {
      params,
    },
  );
  return response.data;
}

export type PaymentComparison = {
  label: string;
  totalPayments: number;
  totalAmount: number;
};

export async function getPaymentComparison(params: PaymentMonthlySummary) {
  const response = await axiosNestFinance.get<PaymentComparison[]>(
    "payment/statics/summary/comparison",
    {
      params,
    },
  );
  return response.data;
}

export type PaymentPerformanceMonthlyResponse = {
  mensal: MonthlyPaymentItem[];
  totalAnual: TotalAnual;
};

export type MonthlyPaymentItem = {
  ordem: number;
  mes: string;
  nome_mes: string;
  label_ano_atual: string;
  valor_ano_atual: number;
  label_ano_anterior: string;
  valor_ano_anterior: number;
};

export type TotalAnual = {
  anoAtual: PaymentPerformanceMonthlySummary;
  anoAnterior: PaymentPerformanceMonthlySummary;
};

export type PaymentPerformanceMonthlySummary = {
  label: string;
  totalValor: number;
  totalPagamentos: number;
};

export type PaymentPerformanceMonthlyParams = {
  currentYear: number;
  previousYear: number;
};

export async function getPaymentPerformanceMonthly(
  params: PaymentPerformanceMonthlyParams,
) {
  const response = await axiosNestFinance.get<PaymentPerformanceMonthlyResponse>(
    "payment/statics/summary/performance/monthly",
    {
      params,
    },
  );
  return response.data;
}
