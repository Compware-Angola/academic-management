import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- RESPONSE ITEM ---------- */
export type Solicitacao = {
  codigo_solicitacao: number;
  matricula: number;
  nome: string;
  curso: string;
  servico: string;
  data_solicitacao: string;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarAllSolicitacoesResponse = {
  data: Solicitacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- PARAMS ---------- */
type ListarAllSolicitacoesParams = {
  page: number;
  limit: number;
  estadoSolicitacao: string;
  tipoServicoSelecionado: number;
  userId: number;
  searchServico?: string;
};

/* ---------- SERVICE ---------- */
export async function listarAllSolicitacoesService({
  page,
  limit,
  estadoSolicitacao,
  tipoServicoSelecionado,
  userId,
  searchServico,
}: ListarAllSolicitacoesParams): Promise<ListarAllSolicitacoesResponse> {
  const { data } = await axiosNestGa.get<ListarAllSolicitacoesResponse>(
    "/solicitacoa/all-solicitacoes",
    {
      params: {
        page,
        limit,
        estadoSolicitacao,
        tipoServicoSelecionado,
        userId,
        searchServico,
      },
    }
  );

  return data;
}