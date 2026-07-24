import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  CreditCard,
  FileText,
  MapPin,
  Calendar,
  ArrowLeft,
  HandCoins,
  Wallet,
  Hash,
  Banknote,
  AlertTriangle,
  Tag,
  Coins,
  CalendarCheck,
  Landmark,
  Receipt,
} from "lucide-react";
import Lottie from "lottie-react";
import TimeLoader from "@/assets/timeloader.json";
import { formatarData } from "@/util/date-formate";
import {
  useQueryFacturaItens,
  useQueryFacturas,
} from "@/hooks/horario/use-query-invoice";
import { formatNumber } from "@/util/format-number";
import { Button } from "@/components/ui/button";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";

import {
  defaultHeaderComprovativoPagamentoV2,
  GenericComprovativoPagamentoPDF,
} from "@/components/views/pdf/genericComprovativoPagamento-v2";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { createPaymentItem } from "@/util/export-payment";

interface ListaPagamentoModalProps {
  factureId: number;
  isModalOpen: boolean;
  pagamentoItem: PaymentItem;
  setIsModalOpen: () => void;
}
export const ListaPagamentoModal = ({
  isModalOpen,
  factureId,
  pagamentoItem,
  setIsModalOpen,
}: ListaPagamentoModalProps) => {
  const { data: facturaItens, isLoading: isLoadingFacturaItens } =
    useQueryFacturaItens(factureId);
  const { data: facturaResponse, isLoading: isLoadingFactura } =
    useQueryFacturas(
      {
        codigoFatura: factureId,
      },
      !!factureId,
    );

  const factura = facturaResponse?.data?.[0];

  const { data: student, isLoading: isLoadingStudent } = useStudentDetail(
    factura?.codigo_matricula,
  );
  const isLoading =
    isLoadingFacturaItens || isLoadingFactura || isLoadingStudent;

  const baseFileName = `Detalhes_Pagamento_${factura?.codigo || factureId}_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const doc = (
    <GenericComprovativoPagamentoPDF
      header={defaultHeaderComprovativoPagamentoV2}
      data={createPaymentItem({
        facturaItems: facturaItens?.data ?? [],
        payment: pagamentoItem,
        student: student,
        factura: factura,
      })}
    />
  );
  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Detalhes do Pagamento - {factura?.referencia}
            </DialogTitle>
            {factura && facturaItens?.data && student && (
              <div className="flex flex-wrap gap-2 pt-2">
                {doc && <PDFActions document={doc} fileName={baseFileName} />}
              </div>
            )}
          </DialogHeader>
          {isLoading ? (
            <div className="h-[300px]">
              <div className="flex justify-center items-center">
                <Lottie
                  animationData={TimeLoader}
                  loop={true}
                  style={{ width: 200, height: 200 }}
                />
              </div>
              <p className="text-center">Carregamento Pagamento...</p>
            </div>
          ) : factura ? (
            <div className="space-y-6">
              {/* Dados do Estudante */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <User className="h-5 w-5 text-primary" />
                  Dados do Estudante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Código da Matrícula
                    </p>
                    <p className="font-medium">{factura?.codigo_matricula}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-medium">{factura?.nome_aluno}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" /> Curso
                    </p>
                    <p className="font-medium">{factura?.curso}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Campus
                    </p>
                    <p className="font-medium">{factura?.polo}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalhes do Pagamento */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Detalhes do Pagamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Hash className="h-4 w-4" /> Referência
                    </p>
                    <p className="font-mono font-medium">
                      {factura?.referencia}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Banknote className="h-4 w-4" /> Valor Total Liquido
                    </p>
                    <p className="font-medium text-lg text-primary">
                      {factura?.total_preco}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Valor da Multa
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.total_multa)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Valor de Desconto
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.desconto)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Coins className="h-4 w-4" /> Valor Total
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.valor_pagar)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Data de Factura
                    </p>
                    <p className="font-medium">
                      {formatarData(factura?.data_factura)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CalendarCheck className="h-4 w-4" /> Data Registro
                    </p>
                    <p className="font-medium">
                      {formatarData(factura?.data_banco)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <HandCoins className="h-4 w-4" /> Caixa
                    </p>
                    <p className="font-medium">
                      {factura?.caixa || "Indefinido"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Landmark className="h-4 w-4" /> Número da Operação
                      Bancária
                    </p>
                    <p className="font-medium">
                      {factura?.n_operacao_bancaria || "---"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Landmark className="h-4 w-4" /> Número da 2ª Operação
                      Bancária
                    </p>
                    <p className="font-medium">
                      {factura?.n_operacao_bancaria2 || "---"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-4 w-4" /> Forma de Pagamento
                    </p>
                    <p className="font-medium">
                      {factura?.forma_pagamento || "Indefinido"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Receipt className="h-4 w-4" /> Tipo de Pagamento
                    </p>
                    <p className="font-medium">
                      {factura?.tipo_pagamento || "Indefinido"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-4 w-4" /> Nome do Operador
                    </p>
                    <p className="font-medium">
                      {factura?.nome_utilizador_pagamento || "Indefinido"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Serviços */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  Serviços
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Factura Referente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturaItens?.data?.map((item) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          {item?.descricaoservico}
                          {item?.mesdescricao && item?.mesid !== 0 && item?.prestacao > 0
                            ? `(${item.mesdescricao})`
                            : ""}
                          {item?.cadeiras_recurso_epoca_especial
                            ? ` (${item.cadeiras_recurso_epoca_especial})`
                            : ""}
                        </TableCell>
                        <TableCell className="font-mono">
                          {item?.codigofactura}
                        </TableCell>
                        <TableCell>{item?.total}</TableCell>
                        <TableCell>{item?.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-lg">
                Detalhes da factura não encontrada.
              </p>
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => setIsModalOpen()}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos pagamentos
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
