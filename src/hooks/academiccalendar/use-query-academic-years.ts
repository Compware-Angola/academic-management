import {
  fetchAcademicYears,
  FetchAcademicYearsParams,
} from "@/services/academiccalendar/fetch-academic-years";
import { useQuery } from "@tanstack/react-query";

export function useAcademicYears(params: FetchAcademicYearsParams) {
  return useQuery({
    queryKey: ["academic-years", params],
    queryFn: () => fetchAcademicYears(params),
    enabled: !!params.tipoCandidatura,
  });
}
