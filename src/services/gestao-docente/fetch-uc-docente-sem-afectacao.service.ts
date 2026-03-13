export type UCDocenteSemAfectacao= {
  curso: string;
  codigo_disciplina: number;
  disciplina: string;
  semestre: string;
  classe: number;
};

export type UCDocenteSemAfectacaoMeta = {
  total: number;
  limit: number;
  totalPages: number;
  page: number;
};

export type UCDocenteSemAfectacaoResponse = {
  data: UCDocenteSemAfectacao[];
  meta: UCDocenteSemAfectacaoMeta;
};

export type UCDocenteSemAfectacaoPayload = {
  anoLectivoId?: number;
  cursoId?: number;
  semestreId?: number;
  classeId?: number;
  page?: number;
  limit?: number;
  search?:string
};


import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function fetchUCDocenteSemAfectacaoService(
  payload: UCDocenteSemAfectacaoPayload,
): Promise<UCDocenteSemAfectacaoResponse> {
  const {
    anoLectivoId,
    cursoId,
    semestreId,
    classeId,
    page = 1,
    limit = 10,
    search
  } = payload;

  const { data } = await axiosNestGa.get<UCDocenteSemAfectacaoResponse>(
    "/docente-gestao/sem-afetacao/uc",
    {
      params: {
        anoLectivoId,
        cursoId,
        semestreId,
        classeId,
        page,
        limit,
        search
      },
    },
  );

  return data;
}
