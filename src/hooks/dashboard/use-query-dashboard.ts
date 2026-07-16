import { Dashboard, DashboardStatisticsReports, fetchDashboard, fetchDashboardStatisticsReports } from "@/services/bashboard/fecth-dashboard";
import { useQuery } from "@tanstack/react-query";

export function useQueryDashboard() {
  return useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useQueryDashboardStatisticsReports() {
  return useQuery<DashboardStatisticsReports>({
    queryKey: ["dashboard-statistics-reports"],
    queryFn: fetchDashboardStatisticsReports,
    staleTime: 5 * 60 * 1000,
  });
}
