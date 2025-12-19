import { axiosApexGa } from "@/lib/axios-apex-ga";
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
};
type PrazosParams = {
  anoLetivoId: string;
  tipoPrazoId: string;
  tipoCandidaturaId: string;
};
export async function fetchPrazos(params: PrazosParams) {
  const { anoLetivoId, tipoCandidaturaId, tipoPrazoId } = params;
  const res = await axiosApexGa.get<Root>(
    `ga/academic-calendar/deadlines/${anoLetivoId}/${tipoPrazoId}/${tipoCandidaturaId}`
  );
  return res.data.prazos || [];
}
