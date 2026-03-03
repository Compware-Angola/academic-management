import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListProgramasSemUCPayload = {
  anoLectivo: number;
  semestre: number;
  codigoCurso: number;
  anoCurricular: number;
  page?: number;
  limit?: number;
};

export type ProgramaSemUCItem = {
  codigo: number;
  disciplina: string;
  semestre: string;
  curso: string;
};

export type ListProgramasSemUCResponse = {
  data: ProgramaSemUCItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListProgramasSemUCService(
  payload: ListProgramasSemUCPayload,
): Promise<ListProgramasSemUCResponse> {
  const {
    anoLectivo,
    semestre,
    codigoCurso,
    anoCurricular,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListProgramasSemUCResponse>(
    "/docentes/programas-sem-ucs",
    {
      params: {
        anoLectivo,
        semestre,
        codigoCurso,
        anoCurricular,

        page,
        limit,
      },
    },
  );

  return data;
}
