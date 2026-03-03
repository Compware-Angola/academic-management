import { axiosApexGa } from "@/lib/axios-apex-ga";

export type ProgramaUCStatus = {
  codigo: number;
  designacao: string;
};

export async function fetchProgramaUCStatus(): Promise<ProgramaUCStatus[]> {
  const { data } = await axiosApexGa.get("/uma/programa-uc-estado/all");
  return data.programa_estado ?? [];
}
