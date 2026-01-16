import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type TipoServicoItem = {
  codigo: number;
  sigla: string;
  descricao: string;
  preco: number;
  tiposervico: string;
  codigo_ano_lectivo: number;
  estado: string;
  data: string;
  datacriacao: string;
  disponibilizar_aluno: string | null;
  visualizar_no_portal: string;
  polo_id: number;
  canal: number;
  mestrado: string;
  codigo_grade_currilular: number | null;
  tipo_candidatura: number;
};

export type FetchTipoServicoPayload = {
  sigla?: string;
  descricao?: string;
  codigoAnoLectivo?: number;
  estado?: string;
  tipoServico?: string;
  visualizarNoPortal?: string;
};

export async function fetchTiposServico(
  payload: FetchTipoServicoPayload
): Promise<TipoServicoItem[]> {
  const { data } = await axiosNestFinance.get("/type-service", {
    params: {
      sigla: payload.sigla,
      descricao: payload.descricao,
      codigoAnoLectivo: payload.codigoAnoLectivo,
      estado: payload.estado,
      tipoServico: payload.tipoServico,
      visualizarNoPortal: payload.visualizarNoPortal,
    },
  });

  return data ?? [];
}
