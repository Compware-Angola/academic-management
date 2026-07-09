import { axiosNestGa } from "@/lib/axios-nest-ga";
export type Root = {
  prazos: Prazo[];
};

export type Prazo = {
  prazo_id: number;
  observacao: string;
  tipo_avaliacao_id: number;
  data_inicio: string;
  data_fim: string;
  tipo_avaliacao: string;
  criado_por_nome: string;
  atualizado_por_nome: string;
  fk_semestre: string;
};
type PrazosParams = {
  anoLetivoId: string;
  tipoPrazoId: string;
  tipoCandidaturaId: string;
};
export async function fetchPrazos(params: PrazosParams) {
  const { anoLetivoId, tipoCandidaturaId, tipoPrazoId } = params;
  const res = await axiosNestGa.get<Root>("/academic-activities/terms", {
    params: {
      anolectivo: anoLetivoId,
      tpprazo: tipoPrazoId,
      tpcandidatura: tipoCandidaturaId,
    },
  });
  return res.data.prazos || [];
}
