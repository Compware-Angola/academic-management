import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DocentePauta = {
      codigo: number,
      anolectivo: string,
      docente: string,
      gradecurricular: string,
      estado: number,
      datacriacao: string,
      dataactualizacao: string,
      arquivo: string
};

export type DocentePautaResponse = {
  data: DocentePauta[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FilterDocentePautaParams = {
  anoLectivo: number;
  semestre: number;
  codigoCurso: number;
  docenteId?: number;
  anoCurricular: number;
  page?: number;
  limit?: number;
};
/**
 * Busca a lista de lançamentos de pauta com filtros e paginação
 * Rota: GET /api/docentes/programa-uc
 */
export async function fetchDocenteLancamentosPauta(
  params: FilterDocentePautaParams
): Promise<DocentePautaResponse> {
  const response = await axiosNestGa.get<DocentePautaResponse>(
    "docentes/programa-uc",
    { params }
  );

  return (
    response.data ?? {
      data: [],
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      total: 0,
      totalPages: 0,
    }
  );



  
}


// export async function fetchLancamentosUcSemPauta(
//   params: FilterLancamentoPautaParams = {}
// ): Promise<DocentePautaResponse> {
//   const response = await axiosNestGa.get<DocentePautaResponse>(
//     "/assessment/lancamento/uc-sem-pauta",
//     { params }
//   );

//   return (
//     response.data ?? {
//       data: [],
//       page: params.page ?? 1,
//       limit: params.limit ?? 20,
//       total: 0,
//       totalPages: 0,
//     }
//   );



  
// }

