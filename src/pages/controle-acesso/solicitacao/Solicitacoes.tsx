import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { useQueryListarAllSolicitacoes } from "@/hooks/acess/use-query-listar-all-solicitacoes";

export default function Solicitacoes() {
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } =
    useQueryListarAllSolicitacoes({
      page: currentPage,
      limit: 10,
    });


    const solicitacoes = data?.data ?? [];


    const exportRows = solicitacoes.map((item: any) => ({
  nome: item.NAME,
  matricula: item.MATRICULA,
  servico: item.DESCRICAO_SERVICO,
  curso: item.CURSO ?? "—",
  data: formatDate(item.DATA_DE_SOLICITACAO),
}));


const pdfContent =
  exportRows.length > 0 ? (
    <GenericPDFDocument
      documentTitle="Todas as Solicitações"
      subtitle="Listagem completa de solicitações"
      infoSections={[
        {
          title: "Resumo",
          content: `Total de registos: ${exportRows.length}`,
        },
      ]}
      mainTable={{
        headers: [
          { key: "nome", label: "Nome", width: "25%" },
          { key: "matricula", label: "Matrícula", width: "15%" },
          { key: "servico", label: "Serviço", width: "25%" },
          { key: "curso", label: "Curso", width: "20%" },
          { key: "data", label: "Data", width: "15%" },
        ],
        rows: exportRows,
        headerBackground: "#1e40af",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;


  const excelProps =
  exportRows.length > 0
    ? {
        documentTitle: "Todas as Solicitações",
        subtitle: "Listagem completa de solicitações",
        infoSections: [
          {
            title: "Resumo",
            content: `Total de registos: ${exportRows.length}`,
          },
        ],
        mainTable: {
          headers: [
            { key: "nome", label: "Nome", width: 30 },
            { key: "matricula", label: "Matrícula", width: 20 },
            { key: "servico", label: "Serviço", width: 30 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "data", label: "Data", width: 20 },
          ],
          rows: exportRows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#1e40af",
      }
    : null;



  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const columns = [
    { header: "Nome", accessor: "NAME" },
    { header: "Matrícula", accessor: "MATRICULA" },
    { header: "Serviço", accessor: "DESCRICAO_SERVICO" },
    {
      header: "Curso",
      accessor: "CURSO",
      cell: (row: any) => row.CURSO ?? "—",
    },
    {
      header: "Data de Solicitação",
      accessor: "DATA_DE_SOLICITACAO",
      cell: (row: any) => formatDate(row.DATA_DE_SOLICITACAO),
    },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedSolicitacao(row);
            setShowDetails(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      <PageHeader
  title="Todas as Solicitações"
  subtitle="Listagem completa"
  actions={
    <>
      {pdfContent && (
        <PDFActions
          document={pdfContent}
          fileName={`Solicitacoes_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`}
          showDownload
          showPrint
        />
      )}

      {excelProps && (
        <ExcelActions
          excelProps={excelProps}
          fileName={`Solicitacoes_${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`}
          showDownload
        />
      )}
    </>
  }
/>


      <DataTable
        columns={columns}
        data={solicitacoes}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />

      {/* ---------- MODAL ---------- */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>

          {selectedSolicitacao && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">
                  {selectedSolicitacao.NAME}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Matrícula</p>
                <p className="font-medium">
                  {selectedSolicitacao.MATRICULA}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">
                  {selectedSolicitacao.DESCRICAO_SERVICO}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">
                  {selectedSolicitacao.CURSO ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Data de Solicitação
                </p>
                <p className="font-medium">
                  {formatDate(
                    selectedSolicitacao.DATA_DE_SOLICITACAO
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
