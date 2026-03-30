// hooks/finance/use-query-finance-monthly-fee.ts

import {
  getmonthlyFee,
  MonthlyFeeDataResponse,
  MonthlyFeeQueryParams,
} from "@/services/financas/isencao-servicos/get-finance.service";
import { useQuery } from "@tanstack/react-query";

interface UseQueryFinanceMonthlyFeeParams {
  academicYear?: string;
  enrollmentCode?: string;
  status: string;
  page?: number;
  limit?: number;
}

export function useQueryFinanceMonthlyFee({
  academicYear,
  enrollmentCode,
  status,
  page = 1,
  limit = 10,
}: UseQueryFinanceMonthlyFeeParams) {
  const isEnabled = !!academicYear && !!enrollmentCode;

  const params: MonthlyFeeQueryParams = {
    academicYear: academicYear as string,
    enrollmentCode: enrollmentCode as string,
    status: status,
    page,
    limit,
  };

  const queryKey = ["finance-monthly-fee", params];

  const { data, isLoading, error, isError } = useQuery<MonthlyFeeDataResponse>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!isEnabled) {
        throw new Error(
          "Parâmetros de Ano Lectivo ou Matrícula estão faltando.",
        );
      }

      return getmonthlyFee(params);
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
}
