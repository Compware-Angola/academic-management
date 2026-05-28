import { axiosNestGa } from "@/lib/axios-nest-ga";
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
