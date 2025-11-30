import { axiosApexGa } from "@/lib/axios-apex-ga";

/* ---------- PAYLOAD (Filtros) ---------- */
export type ListarHorariosExistentesPayload = {
  p_ano_lectivo: number | string;
  p_semestre: number | string;
  p_periodo: number | string;
  p_curso: number | string;
};

/* ---------- RESPONSE ITEM ---------- */
export type HorarioExistente = {
  codigo: number;
  designacao: string;
  unidadeCurricularId: number;
  unidadeCurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: number;
  estado: string;
  estadoId: number;
  disponibilidade: string;
  dataUltimaAtualizacao: string;
  dataCriacao: string;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarHorariosExistentesResponse = {
  horarios: HorarioExistente[];
};

/* ---------- SERVICE ---------- */
export async function listarHorariosExistentesService(
  payload: ListarHorariosExistentesPayload,
): Promise<HorarioExistente[]> {
  const { p_ano_lectivo, p_semestre, p_periodo, p_curso } = payload;

  const { data } = await axiosApexGa.get<ListarHorariosExistentesResponse>(
    "/horario/listar",
    {
      params: {
        p_ano_lectivo,
        p_semestre,
        p_periodo,
        p_curso,
      },
    },
  );

  return data.horarios || [];
}