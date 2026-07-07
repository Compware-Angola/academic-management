import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";

type UpdateDisciplineParams = {
  codigo: number;
  designacao?: string;
  tipoUnidadeCurricular?: string;
  naturezaUnidadeCurricular?: string;
  codigoDisciplina?: string;
  nomeAbreviatura?: string;
  duracao?: number;
  status?: number;
};

export async function updateDiscipline(payload: UpdateDisciplineParams) {
  const { codigo, ...rest } = payload;
  const response = await axiosNestGa.patch(`discipline/${codigo}`, rest);

  return response.data;
}
