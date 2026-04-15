import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InscritoPorUc = {
  numero: number;
  matricula: number | string;
  nome: string;
  tipo_aluno: string;
  curso: string;
  estado: string;
};

export type FetchInscritosPorUcResponse = {
  data: InscritoPorUc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchInscritosPorUcParams = {
  page: number;
  limit: number;
  anoLectivo?: number;
  curso?: number;
  anoCurricular?: number;
  semestre?: number;
  periodo?: number;
  cadeira?: number;
  horario?: number;
  estado?: number | string;
  search?: string;
};

export async function fetchInscritosPorUcService({
  page,
  limit,
  anoLectivo = 0,
  curso = 0,
  anoCurricular = 0,
  semestre = 0,
  periodo = 0,
  cadeira = 0,
  horario = 0,
  estado = 0,
  search = "",
}: FetchInscritosPorUcParams): Promise<FetchInscritosPorUcResponse> {
  const { data } = await axiosNestGa.get<FetchInscritosPorUcResponse>(
    "/registration/inscritos-por-uc",
    {
      params: {
        page,
        limit,
        anoLectivo,
        curso,
        anoCurricular,
        semestre,
        periodo,
        cadeira,
        horario,
        estado,
        search,
      },
    }
  );

  return data;
}