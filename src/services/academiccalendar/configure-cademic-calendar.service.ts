import { axiosNestGa } from "@/lib/axios-nest-ga"

export type ConfigureAcademicCalendar = {
  periodo: Periodo
  vagas: Vaga[]
  meses: Mese[]
}

export type Periodo = {
  designacao: string
  data_inicio_primeiro_semestre: string
  data_fim_primeiro_semestre: string
  data_inicio_segundo_semestre: string
  data_fim_segundo_semestre: string
  codigo_tipo_candidatura: number
}

export type Vaga = {
  codigo_vaga: number
  codigo_periodo: number
  codigo_curso: number
  polo_id: number
  numero_vagas: number
}

export type Mese = {
  designacao: string
  isencao: number
  ordem_mes: number
  prestacao: number
  activo: number
  activo_posgraduacao: number
  data_limite: string
  data_inicial: string
  data_final: string
  data_final_desconto: any
  semestre: number
  semestre_posgraduacao: number
}


export const configureAcademicCalendarService = async (data: ConfigureAcademicCalendar) => {
    const response = await axiosNestGa.post('/academic-calendar', data);
    return response.data ?? null;
}
