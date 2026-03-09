// src/services/schedule/getScheduleDetailsService.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- RESPONSE ---------- */
export type Aula = {
  id: number;
  tipoAula: string;           // "Teorico-Prática"
  tipoAulaId: number;
  modalidade: string;         // "Presencial"
  modalidadeId: number;
  diaSemana: string;          // "Sexta-Feira"
  diaSemanaId: number;
  ordem: number;
  sala: string;  
  salaid:number;             // "U-202"
  horaInicio: string;         // "29400000000000" (nanoseconds ou ticks)
  horaTermino: string;
  docenteId: number | null;
  docenteNome: string;        // "Sem docente"
  observacoes: string | null;
  criadoPor: number;
  atualizadoPor: number | null;
  criadoEm: string;
  atualizadoEm: string | null;
  ativo: boolean;
};

export type ScheduleDetailsResponse = {
codigo: number
  fk_ano_lectivo: number
  designacao: string
  unidadeCurricularId: number
  unidadeCurricular: string
  curso: string
  cursoId: number
  ano: string
  capacidade: number
  reservado: string
  semestre: number
  periodo: number
  estado: string
  estadoCor: any
  estadoId: number
  disponibilidade: string
  disponivel: boolean
  criadoPor: string
  atualizadoPor: string
  dataUltimaAtualizacao: string
  dataCriacao: string
  aulas: Aula[];
};

/* ---------- SERVICE ---------- */
export async function getScheduleDetailsService(turmaId: number): Promise<ScheduleDetailsResponse> {
  const { data } = await axiosNestGa.get<ScheduleDetailsResponse>(`/schedule/${turmaId}`);
  return data;
}