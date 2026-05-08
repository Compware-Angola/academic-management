
import { AlertCircle, Badge, Banknote, Calendar, CheckCircle, ChevronDown, ChevronUp, CreditCard, FileText, Info, Loader2, Receipt, Tag, Wallet } from "lucide-react";
import { useStudentClassInfo } from "@/hooks/students/use-query-students-class-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Button } from "react-day-picker";
import { useState } from "react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";

type Props = {
    codigoMatricula: number;
};
const getStatusBadge = (status: string) => {
    switch (status) {
        case "paid":
            return (
                <Badge className="bg-success/10 text-success hover:bg-success/20">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Pago
                </Badge>
            );
        case "pending":
            return (
                <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Pendente
                </Badge>
            );
        case "upcoming":
            return (
                <Badge className="">
                    <CreditCard className="mr-1 h-3 w-3" />
                    A vencer
                </Badge>
            );
        default:
            return null;
    }
};
const payments = [
    {
        id: 1,
        month: "Janeiro 2025",
        description: "Mensalidade - 1º Semestre",
        valorBase: "50.000,00 Kz",
        desconto: "5.000,00 Kz",
        tipoDesconto: "Desconto de pontualidade (10%)",
        valorPago: "45.000,00 Kz",
        valorAPagar: "0,00 Kz",
        multa: null,
        formaPagamento: "Referência Multicaixa",
        dataPagamento: "2025-01-08",
        dueDate: "2025-01-10",
        status: "paid",
        reference: "REF-2025-01-001",
        observacoes: "Pagamento efectuado dentro do prazo",
    },
    {
        id: 2,
        month: "Fevereiro 2025",
        description: "Mensalidade - 1º Semestre",
        valorBase: "50.000,00 Kz",
        desconto: "5.000,00 Kz",
        tipoDesconto: "Desconto de pontualidade (10%)",
        valorPago: "45.000,00 Kz",
        valorAPagar: "0,00 Kz",
        multa: null,
        formaPagamento: "Transferência Bancária",
        dataPagamento: "2025-02-09",
        dueDate: "2025-02-10",
        status: "paid",
        reference: "REF-2025-02-001",
        observacoes: "Pagamento efectuado dentro do prazo",
    },
    {
        id: 3,
        month: "Março 2025",
        description: "Mensalidade - 1º Semestre",
        valorBase: "50.000,00 Kz",
        desconto: "0,00 Kz",
        tipoDesconto: null,
        valorPago: "0,00 Kz",
        valorAPagar: "50.000,00 Kz",
        multa: "2.500,00 Kz",
        formaPagamento: null,
        dataPagamento: null,
        dueDate: "2025-03-10",
        status: "pending",
        reference: null,
        observacoes: "Pagamento em atraso - multa aplicada",
    },
    {
        id: 4,
        month: "Abril 2025",
        description: "Mensalidade - 2º Semestre",
        valorBase: "50.000,00 Kz",
        desconto: "5.000,00 Kz",
        tipoDesconto: "Desconto de pontualidade (10%)",
        valorPago: "0,00 Kz",
        valorAPagar: "45.000,00 Kz",
        multa: null,
        formaPagamento: null,
        dataPagamento: null,
        dueDate: "2025-04-10",
        status: "upcoming",
        reference: null,
        observacoes: null,
    },
];

export function MensalidadesSection({ codigoMatricula }: Props) {

    const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
    const [anoLetivo, setAnoLetivo] = useState<string | null>(null);


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
                {payments.map((payment) => (
                    <div
                        key={payment.id}
                        className="rounded-lg border transition-colors overflow-hidden"
                    >
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setExpandedPayment(expandedPayment === payment.id ? null : payment.id)}
                        >
                            <div className="space-y-1">
                                <p className="font-medium">{payment.month}</p>
                                <p className="text-sm text-muted-foreground">{payment.description}</p>
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
                                            <p className="text-xs text-muted-foreground">Valor Base</p>
                                            <p className="text-sm font-medium">{payment.valorBase}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Desconto</p>
                                            <p className="text-sm font-medium text-success">{payment.desconto}</p>
                                            {payment.tipoDesconto && (
                                                <p className="text-xs text-muted-foreground">{payment.tipoDesconto}</p>
                                            )}
                                        </div>
                                    </div>
                                    {payment.multa && (
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Multa</p>
                                                <p className="text-sm font-medium text-destructive">{payment.multa}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <Wallet className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Valor Pago</p>
                                            <p className="text-sm font-medium">{payment.valorPago}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Valor a Pagar</p>
                                            <p className="text-sm font-bold">{payment.valorAPagar}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Vencimento</p>
                                            <p className="text-sm font-medium">{new Date(payment.dueDate).toLocaleDateString('pt-AO')}</p>
                                        </div>
                                    </div>
                                    {payment.formaPagamento && (
                                        <div className="flex items-start gap-2">
                                            <Receipt className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Forma de Pagamento</p>
                                                <p className="text-sm font-medium">{payment.formaPagamento}</p>
                                            </div>
                                        </div>
                                    )}
                                    {payment.dataPagamento && (
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Data de Pagamento</p>
                                                <p className="text-sm font-medium">{new Date(payment.dataPagamento).toLocaleDateString('pt-AO')}</p>
                                            </div>
                                        </div>
                                    )}
                                    {payment.reference && (
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Referência</p>
                                                <p className="text-sm font-medium">{payment.reference}</p>
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
                                                <p className="text-xs text-muted-foreground">Observações</p>
                                                <p className="text-sm">{payment.observacoes}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {!payment.reference && payment.status !== "paid" && (
                                    <>
                                        <Separator />
                                        <Button
                                            className="bg-green-500 hover:bg-green-600 text-white"

                                        >
                                            <Receipt className="mr-2 h-4 w-4" />
                                            Gerar Referência
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}