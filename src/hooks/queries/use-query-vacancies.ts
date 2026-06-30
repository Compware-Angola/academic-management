

import { useQuery } from "@tanstack/react-query";
import { fetchVacancies, VacanciesResponse, Vacancy } from "@/services/academiccalendar/fetch-vacancies";

export function useQueryVacancies() {
  return useQuery<VacanciesResponse, Error>({
    queryKey: ["vacancies"],
    queryFn: () => fetchVacancies(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    
  });
}