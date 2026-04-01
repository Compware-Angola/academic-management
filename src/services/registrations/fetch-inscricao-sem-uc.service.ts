import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListInscricaoSemUcPayload = {
  codigoAnoLectivo: number;
  codigoCurso: number;
  grade: number;
  page?: number;
  limit?: number;
};

export type InscricaoSemUcItem = {
  codigo: number;
  nomecompleto: string;
  curso: string;
  tipo: string;
};

export type ListInscricaoSemUcResponse = {
  data: InscricaoSemUcItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListInscricaoSemUcService(
  payload: ListInscricaoSemUcPayload,
): Promise<ListInscricaoSemUcResponse> {
  const {
    codigoAnoLectivo,
    codigoCurso,
    grade,
    page = 1,
    limit = 20,
  } = payload;

  const { data } = await axiosNestGa.get<ListInscricaoSemUcResponse>(
    "/registration/incricao-sem-uc",
    {
      params: {
        codigoAnoLectivo,
        codigoCurso,
        grade,
        page,
        limit,
      },
    },
  );

  return data;
}
