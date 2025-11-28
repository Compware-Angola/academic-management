import { axiosApexGa } from "@/lib/axios-apex-ga";
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
