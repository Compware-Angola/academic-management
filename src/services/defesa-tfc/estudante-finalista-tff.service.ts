import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstudanteFinalistaPayload = {
  search?: string;
  anoLectivo?: number;
  curso?: number;
  tipoCandidatura?: number;
  page?: number;
  limit?: number;
};

export type EstudanteFinalistaItem = {
  nome: string;
  bilhete: string;
  genero: string;
  matricula: number;
  curso: string;
};

export type EstudanteFinalistaResponse = {
  data: EstudanteFinalistaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getEstudanteFinalistaService(
  payload: EstudanteFinalistaPayload,
): Promise<EstudanteFinalistaResponse> {
  const {
    anoLectivo,
    curso,
    tipoCandidatura,
    page = 1,
    limit = 25,
    search
  } = payload;

  const { data } = await axiosNestGa.get<EstudanteFinalistaResponse>(
    "defense-management-tfc/students",
    {
      params: {
        search,
        anoLectivo,
        curso,
        tipoCandidatura,
        page,
        limit,
      },
    },
  );

  return data;
}
