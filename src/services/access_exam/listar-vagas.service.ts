import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListarVagasParams = {
  cursoId?: number;
  periodoId?: number;
  anoLetivoId?: number;
  page?: number;
  limit?: number;
};

export type Vaga = {
  id: number;
  curso_id: number;
  curso: string;
  cursosopcionais: string | null;
  periodo_id: number;
  periodo: string;
  ano_lectivo_id: number;
  ano_lectivo: string;
  num_vagas: number;
  vagas_disponiveis: number;
  created_at: string;
  updated_at: string | null;
};

export type ListarVagasResponse = {
  data: Vaga[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function listarVagas(params: ListarVagasParams) {
  const { data } = await axiosNestGa.get<ListarVagasResponse>("/vagas", {
    params,
  });

  return data;
}
