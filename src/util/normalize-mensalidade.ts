import { Mensalidade } from "@/services/financas/isencao-servicos/get-finance.service";
import { formatNumber } from "./format-number";

interface NormalizedMensalidade {
  id: number;
  month: string;

  description: string;
  valorBase: number;
  mensalidade: string;
  desconto: number;
  tipoDesconto: string;
  valorPago: string;
  valorAPagar: string;
  multa: number;
  formaPagamento: string | null;
  dataPagamento: string | null;
  data_operacao: string | null;

  dueDate: string | null;
  status: number;
  reference: string | null;
  observacoes: string | null;
  bolseiro: number;
  mesId: number;
  id_item: number | undefined;
}

const normalizeMensalidade = (
  monthlys: Mensalidade[],
  monthFeePrice: number
): NormalizedMensalidade[] => {
  return monthlys
    .map((monthly) => {
      const status = Number(monthly.estado_fatura);
      const valorBase = monthFeePrice;
      const valorPago = status === 1 ? String(monthly.valor_pago) : "0.00";
      const desconto = Number(monthly.desconto);
      const mensalidade = Number(monthly.mensalidade);
      const valorAPagar = String(monthly.total);

      const percentualDesconto =
        mensalidade > 0 ? (desconto / mensalidade) * 100 : 0;

      const descricaoDesconto =
        desconto > 0
          ? ` Pagamento aplicado desconto de ${percentualDesconto.toFixed(0)}%`
          : null;

      return {
        id: monthly.mes_temp_id,
        month: monthly.mes,
        description: `Mensalidade - ${monthly.semestre} º Semestre`,
        valorPago: valorPago,
        valorBase: valorBase,
        tipoDesconto: "Percentual",
        mensalidade: formatNumber(monthly.mensalidade ?? 0),
        valorAPagar: valorAPagar,
        multa: monthly.multa,
        desconto: monthly.desconto ?? 0,
        formaPagamento: null,
        data_operacao: monthly.data_operacao,

        dueDate: monthly.data_vencimento,
        status: status,
        reference: monthly.reference,
        observacoes: descricaoDesconto,
        bolseiro: 1,
        mesId: monthly.mes_temp_id,
        id_item: monthly.id_item,
        dataPagamento: status === 1 ? (monthly.data_pagamento ?? null) : null
      };
    })
    .sort((a, b) => a.id - b.id);
};
export { normalizeMensalidade };
