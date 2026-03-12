import {
  Discipline,
  fetchDropdownDisciplines,
} from "@/services/study_plan/fetch-dropdown-discipline.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryDropdownDisciplines() {
  return useQuery<Discipline[], Error>({
    queryKey: ["disciplines-dropdown"],
    queryFn: fetchDropdownDisciplines,
    staleTime: 1000 * 60 * 30,
  });
}
