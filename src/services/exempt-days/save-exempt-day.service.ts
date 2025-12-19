import { axiosApexGa } from "@/lib/axios-apex-ga";

type CreateEmptyDayProps = {
  designacao: string;
  data_inicio: string;
  data_fim: string;
  estado: number;
};

export async function saveExemptDays(payload: CreateEmptyDayProps) {
  await axiosApexGa.post("/ga/exempt-days", payload);
}
