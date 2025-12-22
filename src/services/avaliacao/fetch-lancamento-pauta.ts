
import { axiosNestGa } from "@/lib/axios-nest-ga";


export type LancamentoPauta = {
  codigo: number;
  ano_lectivo: string;
  designacao_av: string;
  descricao_av: string;
  estado_pauta_designacao:string;
  estado_pauta:number;
  classe: string;
  semestre: string;
  curso: string;
  created_at: string; 
  updated_at: string;
  active_state: number;
  ficheiro_name: string | null;
  fk_tipo_avaliacao: number;
  fk_user_validacao: number | null;
  docente_nome: string;
  codigo_docente: string;
  codigo_grade: number;
  unidade_curricular: string;
};

export type LancamentoPautaResponse = {
  data: LancamentoPauta[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FilterLancamentoPautaParams = {
  anoLectivo?: number;
  tipoAvaliacao?: number;
  codigoGrade?: number;
  anoCurricular?:number;
  semestre?:number;
  curso?:number;
  page?: number;
  limit?: number;
};
/**
 * Busca a lista de lançamentos de pauta com filtros e paginação
 * Rota: GET /api/assessment/lancamento/pauta
 */
export async function fetchLancamentosPauta(
  params: FilterLancamentoPautaParams = {}
): Promise<LancamentoPautaResponse> {
  const response = await axiosNestGa.get<LancamentoPautaResponse>(
    "/assessment/lancamento/pauta",
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