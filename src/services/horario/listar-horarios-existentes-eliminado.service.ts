// src/services/horario/listar-horarios-existentes.service.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";

/* ---------- PAYLOAD (Filtros) ---------- */
export type ListarHorariosExistentesPayload = {
  p_ano_lectivo: number | string;
  p_semestre: number | string;
  p_periodo: number | string;
  p_curso: number | string;
  p_ano_curricular?: number | string; // Novo campo opcional
};

/* ---------- RESPONSE ITEM ---------- */
export type DisponibilidadeHorario = "Disponivel" | "Fechado" | "Pausa" | "Em atendimento";

export interface HorarioExistenteEliminado {
  codigo: number;
  designacao: string;
  unidadeCurricularId: number;
  unidadeCurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: "Sim" | "Não";
  semestre: number;
  estado: string;
  estadoId: number;

  dataEliminacao?: string | null; // opcional, pode ser null se não eliminado
}

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarHorariosExistentesResponse = {
  horarios: HorarioExistenteEliminado[];
};

/* ---------- SERVICE ---------- */
export async function listarHorariosExistentesEliminadosService(
  payload: ListarHorariosExistentesPayload,
): Promise<HorarioExistenteEliminado[]> {
  const {
    p_ano_lectivo,
    p_semestre,
    p_periodo,
    p_curso,
    p_ano_curricular,
  } = payload;

  const { data } = await axiosApexGa.get<ListarHorariosExistentesResponse>(
    "/horario/eliminados",
    {
      params: {
        p_ano_lectivo,
        p_semestre,
        p_periodo,
        p_curso,
        p_ano_curricular,
        p_unidade_curricular: "", 
        p_estado: "",
        p_afetacao_docente: "",
      },
    }
  );

  return data.horarios || [];
}
