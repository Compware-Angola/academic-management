import { axiosNestGa } from "@/lib/axios-nest-ga";

interface UpdatePrazoPayload {
  pk_prazo: number;
  observacao?: string | null;
  fk_semestre: string;
  data_inicio: string;
  data_fim: string;
  fk_tipo_avaliacao?: string;
  fk_tipo_prazo: string;
  tipo_candidatura: string;
}

export async function updatePrazo(payload: UpdatePrazoPayload) {
  const { pk_prazo, ...body } = payload;

  await axiosNestGa.put(`/academic-activities/terms/${pk_prazo}`, body);
}
