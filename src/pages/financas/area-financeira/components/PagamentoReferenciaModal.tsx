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
import { useMemo } from "react";
import {
  User,
  GraduationCap,
  CreditCard,
  FileText,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

import { ReferenciasPagamentoItem } from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";
import { PagamentoReferenciaStatus } from "./PagamentoReferenciaStastus";
import { formatarData } from "@/util/date-formate";
import { useQueryFacturaItens } from "@/hooks/horario/use-query-invoice";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

interface PagamentoReferenciaModalProps {
  selectedPagamento: ReferenciasPagamentoItem;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const PagamentoReferenciaModal = ({
  isModalOpen,
  selectedPagamento,
  setIsModalOpen,
}: PagamentoReferenciaModalProps) => {
  const { data: facturaItens, isLoading: isLoadingFacturaItens } =
    useQueryFacturaItens(selectedPagamento?.codigo_factura);

  const exportData = useMemo(() => {
    if (!selectedPagamento) return null;

    const serviceRows =
      facturaItens?.data?.map((item) => ({
        descricao: [item?.descricaoservico, item?.mesdescricao]
          .filter(Boolean)
          .join(" "),
        factura: selectedPagamento.codigo_factura,
        valor: item?.preco ?? "-",
        quantidade: item?.quantidade ?? "-",
      })) ?? [];

    return {
      infoSections: [
        {
          title: "Dados do Estudante",
          content: [
            `Código da Matrícula: ${selectedPagamento.codigo_matricula}`,
            `Nome do Estudante: ${selectedPagamento.nome}`,
            `Curso: ${selectedPagamento.curso}`,
            `Campus: ${selectedPagamento.polo}`,
            `Contacto: ${selectedPagamento.contacto || "-"}`,
          ],
        },
        {
          title: "Detalhes do Pagamento",
          content: [
            `Referência: ${selectedPagamento.referencia}`,
            `Factura: ${selectedPagamento.codigo_factura}`,
            `Entidade: ${selectedPagamento.entidade}`,
            `Valor Total: ${selectedPagamento.preco}`,
            `Estado: ${selectedPagamento.estado}`,
            `Data de Pagamento: ${formatarData(selectedPagamento.data_pagamento)}`,
            `Data de Registo: ${formatarData(selectedPagamento.data_inicio)}`,
            `Data de Validação: ${formatarData(selectedPagamento.data_final)}`,
          ],
        },
      ],
      rows: serviceRows,
    };
  }, [facturaItens?.data, selectedPagamento]);

  const pdfContent = exportData ? (
    <GenericPDFDocument
      documentTitle="Detalhes do Pagamento por Referência"
      subtitle={`Referência ${selectedPagamento?.referencia}`}
      infoSections={exportData.infoSections}
      mainTable={{
        headers: [
          { key: "descricao", label: "Descrição", width: "40%" },
          { key: "factura", label: "Factura Referente", width: "20%" },
          { key: "valor", label: "Valor", width: "20%" },
          { key: "quantidade", label: "Quantidade", width: "20%" },
        ],
        rows: exportData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = exportData
    ? {
        documentTitle: "Detalhes do Pagamento por Referência",
        subtitle: `Referência ${selectedPagamento?.referencia}`,
        infoSections: exportData.infoSections,
        mainTable: {
          headers: [
            { key: "descricao", label: "Descrição", width: 40 },
            { key: "factura", label: "Factura Referente", width: 20 },
            { key: "valor", label: "Valor", width: 18 },
            { key: "quantidade", label: "Quantidade", width: 15 },
          ],
          rows: exportData.rows,
          headerBackground: "#0D1B48",
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = selectedPagamento
    ? `Pagamento_Referencia_${selectedPagamento.referencia}_${new Date()
        .toISOString()
        .slice(0, 10)}`
    : "Pagamento_Referencia";

  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader className="gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Detalhes do Pagamento - {selectedPagamento?.referencia}
              </DialogTitle>

              {pdfContent && excelProps && !isLoadingFacturaItens && (
                <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                  <PDFActions
                    document={pdfContent}
                    fileName={`${baseFileName}.pdf`}
                    showDownload
                    showPrint
                  />
                  <ExcelActions
                    excelProps={excelProps}
                    fileName={`${baseFileName}.xlsx`}
                    showDownload
                  />
                </div>
              )}
            </div>
          </DialogHeader>

          {selectedPagamento && (
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
                    <p className="font-medium">
                      {selectedPagamento?.codigo_matricula}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-medium">{selectedPagamento?.nome}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" /> Curso
                    </p>
                    <p className="font-medium">{selectedPagamento?.curso}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Campus
                    </p>
                    <p className="font-medium">{selectedPagamento?.polo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Contacto
                    </p>
                    <p className="font-medium">{selectedPagamento?.contacto}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Referência</p>
                    <p className="font-mono font-medium">
                      {selectedPagamento?.referencia}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-medium text-lg text-primary">
                      {selectedPagamento?.preco}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <PagamentoReferenciaStatus
                      status={selectedPagamento?.estado}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Data de Pagamento
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_pagamento)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data de Registo
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_inicio)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data de Validação
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_final)}
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
                      <TableRow key={item.codigoitem}>
                        <TableCell className="font-medium">
                          {item?.descricaoservico} {item?.mesdescricao}
                        </TableCell>
                        <TableCell className="font-mono">
                          {selectedPagamento?.codigo_factura}
                        </TableCell>
                        <TableCell>{item?.preco}</TableCell>
                        <TableCell>{item?.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
