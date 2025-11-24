import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Atividade = {
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_termino: string;
  ano_lectivo: string;
  tipo_candidatura: string;
  tipo_calendario: string;
};

export async function fetchAtividade({
  anoLetivoId,
  tipoCandidaturaId,
}: {
  anoLetivoId: string;
  tipoCandidaturaId: string;
}): Promise<Atividade[]> {
  const url = `/ga/academic-calendar/academic-activities/${anoLetivoId}/${tipoCandidaturaId}`;
  const { data } = await axiosApexGa.get(url);
  return data.actividades ?? [];
}
