import { axiosNestGa } from "@/lib/axios-nest-ga";
export type AulaPayload = {
  diaSemana: number;
  ordemTempo: number;

  obs: string;

  hora_inicio: string;
  hora_fim: string;
};

export type SaveHorarioPayload = {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  unidadeCurricular: number;
  modalidade: number;
  estadoHorario: number;
  designacao: string;
  capacidade: number;
  turma: number;
  apenasPrimeiroAno: number;
  sala: number;
  docente: number;
  tipoAula: number;
  obs: string;
  aulas: AulaPayload[];
};

export type SaveHorarioResponse = {
  sucesso: number;
  mensagem: string;
  horarioId?: number;
  designacao?: string;
  aulasCriadas: number;
};

export async function saveHorarioService(
  payload: SaveHorarioPayload,
): Promise<SaveHorarioResponse> {
  const { data } = await axiosNestGa.post(`/schedule`, payload);

  return data;
}
