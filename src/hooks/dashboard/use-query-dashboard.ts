import { Dashboard, fetchDashboard } from "@/services/bashboard/fecth-dashboard";
import { useQuery } from "@tanstack/react-query";

export function useQueryDashboard() {
  return useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });
}
