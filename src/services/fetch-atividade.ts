import { axiosNestGa } from "@/lib/axios-nest-ga";
export type Atividade = {
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_termino: string;
  cod_ano_lectivo: number;
  codigo_tipo_calendario: number;
  codigo_tipo_candidatura: number;
  ano_lectivo: string;
  tipo_candidatura: string;
  tipo_calendario: string;
  codigo_utilizador?: number;
  descricao_utilizador?: string;
};

export async function fetchAtividade({
  anoLetivoId,
  tipoCandidaturaId,
}: {
  anoLetivoId: string;
  tipoCandidaturaId: string;
}): Promise<Atividade[]> {
  const { data } = await axiosNestGa.get(
    "/academic-activities/calendar-activities",
    {
      params: {
        anolectivo: anoLetivoId,
        tpcandidatura: tipoCandidaturaId,
      },
    }
  );
  return data.actividades ?? [];
}
