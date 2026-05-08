import {
  AlertCircle,
  Badge,
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

import { Separator } from "@radix-ui/react-select";
import { useMemo, useState } from "react";
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
import { useCreateInvoice } from "@/hooks/financas/invoice/use-create-mutation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SelectedPayment = {
  mesTempId: number;
  valorBase: number;
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
        <Badge className="">
          <CreditCard className="mr-1 h-3 w-3" />A vencer
        </Badge>
      );
    default:
      return null;
  }
};

export function MensalidadesSection({ codigoMatricula }: Props) {
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
  const [anoLetivo, setAnoLetivo] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<
    Map<number, SelectedPayment>
  >(new Map());
  const totalSelecionado = useMemo(() => {
    return Array.from(selectedPayments.values()).reduce(
      (total, payment) => total + payment.valorBase,
      0,
    );
  }, [selectedPayments]);
  const toggleSelectPayment = (
    mesTempId: number,
    valorBase: number,
    mesTempDesc: string,
  ) => {
    setSelectedPayments((prev) => {
      const next = new Map(prev);

      if (next.has(mesTempId)) {
        next.delete(mesTempId);
      } else {
        next.set(mesTempId, {
          mesTempId,
          valorBase,
          mesTempDesc,
        });
      }

      return next;
    });
  };

  const { data: monthResponse, isLoading: isMonthLoading } =
    useQueryFinanceMonthlyFee({
      academicYear: anoLetivo,
      enrollmentCode: codigoMatricula.toString(),
      status: "all",
      limit: 100,
      page: 1,
    });

  const { data: student } = useStudentDetail(codigoMatricula);
  const { mutate: criarFactura, isPending } = useCreateInvoice();

  const { data: monthValueResponse, isLoading: isMonthValueLoading } =
    useQueryMonthlyFeesValue({
      anoLectivoId: parseFilter(anoLetivo),
      cursoId: student?.curso_codigo,
      poloId: 1,
    });

  const data = monthResponse?.data ?? [];
  const payments = normalizeMensalidade(data);
  const monthFee = monthValueResponse?.[0];

  const handleCreateInvoice = () => {
    if (!monthFee?.codigo) {
      toast.error("Erro ao gerar factura");
      return;
    }
    const items = Array.from(selectedPayments.values()).map((payment) =>
      createItem({
        codigo: monthFee.codigo,
        descricao: `Mensalidade ${payment.mesTempDesc}`,
        preco: payment.valorBase,
        mesTempId: payment.mesTempId,
      }),
    );
    const invoice = createInvoice({
      codigoMatricula: codigoMatricula,
      poloid: 1,
      totalApagar: totalSelecionado,
      itens: items,
    });
    criarFactura(invoice, {
      onSuccess: () => {
        setSelectedPayments(new Map());
        toast.success("Nota de Pagamento gerada com sucesso!");
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
            {!isMonthValueLoading}{" "}
            {
              <p className="text-muted-foreground text-base mt-1">
                {monthFee?.descricao ?? "-"} {monthFee?.preco ?? "-"}
              </p>
            }
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
            <p className="text-center">Processado...</p>
          </div>
        ) : payments.length == 0 ? (
          <>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Nenhum registo encontrado
              </p>
              <p className="text-sm text-muted-foreground">
                Utilize os filtros acima para pesquisar
              </p>
            </div>
          </>
        ) : (
          <>
            {payments.map((payment) => (
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
                    <div className="w-[50px]">
                      <Checkbox
                        disabled={payment.status != 0 || payment.id_item != 0}
                        checked={selectedPayments.has(payment.id)}
                        onCheckedChange={() =>
                          toggleSelectPayment(
                            payment.mesId,
                            Number(payment.valorBase),
                            payment.month,
                          )
                        }
                        title={
                          payment.id_item != 0
                            ? "Já foi gerada a factura mensalidade"
                            : null
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
                      <p className="font-bold">{payment.valorBase}</p>
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
                            {payment.valorBase}
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
                            {payment.desconto}
                          </p>
                          {payment.tipoDesconto && (
                            <p className="text-xs text-muted-foreground">
                              {payment.tipoDesconto}
                            </p>
                          )}
                        </div>
                      </div>
                      {payment.multa && (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Multa
                            </p>
                            <p className="text-sm font-medium text-destructive">
                              {payment.multa}
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
                            {payment.valorPago}
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
                            {payment.valorAPagar}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Vencimento
                          </p>
                          <p className="text-sm font-medium">
                            {new Date(payment.dueDate).toLocaleDateString(
                              "pt-AO",
                            )}
                          </p>
                        </div>
                      </div>
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
                      {payment.dataPagamento && (
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Data de Pagamento
                            </p>
                            <p className="text-sm font-medium">
                              {new Date(
                                payment.dataPagamento,
                              ).toLocaleDateString("pt-AO")}
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
                    {/* {payment.status == 1 && (
                      <>
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          <Receipt className="mr-2 h-4 w-4" />
                          Gerar Referência
                        </Button>
                      </>
                    )} */}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex items-center justify-between border-t pt-6">
        <div>
          <span className="text-lg">Total a pagar: </span>
          <span className="text-2xl font-bold text-primary">
            {formatNumber(totalSelecionado) + " KZ"}
          </span>
        </div>

        <Button
          className="gap-2"
          size="lg"
          onClick={() => handleCreateInvoice()}
          disabled={selectedPayments.size == 0}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Receipt className="h-5 w-5" />
          )}
          Gerar Factura
        </Button>
      </div>
    </div>
  );
}
