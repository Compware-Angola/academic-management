import {
  AlertCircle,
  Banknote,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Info,
  Loader2,
  Receipt,
  Tag,
  Wallet,
} from "lucide-react";

import { Separator } from "@radix-ui/react-separator"; // FIX: estava a importar de @radix-ui/react-select
import { Badge } from "@/components/ui/badge"; // FIX: Badge não existe em lucide-react
import { useEffect, useMemo, useState } from "react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { useQueryFinanceMonthlyFee } from "@/hooks/financas/isencao-servico/use-query-finance-monthly-fee";
import { normalizeMensalidade } from "@/util/normalize-mensalidade";
import { InvoiceEnum } from "@/enums/invoice.enum";
import Lottie from "lottie-react";
import TimeLoader from "@/assets/timeloader.json";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNumber } from "@/util/format-number";
import { Button } from "@/components/ui/button";
import { useQueryMonthlyFeesValue } from "@/hooks/financas/use-query-monthly-value";
import { parseFilter } from "@/util/parse-filter";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { createInvoice, createItem } from "@/util/create-item";
import { toast } from "sonner";
import { useCreateInvoiceNoJob } from "@/hooks/financas/invoice/use-create-no-job-mutation";
import { useQueryDiscountBySigla } from "@/hooks/financas/descontos/use-query-discount-by-sigla";
import { DiscountSigla } from "@/enums/discount-sigla.enum";
import {
  calcAnnualDiscount,
  canApplyAnnualDiscount,
} from "../helpers/discount";
import { MensalidadeSummary } from "./MensalidadeSummary";

export type SelectedPayment = {
  mesTempId: number;
  valorAPagar: number;
  multa: number;
  desconto: number;
  mesTempDesc: string;
};

type Props = {
  codigoMatricula: number;
};

const getStatusBadge = (status: number) => {
  switch (status) {
    case InvoiceEnum.PAGO:
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Pago
        </Badge>
      );
    case InvoiceEnum.PENDENTE:
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <AlertCircle className="mr-1 h-3 w-3" />
          Pendente
        </Badge>
      );
    case InvoiceEnum.ISENTO:
      return (
        <Badge>
          <CreditCard className="mr-1 h-3 w-3" />
          Isento
        </Badge>
      );
    default:
      return null;
  }
};

