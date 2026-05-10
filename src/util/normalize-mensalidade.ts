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
): NormalizedMensalidade[] => {
  return monthlys
    .map((monthly) => {
      const status = Number(monthly.estado_fatura);
      const valorBase = status === 1 ? monthly.valor_pago : monthly.total;
      const desconto = Number(monthly.desconto);
      const mensalidade = Number(monthly.mensalidade);

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
        valorPago: String(monthly.valor_pago),
        tipoDesconto: "Percentual",
        mensalidade: formatNumber(monthly.mensalidade ?? 0),
        valorBase: valorBase,
        valorAPagar: String(monthly.total),
        multa: monthly.multa,
        desconto: monthly.desconto ?? 0,
        formaPagamento: null,
        dataPagamento: null,
        dueDate: monthly.data_vencimento,
        status: status,
        reference: monthly.reference,
        observacoes: descricaoDesconto,
        bolseiro: 1,
        mesId: monthly.mes_temp_id,
        id_item: monthly.id_item,
      };
    })
    .sort((a, b) => a.id - b.id);
};

export { normalizeMensalidade };
