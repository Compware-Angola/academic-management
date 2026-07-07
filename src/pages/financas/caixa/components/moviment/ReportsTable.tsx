import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2, AlertCircle } from "lucide-react";

import {
  useQueryPaymentReportsForOperator,
} from "@/hooks/financa/use-cash-register";

import { formatCurrencyAOA } from "@/util/format-currency";
import { formatDate } from "@/pages/financas/notas-pagamento/components/form";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";

import ExcelActions, { GenericExcelProps } from "@/components/views/excel/GenericExcelExport";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";

import { Pagination } from "./Pagination";
import { FiltersBar } from "./FiltersBar";

/* ---------------- LOADING ---------------- */
export const LoadingRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando dados...</span>
      </div>
    </TableCell>
  </TableRow>
);

/* ---------------- EMPTY ---------------- */
export const EmptyRow = ({ colSpan, opedadorCode }: { colSpan: number, opedadorCode?: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-32 text-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
        <span>{opedadorCode ? 'Nenhum registo encontrado' : 'Selecione um operador'}</span>
      </div>
    </TableCell>
  </TableRow>
);

/* ---------------- COMPONENT ---------------- */
export function ReportsTable() {
  const [search, setSearch] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [caixa, setCaixa] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } =
    useQueryPaymentReportsForOperator({
      search: search || undefined,
      operatorId: parseFilter(operatorId),
      formaPagamento: parseFilter(tipoPagamento),
      caixaId: parseFilter(caixa),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page,
      limit: 10,
    });

  const reports = data?.data ?? [];
  const meta = data?.meta;

  const colSpan = 11;

  /* ---------------- EXPORT DATA ---------------- */
  const exportRows = useMemo(
    () =>
      reports.map((item) => ({
        caixa: item.caixa || "---",
        forma_pagamento: item.forma_pagamento || "---",
        operador: item.nome_utilizador || "---",
        aluno: item.aluno || "---",
        servico: item.servico_descricao || "---",
        quantidade: item.quantidade,
        preco: formatCurrencyAOA(item.preco),
        multa: formatCurrencyAOA(item.multa),
        total_item: formatCurrencyAOA(item.total),
        data_pagamento: formatDate(item.data_pagamento),
        valor_pago: formatCurrencyAOA(item.valor_depositado),
      })),
    [reports]
  );

  /* ---------------- EXCEL ---------------- */
  const excelProps = useMemo<GenericExcelProps | null>(() => {
    if (!exportRows.length) return null;

    return {
      documentTitle: "Relatório de Pagamentos",
      subtitle: "Detalhe de pagamentos por operador",
      infoSections: [
        {
          title: "Filtros",
          content: [
            ...(operatorId ? [`Operador: ${operatorId}`] : []),
            ...(caixa ? [`Caixa: ${caixa}`] : []),
            ...(startDate ? [`Data início: ${formatarData(startDate)}`] : []),
            ...(endDate ? [`Data fim: ${formatarData(endDate)}`] : []),
          ],
        },
      ],
      mainTable: {
        headers: [
          { key: "caixa", label: "Caixa" },
          { key: "forma_pagamento", label: "Forma Pagamento" },
          { key: "operador", label: "Operador" },
          { key: "aluno", label: "Aluno" },
          { key: "servico", label: "Serviço" },
          { key: "quantidade", label: "Qtd" },
          { key: "preco", label: "Preço" },
          { key: "multa", label: "Multa" },
          { key: "total_item", label: "Total" },
          { key: "data_pagamento", label: "Data Pagamento" },
          { key: "valor_pago", label: "Valor Pago" },
        ],
        rows: exportRows,
      },
      primaryColor: "#0D1B48",
      footerNotice: "Documento gerado automaticamente.",
    };
  }, [exportRows, operatorId, caixa, startDate, endDate]);

  /* ---------------- PDF ---------------- */
  const pdfDocument = exportRows.length ? (
    <GenericPDFDocument
      documentTitle="Relatório de Pagamentos"
      subtitle="Detalhe de pagamentos por operador"
      infoSections={[
        {
          title: "Filtros",
          content: [
            ...(operatorId ? [`Operador: ${operatorId}`] : []),
            ...(caixa ? [`Caixa: ${caixa}`] : []),
            ...(startDate ? [`Data início: ${formatarData(startDate)}`] : []),
            ...(endDate ? [`Data fim: ${formatarData(endDate)}`] : []),
          ],
        },
      ]}
      mainTable={{
        headers: [
          { key: "caixa", label: "Caixa", width: "10%" },
          { key: "forma_pagamento", label: "Pagamento", width: "12%" },
          { key: "operador", label: "Operador", width: "12%" },
          { key: "aluno", label: "Aluno", width: "15%" },
          { key: "servico", label: "Serviço", width: "15%" },
          { key: "quantidade", label: "Qtd", width: "6%" },
          { key: "preco", label: "Preço", width: "8%" },
          { key: "multa", label: "Multa", width: "8%" },
          { key: "total_item", label: "Total", width: "8%" },
          { key: "data_pagamento", label: "Data", width: "10%" },
          { key: "valor_pago", label: "Pago", width: "10%" },
        ],
        rows: exportRows,
      }}
      primaryColor="#0D1B48"
      footerNotice="Sistema de gestão financeira"
    />
  ) : null;

  /* ---------------- HANDLERS ---------------- */
  const handleClear = () => {
    setSearch("");
    setOperatorId("");
    setCaixa("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-4">

      {/* FILTERS */}
      <FiltersBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        tipoPagamento={tipoPagamento}
        onTipoPagamentoChange={setTipoPagamento}
        operatorId={operatorId}
        onOperatorChange={setOperatorId}
        caixa={caixa}
        onCaixaChange={setCaixa}
        startDate={startDate}
        onStartDateChange={(d) => {
          setStartDate(d);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(d) => {
          setEndDate(d);
          setPage(1);
        }}
        onClearFilters={handleClear}
        isRefreshing={isFetching && !isLoading}
        onRefresh={refetch}
      />

      {/* EXPORT */}
      <div className="flex gap-2">
        {pdfDocument && (
          <PDFActions document={pdfDocument} fileName="relatorio.pdf" />
        )}
        {excelProps && (
          <ExcelActions excelProps={excelProps} fileName="relatorio.xlsx" />
        )}
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caixa</TableHead>
              <TableHead>Forma Pagamento</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Multa</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead>Valor Pago</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              <LoadingRow colSpan={colSpan} />
            ) : reports.length === 0 ? (
              <EmptyRow colSpan={colSpan} opedadorCode={operatorId} />
            ) : (
              reports.map((r) => (
                <TableRow key={r.factura_item_codigo}>
                  <TableCell>{r.caixa ?? '---'}</TableCell>
                  <TableCell>{r.forma_pagamento}</TableCell>
                  <TableCell>{r.nome_utilizador}</TableCell>
                  <TableCell>{r.aluno}</TableCell>
                  <TableCell>{r.servico_descricao}</TableCell>
                  <TableCell>{r.quantidade}</TableCell>
                  <TableCell>{formatCurrencyAOA(r.preco)}</TableCell>
                  <TableCell>{formatCurrencyAOA(r.multa)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrencyAOA(r.total)}
                  </TableCell>
                  <TableCell>{formatDate(r.data_pagamento)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrencyAOA(r.valor_depositado)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {meta?.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPreviousPage={() => setPage(page - 1)}
          onNextPage={() => setPage(page + 1)}
        />
      )}
    </div>
  );
}