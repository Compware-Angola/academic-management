import { axiosApexGa } from "@/lib/axios-apex-ga";

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
  await axiosApexGa.put("/auto/fk2_mcal_tb_prazo", payload);
}
