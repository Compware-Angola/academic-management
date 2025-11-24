// src/hooks/academiccalendar/use-query-academic-year-vacancies.ts
import { fetchAcademicYearVacancies, VacanciesResponse, Vacancy } from "@/services/academiccalendar/fetch-vacancies-per-course";
import { useQuery } from "@tanstack/react-query";

type UseVacanciesOptions = {
  codigoAno?: number;
  tipoCandidatura?: number;
  enabled?: boolean;
};

export function useQueryAcademicYearVacancies({
  codigoAno,
  tipoCandidatura,
  enabled = true,
}: UseVacanciesOptions) {
  const shouldEnable = enabled && !!codigoAno && !!tipoCandidatura;

  const query = useQuery({
    queryKey: ["academic-year-vacancies", codigoAno, tipoCandidatura],
    queryFn: () => fetchAcademicYearVacancies(codigoAno!, tipoCandidatura!),
    enabled: shouldEnable,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000,
    select: (data: VacanciesResponse): Vacancy[] => data.vagas ?? [],
  });

  return {
    vacancies: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}