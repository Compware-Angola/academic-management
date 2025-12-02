import { useQuery } from "@tanstack/react-query";
import { getExemptDays } from "@/services/exempt-days/get-exempt-days.service";

export function useQueryExemptDays() {
  return useQuery({
    queryKey: ["exempt-days"],
    queryFn: getExemptDays,

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
