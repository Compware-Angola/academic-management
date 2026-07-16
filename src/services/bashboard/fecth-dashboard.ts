import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
export type Dashboard = {
  "total_estudantes": number,
  "total_docentes": number,
  "total_uc": number,
  "aval_pendentes": number
};
export async function fetchDashboard(): Promise<Dashboard> {
  const { data } = await axiosApexGa.get("/uma/dashboard");
  return data
}





export type DashboardStatisticsReports = {
  totalAlunosInscritos: {
    total: number,
    descricao: string
  }
  totalDocentes: {
    total: number,
    descricao: string
  }
  totalUCs: {
    total: number,
    descricao: string
  }
  avaliacoesPendentes: {
    total: number,
    descricao: string
  }
};

export async function fetchDashboardStatisticsReports(): Promise<DashboardStatisticsReports> {
  const { data } = await axiosNestGa.get("/statistics-reports/dashboard");

  return data;
}
