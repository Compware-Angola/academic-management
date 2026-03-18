import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Escalao = {
  value: number;
  label: string;
};

export async function fetchEscalao(): Promise<Escalao[]> {
  const { data } = await axiosNestGa.get("/dropdown-filters/escalao");
  return data ?? [];
}
