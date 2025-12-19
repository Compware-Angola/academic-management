import { axiosApexGa } from "@/lib/axios-apex-ga";

interface CreatePrazoPayload {
  fk_tipo_prazo: number;
  fk_tipo_avaliacao: number | null;
  fk_semestre: number;
  data_inicio: string;
  data_fim: string;
  observacao?: string | null;
  fk_created_by: string;
}

interface CreatePrazoParams {
  anoLetivoId: string;
  tipoPrazoId: string;
  tipoCandidaturaId: string;
  payload: CreatePrazoPayload;
}

export async function createPrazo({
  anoLetivoId,
  tipoPrazoId,
  tipoCandidaturaId,
  payload,
}: CreatePrazoParams) {
  await axiosApexGa.post(
    `ga/academic-calendar/deadlines/${anoLetivoId}/${tipoPrazoId}/${tipoCandidaturaId}`,
    payload
  );
}
