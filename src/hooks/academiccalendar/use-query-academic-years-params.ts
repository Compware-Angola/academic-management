import { AcademicYear, AcademicYearParamsResponse, fetchAcademicYearParams } from "@/services/academiccalendar/fetch-academic-years-params";
import { useQuery } from "@tanstack/react-query";

export function useQueryAcademicYearParams(
  codigo?: number,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: ["academic-year-params", codigo],
    queryFn: () => fetchAcademicYearParams(codigo!),
    // Mantemos o array, mas extraímos o primeiro item (ou null)
    select: (data: AcademicYearParamsResponse): AcademicYear | null => {
      const items = data.ano_lectivo ?? [];
      return items.length > 0 ? items[0] : null;
    },
    enabled: enabled && !!codigo && codigo > 0,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 30 * 60 * 1000,
  });

  return {
    // Objeto único (o primeiro do array) → exatamente o que o componente usa
    academicYearParams: query.data ?? null,

    // Array completo (caso precises em outro lugar)
    academicYearParamsList: (query.data ? [query.data] : []) as AcademicYear[],

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}