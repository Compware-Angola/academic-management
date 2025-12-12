import { axiosApexGa } from "@/lib/axios-apex-ga";

export type AulaPayload = {
  diaSemana: number;
  ordemTempo: number;
  sala: number;
};

export type SaveHorarioPayload = {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  unidadeCurricular: number;
  docente: number;
  tipoAula: number;
  modalidade: number;
  aulas: AulaPayload[];
};

export type SaveHorarioResponse = {
  sucesso: number; // 1 | 0
  mensagem: string;
  horarioId?: number;
  designacao?: string;
  aulasCriadas: number;
};

export async function saveHorarioService(
  payload: SaveHorarioPayload
): Promise<SaveHorarioResponse> {
  const { data } = await axiosApexGa.post("/horario/salvarHorario", payload);

  return data;
}
