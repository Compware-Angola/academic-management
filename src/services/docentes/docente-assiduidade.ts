import { axiosNestGa } from "@/lib/axios-nest-ga";

export type FiltroAssiduidadePayload ={
  periodoId?: number;
  docenteId: number; 
  gradeId?: number;
  estadoAgendamento?: number;
  dataInicio?: string;
  dataFim?: string;
  anoLectivo?: number;
  semestre?: number;
  page?: number;
  limit?: number;
}

// Interface que reflete exatamente o seu JSON de retorno
export type AssiduidadeDocenteItem = {
  codigo: number;
  data_aula: string;
  horario: string;
  estado: string;
  docente: string | null;
  ordem_tempo: number;
  curso: string;
  unidade_curricular: string;
  hora_inicio: string;
  hora_termino: string;
}

export async function fetchAssiduidadeDocente(
  payload: FiltroAssiduidadePayload
): Promise<{ data: AssiduidadeDocenteItem[],  
    total: number;
    page: number;
    limit: number;
    totalPages: number; }> {
  const { docenteId, ...params } = payload;
  
  // Remove chaves undefined ou nulas
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );

  const { data } = await axiosNestGa.get(
    `docentes/assiduidade/${docenteId}`,
    { params: cleanedParams }
  );

  return data;
}