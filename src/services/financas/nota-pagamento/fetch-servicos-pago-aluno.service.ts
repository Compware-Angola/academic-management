import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type TipoPagamento = "TODOS" | "MENSALIDADES" | "SERVICOS";

export type ServicoPagoAluno = {
  codigo: number;
  servico: string;
  valor: number;
  data_pagamento_banco: string;
  data_validacao: string;
  ano_lectivo: number;
  codigo_servico: number;
};

export type FetchServicosPagosAlunoParams = {
  anoLectivo: number;
  codigoMatricula: number;
  tipo?: TipoPagamento;
};

export async function fetchServicosPagosAlunoService({
  anoLectivo,
  codigoMatricula,
  tipo = "TODOS",
}: FetchServicosPagosAlunoParams): Promise<ServicoPagoAluno[]> {
  const response = await axiosNestFinance.get<ServicoPagoAluno[]>(
    "/payment/servicos-pagos-aluno",
    {
      params: {
        anoLectivo,
        codigoMatricula,
        tipo,
      },
    }
  );


  return response.data;
}