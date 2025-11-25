

import { useQuery } from "@tanstack/react-query";
import { fetchVacancies, Vacancy } from "@/services/academiccalendar/fetch-vacancies";

export function useQueryVacancies() {
  return useQuery<Vacancy[], Error>({
    queryKey: ["vacancies"],
    queryFn: () => fetchVacancies(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    
  });
}