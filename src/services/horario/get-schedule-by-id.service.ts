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
  codigo: number;
  designacao: string;               // "AGT.1.TAS.D-H1"
  unidadeCurricularId: number;
  unidadeCurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: number;
  estado: string;
  estadoCor: string | null;
  estadoId: number;
  disponibilidade: string;
  disponivel: boolean;
  criadoPor: string;
  atualizadoPor: string | null;
  dataUltimaAtualizacao: string;
  dataCriacao: string;
  aulas: Aula[];
};

/* ---------- SERVICE ---------- */
export async function getScheduleDetailsService(turmaId: number): Promise<ScheduleDetailsResponse> {
  const { data } = await axiosNestGa.get<ScheduleDetailsResponse>(`/schedule/${turmaId}`);
  return data;
}