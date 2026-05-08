import { PagamentosFiltros } from "./PagamentosFiltros";
import { PagamentosTable } from "./PagamentosTable";
import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";
import ExcelActions, {
    GenericExcelProps,
} from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
    GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { useMemo } from "react";

type SearchByType =
    | "codigoMatricula"
    | "nome"
    | "n_operacao_bancaria"
    | "n_operacao_bancaria2";

type Filters = {
    anoLectivo: string;
    estado: string;
    factura: string;
};


type PagamentosTabProps = {
    filters: Filters;
    setFilters: (f: Filters) => void;
    searchBy: SearchByType;
    setSearchBy: (s: SearchByType) => void;
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    payments: PaymentItem[];
    loadingPayments: boolean;
    page: number;
    setPage: (p: number) => void;
    limit: number;
    setLimit: (l: number) => void;
    total: number | undefined;
    totalPages: number | undefined;
    onSearch: () => void;
    onVerDetalhes: (codigoFactura: number) => void;
};

export function PagamentosTab({
    filters,
    setFilters,
    searchBy,
    setSearchBy,
    searchTerm,
    setSearchTerm,
    payments,
    loadingPayments,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    onSearch,
    onVerDetalhes,
}: PagamentosTabProps) {
    const exportRows = useMemo(
        () =>
            payments.map((pag) => ({
                codigo_pagamento: pag.codigo_pagamento,
                codigo_factura: pag.codigo_factura || "---",
                curso: pag.curso || "---",
                codigo_matricula: pag.codigo_matricula,
                nome_completo: pag.nome_completo || "---",
                operacao_bancaria: pag.operacao_bancaria || "---",
                seg_operacao_bancaria: pag.seg_operacao_bancaria || "---",
                forma_pagamento: pag.forma_pagamento || "---",
                caixa: pag.caixa || "---",
                canal: pag.canal || "---",
                totalgeral: formatNumber(pag.totalgeral || 0),
                valor_depositado: formatNumber(pag.valor_depositado || 0),
                databanco: formatarData(pag.databanco || ""),
                data_registro: formatarData(pag.data_registro || ""),
                status_pagamento: pag.status_pagamento || "---",
                tipo_pagamento: pag.tipo_pagamento || "---",
            })),
        [payments],
    );

    const excelProps = useMemo<GenericExcelProps | null>(() => {
        if (!exportRows.length) return null;

        return {
            documentTitle: "Listagem de Pagamentos",
            subtitle: "Pagamentos registados no sistema",
            infoSections: [
                {
                    title: "Resumo",
                    content: [`Total de pagamentos: ${total ?? payments.length}`],
                },
            ],
            mainTable: {
                headers: [
                    { key: "codigo_pagamento", label: "Código", width: 16 },
                    { key: "codigo_factura", label: "Factura", width: 16 },
                    { key: "curso", label: "Curso", width: 30 },
                    { key: "codigo_matricula", label: "Código Matricula", width: 18 },
                    { key: "nome_completo", label: "Estudante", width: 32 },
                    { key: "operacao_bancaria", label: "Nº da Operação bancaria", width: 26 },
                    { key: "seg_operacao_bancaria", label: "Nº da 2º Operação bancaria", width: 28 },
                    { key: "forma_pagamento", label: "Forma de Pagamento", width: 22 },
                    { key: "caixa", label: "Caixa", width: 18 },
                    { key: "canal", label: "Canal", width: 18 },
                    { key: "totalgeral", label: "Valor Total", width: 18, align: "right" },
                    { key: "valor_depositado", label: "Valor Depositado", width: 20, align: "right" },
                    { key: "databanco", label: "Data Banco", width: 18 },
                    { key: "data_registro", label: "Data Registro", width: 18 },
                    { key: "status_pagamento", label: "Status Pgto.", width: 18 },
                    { key: "tipo_pagamento", label: "Tipo de Pagamento", width: 22 },
                ],
                rows: exportRows,
            },
            footerNotice: "Documento gerado automaticamente.",
            primaryColor: "#1e40af",
        };
    }, [exportRows, total]);

    const pdfDocument = exportRows.length ? (
        <GenericPDFDocument
            documentTitle="Listagem de Pagamentos"
            subtitle="Pagamentos registados no sistema"
            infoSections={[
                {
                    title: "Resumo",
                    content: [`Total de pagamentos: ${total ?? exportRows.length}`],
                },
            ]}
            mainTable={{
                headers: [
                    { key: "codigo_pagamento", label: "Código", width: "6%" },
                    { key: "codigo_factura", label: "Factura", width: "6%" },
                    { key: "codigo_matricula", label: "Matrícula", width: "7%" },
                    { key: "nome_completo", label: "Estudante", width: "14%" },
                    { key: "operacao_bancaria", label: "Operação", width: "9%" },
                    { key: "forma_pagamento", label: "Forma", width: "9%" },
                    { key: "caixa", label: "Caixa", width: "7%" },
                    { key: "canal", label: "Canal", width: "7%" },
                    { key: "totalgeral", label: "Total", width: "8%", align: "right" },
                    { key: "valor_depositado", label: "Depositado", width: "8%", align: "right" },
                    { key: "databanco", label: "Data Banco", width: "8%" },
                    { key: "status_pagamento", label: "Status", width: "6%" },
                    { key: "tipo_pagamento", label: "Tipo", width: "5%" },
                ],
                rows: exportRows,
                headerBackground: "#1e40af",
            }}
            footerNotice="Documento gerado automaticamente."
            primaryColor="#1e40af"
        />
    ) : null;

    const baseFileName = `Listagem_de_Pagamentos_${new Date()
        .toISOString()
        .slice(0, 10)}`;

    return (
        <div className="space-y-6">
            <PagamentosFiltros
                filters={filters}
                setFilters={setFilters}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setPage={setPage}
                onSearch={onSearch}
            />

            <div className="flex gap-2">
                {pdfDocument && (
                    <PDFActions
                        document={pdfDocument}
                        fileName={`${baseFileName}.pdf`}
                        showDownload
                        showPrint
                    />
                )}
                {excelProps && (
                    <ExcelActions
                        excelProps={excelProps}
                        fileName={`${baseFileName}.xlsx`}
                    />
                )}
            </div>

            <PagamentosTable
                payments={payments}
                loading={loadingPayments}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                total={total}
                totalPages={totalPages}
                onVerDetalhes={onVerDetalhes}
            />
        </div>
    );
}
