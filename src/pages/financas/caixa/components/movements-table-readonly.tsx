import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQueryCashRegisterMovements } from "@/hooks/financa/use-cash-register";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { MovementDetails } from "./MovementDetails";
import { EmptyRow, LoadingRow } from "./moviment/MovementsTable";
import { MovementRow } from "./moviment/MovementRow";
import { FiltersBar } from "./moviment/FiltersBar";
import { parseFilter } from "@/util/parse-filter";
import { Pagination } from "./moviment/Pagination";
import { formatCurrencyAOA } from "@/util/format-currency";
import { formatarData } from "@/util/date-formate";
import ExcelActions, {
  GenericExcelProps,
} from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

const colSpan = 11;

type MovementFilters = {
  search: string;
  operatorId: string;
  caixa: string;
  startDate: string;
  endDate: string;
};

export function MovementsTableReadOnly() {
  const [page, setPage] = useState(1);

  const [selectedMovement, setSelectedMovement] =
    useState<CashRegisterMovement | null>(null);

  const [filters, setFilters] = useState<MovementFilters>({
    search: "",
    operatorId: "",
    caixa: "",
    startDate: "",
    endDate: "",
  });

  const { data: currentUser } = useCurrentUser();

  const { data, isLoading, refetch, isFetching } =
    useQueryCashRegisterMovements({
      page,
      limit: 10,

      search: filters.search || undefined,

      operatorId:
        parseFilter(String(currentUser?.user?.pk_utilizador)) || undefined,

      cashRegisterId: parseFilter(String(filters.caixa)) || undefined,

      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    });

  const movements = data?.data ?? [];
  const meta = data?.meta;

  const updateFilter = (field: keyof MovementFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(1);
  };
  const exportRows = useMemo(
    () =>
      (data?.data ?? []).map((movement) => ({
        codigo: String(movement.code).padStart(3, "0"),
        caixa: movement.cash_register_name || "---",
        operador: movement.operator_name || "---",
        valor_abertura: formatCurrencyAOA(movement.opening_amount),
        total_arrecadado: formatCurrencyAOA(movement.total_collected_amount),
        data_abertura: formatarData(movement.date_at),
        data_fechamento: movement.closing_date
          ? formatarData(movement.closing_date)
          : "---",
        status: movement.status === "aberto" ? "Aberto" : "Fechado",
        status_admin:
          movement.admin_status === "validado"
            ? "Validado"
            : movement.admin_status === "rejeitado"
              ? "Rejeitado"
              : "Pendente",
        created_at: formatarData(movement.created_at),
        updated_at: formatarData(movement.updated_at),
      })),
    [data?.data],
  );
  const excelProps = useMemo<GenericExcelProps | null>(() => {
    if (!exportRows.length) return null;

    return {
      documentTitle: "Listagem de Movimentos de Caixa",
      subtitle: "Movimentos registados no sistema",
      infoSections: [
        {
          title: "Resumo",
          content: [
            `Total de movimentos: ${data?.meta?.total ?? exportRows.length}`,
            ...(filters.operatorId
              ? [`Operador filtrado: ${filters.operatorId}`]
              : []),
            ...(filters.caixa ? [`Caixa filtrado: ${filters.caixa}`] : []),
            ...(filters.startDate
              ? [`Data inicial: ${formatarData(filters.startDate)}`]
              : []),
            ...(filters.endDate
              ? [`Data final: ${formatarData(filters.endDate)}`]
              : []),
          ].filter(Boolean),
        },
      ],
      mainTable: {
        headers: [
          { key: "codigo", label: "Código", width: 10 },
          { key: "caixa", label: "Caixa", width: 20 },
          { key: "operador", label: "Operador", width: 25 },
          {
            key: "valor_abertura",
            label: "Valor Abertura",
            width: 18,
            align: "right",
          },
          {
            key: "total_arrecadado",
            label: "Total Arrecadado",
            width: 18,
            align: "right",
          },
          { key: "data_abertura", label: "Data Abertura", width: 18 },
          { key: "data_fechamento", label: "Data Fechamento", width: 18 },
          { key: "status", label: "Status", width: 12 },
          { key: "status_admin", label: "Validação", width: 12 },
        ],
        rows: exportRows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    };
  }, [
    exportRows,
    data?.meta?.total,
    filters.operatorId,
    filters.caixa,
    filters.startDate,
    filters.endDate,
  ]);

  const pdfDocument = exportRows.length ? (
    <GenericPDFDocument
      documentTitle="Listagem de Movimentos de Caixa"
      subtitle="Movimentos registados no sistema"
      infoSections={[
        {
          title: "Resumo",
          content: [
            `Total de movimentos: ${data?.meta?.total ?? exportRows.length}`,
            ...(filters.operatorId ? [`Operador: ${filters.operatorId}`] : []),
            ...(filters.caixa ? [`Caixa: ${filters.caixa}`] : []),
            ...(filters.startDate
              ? [`Data inicial: ${formatarData(filters.startDate)}`]
              : []),
            ...(filters.endDate
              ? [`Data final: ${formatarData(filters.endDate)}`]
              : []),
          ].filter(Boolean),
        },
      ]}
      mainTable={{
        headers: [
          { key: "codigo", label: "Código", width: "8%" },
          { key: "caixa", label: "Caixa", width: "15%" },
          { key: "operador", label: "Operador", width: "18%" },
          {
            key: "valor_abertura",
            label: "Abertura",
            width: "12%",
            align: "right",
          },
          {
            key: "total_arrecadado",
            label: "Arrecadado",
            width: "12%",
            align: "right",
          },
          { key: "data_abertura", label: "Data Abertura", width: "10%" },
          { key: "status", label: "Status", width: "8%" },
          { key: "status_admin", label: "Validação", width: "10%" },
        ],
        rows: exportRows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
      primaryColor="#0D1B48"
    />
  ) : null;

  const baseFileName = `Movimentos_Caixa_${new Date()
    .toISOString()
    .slice(0, 10)}`;
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleClearFilters = () => {
    setFilters({
      search: "",
      operatorId: String(currentUser?.user?.pk_utilizador),
      caixa: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };
  const handleRefresh = () => {
    setPage(1);
    handleClearFilters();
    refetch();
  };

  return (
    <>
      <div className="space-y-4">
        <FiltersBar
          singleOperator={true}
          search={filters.search}
          onSearchChange={(v) => updateFilter("search", v)}
          operatorId={String(currentUser?.user?.pk_utilizador)}
          onOperatorChange={(v) => { }}
          caixa={filters.caixa}
          onCaixaChange={(v) => updateFilter("caixa", v)}
          startDate={filters.startDate}
          onStartDateChange={(v) => updateFilter("startDate", v)}
          endDate={filters.endDate}
          onEndDateChange={(v) => updateFilter("endDate", v)}
          onClearFilters={handleClearFilters}
          onRefresh={handleRefresh}
          isRefreshing={isFetching && isLoading === false}
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Código</TableHead>
                <TableHead>Caixa</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Valor Abertura</TableHead>
                <TableHead>Total Arrecadado</TableHead>
                <TableHead>Data Abertura</TableHead>
                <TableHead>Hora da Abertura</TableHead>
                <TableHead>Data do Fecho</TableHead>
                <TableHead>Hora do Fecho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <LoadingRow colSpan={colSpan} />
              ) : movements.length === 0 ? (
                <EmptyRow colSpan={colSpan} />
              ) : (
                movements.map((movement) => (
                  <MovementRow
                    key={movement.code}
                    movement={movement}
                    onViewDetails={setSelectedMovement}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPreviousPage={() => handlePageChange(page - 1)}
            onNextPage={() => handlePageChange(page + 1)}
          />
        )}
      </div>
      <Dialog
        open={!!selectedMovement}
        onOpenChange={(o) => !o && setSelectedMovement(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes</DialogTitle>
            <DialogDescription>
              Movimento #{selectedMovement?.code}
            </DialogDescription>
          </DialogHeader>

          {selectedMovement && <MovementDetails movement={selectedMovement} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
