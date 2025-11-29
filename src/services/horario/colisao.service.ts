

import { axiosApexGa } from "@/lib/axios-apex-ga";

/* ---------- PAYLOAD ---------- */
export type VerifyCollisionPayload = {
  ano_lectivo: number;
  semestre: number;
  periodo: number;
  unidade_curricular: number;
  docente: number;
  sala: number;
  dia_semana: number;
  ordem_tempo: number;
  horario_id: number | null;
};

/* ---------- RESPONSE ---------- */
export type VerifyCollisionResponse = {
  temColisao: number; // 0 ou 1
  mensagem?: string;
  horarioConflito?: string;
  tempoConflito?: number;
  horaConflito?: string;
};

/* ---------- SERVICE ---------- */
export async function verifyCollisionService(
  payload: VerifyCollisionPayload,
): Promise<VerifyCollisionResponse> {
  const { data } = await axiosApexGa.post(
    "/ga/horario/verificar-colisao",
    payload,
  );

  return data;
}