export function MensalidadesSection({ codigoMatricula }: Props) {
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
  const [anoLetivo, setAnoLetivo] = useState<string | null>("23");
  const [selectedPayments, setSelectedPayments] = useState<
    Map<number, SelectedPayment>
  >(new Map());

  const totalSelecionado = useMemo(() => {
    return Array.from(selectedPayments.values()).reduce(
      (total, payment) => total + (payment.valorAPagar ?? 0),
      0,
    );
  }, [selectedPayments]);

  const toggleSelectPayment = ({
    mesTempDesc,
    mesTempId,
    multa,
    valorAPagar,
    desconto,
  }: SelectedPayment) => {
    setSelectedPayments((prev) => {
      const next = new Map(prev);
      if (next.has(mesTempId)) {
        next.delete(mesTempId);
      } else {
        next.set(mesTempId, {
          mesTempId,
          valorAPagar,
          mesTempDesc,
          multa,
          desconto,
        });
      }
      return next;
    });
  };

  const {
    data: monthResponse,
    isLoading: isMonthLoading,
    isFetching: isMonthFetching,
  } = useQueryFinanceMonthlyFee({
    academicYear: anoLetivo,
    enrollmentCode: codigoMatricula.toString(),
    status: "all",
    limit: 100,
    page: 1,
  });

  const { data: student } = useStudentDetail(codigoMatricula);
  const { mutate: criarFactura, isPending } = useCreateInvoiceNoJob();
  const { data: desc5Data } = useQueryDiscountBySigla(
    DiscountSigla.DESC5_ANUID,
  );

  //============================= DESCONTOS ====================================
  const deveAplicarDesc5 = useMemo(
    () => canApplyAnnualDiscount(desc5Data, selectedPayments),
    [desc5Data, selectedPayments],
  );

  const valorDesc5 = deveAplicarDesc5
    ? calcAnnualDiscount(totalSelecionado, desc5Data![0].taxa)
    : 0;
  console.log(deveAplicarDesc5);
  //============================= FIM DESCONTOS ====================================

  const queryParams = useMemo(() => {
    if (!anoLetivo || !student?.curso_codigo) return null;

    return {
      anoLectivoId: parseFilter(anoLetivo),
      cursoId: student.curso_codigo,
      poloId: 1,
    };
  }, [anoLetivo, student?.curso_codigo]);

  const { data: monthValueResponse, isLoading: isMonthValueLoading } =
    useQueryMonthlyFeesValue(queryParams);
  useEffect(() => {
    setSelectedPayments(new Map());
    setExpandedPayment(null);
  }, [codigoMatricula, anoLetivo]);

  const monthFee = monthValueResponse?.[0];
  const data = monthResponse?.data ?? [];
  const payments = normalizeMensalidade(data, monthFee?.preco ?? 0);

  const handleCreateInvoice = () => {
    if (!monthFee?.codigo) {
      toast.error("Erro ao gerar factura: valor mensal não encontrado");
      return;
    }

    if (selectedPayments.size === 0) {
      toast.warning("Seleccione pelo menos uma mensalidade");
      return;
    }

    const selectedList = Array.from(selectedPayments.values());

    const totalMulta = selectedList.reduce(
      (total, payment) => total + (payment.multa ?? 0), // FIX: fallback
      0,
    );
    const totalDesconto = deveAplicarDesc5
      ? valorDesc5
      : selectedList.reduce(
          (total, payment) => total + (payment.desconto ?? 0), // FIX: fallback
          0,
        );

    const items = selectedList.map((payment) => {
      return createItem({
        multa: payment.multa ?? 0,
        valorDesconto: payment.desconto,
        codigo: monthFee.codigo,
        descricao: `Mensalidade ${payment.mesTempDesc}`,
        preco: payment.valorAPagar,
        mesTempId: payment.mesTempId,
      });
    });

    let totalApagar = deveAplicarDesc5
      ? totalSelecionado - valorDesc5
      : totalSelecionado;

    const invoice = createInvoice({
      codigoMatricula: codigoMatricula,
      poloid: 1,
      totalApagar: totalApagar,
      total: totalSelecionado,
      totalDesconto: totalDesconto,
      totalMulta: totalMulta,
      itens: items,
    });

    criarFactura(invoice, {
      onSuccess: () => {
        setSelectedPayments(new Map());
        toast.success("Nota de Pagamento gerada com sucesso!");
      },
      onError: () => {
        // FIX: feedback de erro na mutação
        toast.error("Erro ao gerar a factura. Tente novamente.");
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Título e Descrição */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Mensalidades
            </h2>
            <p className="text-muted-foreground mt-1">
              Histórico de pagamentos, mensalidades pendentes e recibos
            </p>

            {/* FIX: mostrar loader enquanto carrega o valor mensal */}
            {isMonthValueLoading ? (
              <div className="flex items-center gap-1 mt-1">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  A carregar valor...
                </span>
              </div>
            ) : monthFee ? (
              <p className="text-base mt-1 text-destructive font-medium">
                {monthFee.descricao}{" "}
                <span className="font-bold">{monthFee.preco} kz</span>
              </p>
            ) : anoLetivo ? (
              // FIX: feedback quando não há valor configurado para o ano/curso
              <p className="text-sm mt-1 text-muted-foreground italic">
                Valor mensal não configurado para este curso
              </p>
            ) : null}
          </div>

          {/* Seletor de Ano Letivo */}
          <div className="min-w-[220px] sm:w-auto sm:flex-shrink-0">
            <AcademicYearSelect
              enableDefaultActiveYear
              value={anoLetivo}
              onChangeValue={(v) => setAnoLetivo(v)}
            />
          </div>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="space-y-4">
        {isMonthLoading ? (
          <div className="h-[300px]">
            <div className="flex justify-center items-center">
              <Lottie
                animationData={TimeLoader}
                loop={true}
                style={{ width: 200, height: 200 }}
              />
            </div>
            <p className="text-center">A processar...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-lg border transition-colors overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  setExpandedPayment(
                    expandedPayment === payment.id ? null : payment.id,
                  )
                }
              >
                <div className="space-y-1 flex items-center">
                  <div
                    className="w-[50px]"
                    // FIX: impede que o clique no checkbox expanda/colapsa o row
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      disabled={payment.status !== 0 || payment.id_item !== 0}
                      checked={selectedPayments.has(payment.id)}
                      onCheckedChange={() =>
                        toggleSelectPayment({
                          mesTempId: payment.mesId,
                          mesTempDesc: payment.month,
                          multa: payment.multa ?? 0,
                          valorAPagar: Number(payment.valorAPagar),
                          desconto: payment.desconto ?? 0,
                        })
                      }
                      // FIX: title só quando há motivo real, sem passar null
                      title={
                        payment.id_item !== 0
                          ? "Já foi gerada a factura desta mensalidade"
                          : payment.status !== 0
                            ? "Esta mensalidade não está pendente"
                            : undefined
                      }
                    />
                  </div>
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right space-y-2">
                    <p className="font-bold">
                      {formatNumber(Number(payment.valorAPagar))}
                    </p>
                    {getStatusBadge(payment.status)}
                  </div>
                  {expandedPayment === payment.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedPayment === payment.id && (
                <div className="border-t bg-muted/30 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <Banknote className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor Base
                        </p>
                        <p className="text-sm font-medium">
                          {formatNumber(payment.valorBase ?? 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Desconto
                        </p>
                        <p className="text-sm font-medium text-success">
                          {formatNumber(payment.desconto ?? 0)}
                        </p>
                        {payment.tipoDesconto && (
                          <p className="text-xs text-muted-foreground">
                            {payment.tipoDesconto}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* FIX: só renderiza multa se for > 0 */}
                    {payment.multa > 0 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
                        <div>
                          <p className="text-xs text-muted-foreground">Multa</p>
                          <p className="text-sm font-medium text-destructive">
                            {formatNumber(payment.multa)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <Wallet className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor Pago
                        </p>
                        <p className="text-sm font-medium">
                          {/* FIX: formata consistentemente */}
                          {payment.valorPago != null
                            ? formatNumber(Number(payment.valorPago))
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor a Pagar
                        </p>
                        <p className="text-sm font-bold">
                          {formatNumber(Number(payment.valorAPagar))}
                        </p>
                      </div>
                    </div>

                    {payment.dueDate && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Vencimento
                          </p>
                          <p className="text-sm font-medium">
                            {/* FIX: guarda contra data inválida */}
                            {isNaN(new Date(payment.dueDate).getTime())
                              ? "—"
                              : new Date(payment.dueDate).toLocaleDateString(
                                  "pt-AO",
                                )}
                          </p>
                        </div>
                      </div>
                    )}

                    {payment.formaPagamento && (
                      <div className="flex items-start gap-2">
                        <Receipt className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Forma de Pagamento
                          </p>
                          <p className="text-sm font-medium">
                            {payment.formaPagamento}
                          </p>
                        </div>
                      </div>
                    )}

                    {payment.reference && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Referência
                          </p>
                          <p className="text-sm font-medium">
                            {payment.reference}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {payment.data_operacao && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Data de Pagamento
                        </p>
                        <p className="text-sm font-medium">
                          {/* FIX: guarda contra data inválida */}
                          {isNaN(new Date(payment.data_operacao).getTime())
                            ? "—"
                            : new Date(
                                payment.data_operacao,
                              ).toLocaleDateString("pt-AO")}
                        </p>
                      </div>
                    </div>
                  )}

                  {payment.observacoes && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Observações
                          </p>
                          <p className="text-sm">{payment.observacoes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com total e botão */}
      {/*
      <div className="flex items-center justify-between border-t pt-6">
        <div>
          {deveAplicarDesc5 && (
            <div>
              <p className="text-sm">
                Subtotal:{" "}
                <span className=" font-bold text-primary">
                  {formatNumber(totalSelecionado)} Kz
                </span>{" "}
              </p>
              <p className="text-sm">
                Desconto:{" "}
                <span className=" font-bold text-success">
                  {formatNumber(valorDesc5)} Kz
                </span>
              </p>
              <p className="text-lg">
                Total a pagar:{" "}
                <span className="text-2xl font-bold text-primary">
                  {formatNumber(totalSelecionado - valorDesc5)} Kz
                </span>
              </p>
            </div>
          )}
          {!deveAplicarDesc5 && (
            <div>
              <span className="text-lg">Total a pagar: </span>
              <span className="text-2xl font-bold text-primary">
                {formatNumber(totalSelecionado)} KZ
              </span>
            </div>
          )}

          {selectedPayments.size > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedPayments.size}{" "}
              {selectedPayments.size === 1
                ? "mensalidade selecionada"
                : "mensalidades selecionadas"}
            </p>
          )}
        </div>

        <Button
          className="gap-2"
          size="lg"
          onClick={handleCreateInvoice}
          disabled={selectedPayments.size === 0 || isPending || isMonthFetching}
        >
          {isPending || isMonthFetching ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />A processar...
            </>
          ) : (
            <>
              <Receipt className="h-5 w-5" />
              Gerar Factura
            </>
          )}
        </Button>
      </div>
      */}
      <MensalidadeSummary
        selectedCount={selectedPayments.size}
        totalSelecionado={totalSelecionado}
        deveAplicarDesc5={deveAplicarDesc5}
        valorDesc5={valorDesc5}
        descTaxa={desc5Data?.[0]?.taxa ?? 5}
        isPending={isPending}
        isMonthFetching={isMonthFetching}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
}
