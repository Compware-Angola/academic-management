// src/hooks/academiccalendar/use-query-academic-year-monthly-fees.ts
import { useQuery } from "@tanstack/react-query";
import {
  MonthlyFeesResponse,
  MonthlyFee,
  fetchAcademicYearMonthlyFees,
} from "@/services/academiccalendar/fetch-academic-year-monthly-fees";

type UseMonthlyFeesOptions = {
  codigoAno?: number;
  enabled?: boolean;
};

export function useQueryAcademicYearMonthlyFees({
  codigoAno,
  enabled = true,
}: UseMonthlyFeesOptions) {
  const shouldEnable = enabled && !!codigoAno;

 const query = useQuery({
    queryKey: ["academic-year-monthly-fees", codigoAno],
    queryFn: () => fetchAcademicYearMonthlyFees(codigoAno!),
    enabled: shouldEnable,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000,
    select: (data: MonthlyFeesResponse): MonthlyFee[] => data.meses ?? [],
  });

  return {
    monthlyFees: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}