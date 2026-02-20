import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";

import { useQueryAvisos } from "@/hooks/acess/use-avisos";

export default function Avisos() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQueryAvisos({
    page: currentPage,
    limit: 10,
  });

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /* ================= NORMALIZAÇÃO DOS DADOS ================= */

  const avisos = useMemo(() => {
    return (data?.data ?? []).map((item) => ({
      assunto: item.ASSUNTO,
      descricao: item.DESCRICAO,
      name: item.NAME,
      curso: item.CURSO,
      date_expiracao: item.DATE_EXPIRACAO, // ajuste conforme vem da API
    }));
  }, [data]);

  /* ================= EXPORT DATA ================= */

  const exportRows = useMemo(() => {
    return avisos.map((item) => ({
      assunto: item.assunto,
      descricao: item.descricao,
      autor: item.name,
      curso: item.curso ?? "—",
      expiracao: formatDate(item.date_expiracao),
    }));
  }, [avisos]);

  /* ================= PDF ================= */

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Lista de Avisos"
        subtitle="Listagem completa de avisos"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "assunto", label: "Assunto", width: "25%" },
            { key: "descricao", label: "Descrição", width: "30%" },
            { key: "autor", label: "Autor", width: "20%" },
            { key: "curso", label: "Curso", width: "15%" },
            { key: "expiracao", label: "Data Expiração", width: "15%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
      />
    ) : null;

  /* ================= EXCEL ================= */

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Lista de Avisos",
          subtitle: "Listagem completa de avisos",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "assunto", label: "Assunto", width: 30 },
              { key: "descricao", label: "Descrição", width: 40 },
              { key: "autor", label: "Autor", width: 25 },
              { key: "curso", label: "Curso", width: 20 },
              { key: "expiracao", label: "Data Expiração", width: 20 },
            ],
            rows: exportRows,
          },
          primaryColor: "#1e40af",
        }
      : null;

  /* ================= COLUNAS ================= */

  const columns = [
    { header: "Assunto", accessor: "assunto" },
    { header: "Descrição", accessor: "descricao" },
    { header: "Autor", accessor: "name" },
    {
      header: "Curso",
      accessor: "curso",
      cell: (row) => row.curso ?? "—",
    },
    {
      header: "Data Expiração",
      accessor: "date_expiracao",
      cell: (row) => formatDate(row.date_expiracao),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Avisos"
        subtitle="Listagem completa"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Avisos_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Avisos_${new Date()
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
        data={avisos}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
