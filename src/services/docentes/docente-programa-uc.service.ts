import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListProgramaUCPayload = {
  anoLectivo: number;
  semestre: number;
  codigoCurso: number;
  anoCurricular: number;
  unidadeCurricular?: number;
  estado?: number;
  page?: number;
  limit?: number;
};

export type ProgramaUCItem = {
  codigo: number;
  anolectivo: string;
  docente: string;
  gradecurricular: string;
  codigo_estado: number;
  estado: string;
  datacriacao: string;
  dataactualizacao: string;
  arquivo: string;
};

export type ListProgramaUCResponse = {
  data: ProgramaUCItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListProgramaUCService(
  payload: ListProgramaUCPayload,
): Promise<ListProgramaUCResponse> {
  const {
    anoLectivo,
    semestre,
    codigoCurso,
    anoCurricular,
    unidadeCurricular,
    estado,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListProgramaUCResponse>(
    "/docentes/programa-uc",
    {
      params: {
        anoLectivo,
        semestre,
        codigoCurso,
        anoCurricular,
        unidadeCurricular,
        estado,
        page,
        limit,
      },
    },
  );

  return data;
}
