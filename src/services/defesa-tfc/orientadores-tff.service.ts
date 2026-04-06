import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstudanteFinalistaPayload = {
  anoLectivoId?: number;
  cursoId?: number;
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
};

export type OrientadoresItem = {
  codigo: number
  curso: string
  nome_orientador: string
  numero_orientados: number
  ano_lectivo: string
  estado: string
  criado_por: string
  data_cadastro: string
};

export type OrientadoresResponse = {
  data: OrientadoresItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getOrientadoresService(
  payload: EstudanteFinalistaPayload,
): Promise<OrientadoresResponse> {
  const {
    anoLectivoId,
    cursoId,
    estado,
    page = 1,
    limit = 25,
    search
  } = payload;

  const { data } = await axiosNestGa.get<OrientadoresResponse>(
    "defense-management-tfc/orientadores",
    {
      params: {
        anoLectivoId,
        cursoId,
        estado,
        page,
        limit,
        search
      },
    },
  );

  return data;
}
