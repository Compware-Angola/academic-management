import { axiosApexGa } from "@/lib/axios-apex-ga";

type UpdateDisciplineParams = {
  codigo: number;
  tipo_unidade_curricular: string;
  codigo_disciplina: string;
  natureza_unidade_curricular: string;
  designacao: string;
  nome_abreviatura: string;
};
export async function updateDiscipline(payload: UpdateDisciplineParams) {
  const response = await axiosApexGa.put(`/auto/fk2_tb_disciplinas`, payload);

  return response.data;
}
