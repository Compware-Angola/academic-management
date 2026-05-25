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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  useQueryCashRegisterMovements,
  useValidateMovement,
} from "@/hooks/financa/use-cash-register";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";

import { toast } from "sonner";
import { parseFilter } from "@/util/parse-filter";

import ExcelActions, {
  GenericExcelProps,
} from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { formatarData } from "@/util/date-formate";
import { MovementRow } from "./MovementRow";
import { Pagination } from "./Pagination";
import { MovementDetails } from "../MovementDetails";
import { ValidationDialog } from "./ValidationDialog";
import { FiltersBar } from "./FiltersBar";
export const LoadingRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando movimentos...</span>
      </div>
    </TableCell>
  </TableRow>
);
export const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-32 text-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
        <span>Nenhum movimento encontrado</span>
      </div>
    </TableCell>
  </TableRow>
);
export function MovementsTable() {
  // Estados
  const [search, setSearch] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [caixa, setCaixa] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovement, setSelectedMovement] =
    useState<CashRegisterMovement | null>(null);
  const [validationDialog, setValidationDialog] = useState({
    open: false,
    movement: null as CashRegisterMovement | null,
    action: null as "approved" | "rejected" | null,
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { data, isLoading } = useQueryCashRegisterMovements({
    search: search || undefined,
    operatorId: parseFilter(operatorId),
    cashRegisterId: parseFilter(caixa),
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    limit: 10,
  });

  const validateMovement = useValidateMovement();
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
            ...(operatorId ? [`Operador filtrado: ${operatorId}`] : []),
            ...(caixa ? [`Caixa filtrado: ${caixa}`] : []),
            ...(startDate ? [`Data inicial: ${formatarData(startDate)}`] : []),
            ...(endDate ? [`Data final: ${formatarData(endDate)}`] : []),
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
  }, [exportRows, data?.meta?.total, operatorId, caixa, startDate, endDate]);

  // Componente PDF
  const pdfDocument = exportRows.length ? (
    <GenericPDFDocument
      documentTitle="Listagem de Movimentos de Caixa"
      subtitle="Movimentos registados no sistema"
      infoSections={[
        {
          title: "Resumo",
          content: [
            `Total de movimentos: ${data?.meta?.total ?? exportRows.length}`,
            ...(operatorId ? [`Operador: ${operatorId}`] : []),
            ...(caixa ? [`Caixa: ${caixa}`] : []),
            ...(startDate ? [`Data inicial: ${formatarData(startDate)}`] : []),
            ...(endDate ? [`Data final: ${formatarData(endDate)}`] : []),
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

  const handleCleanFilters = () => {
    setSearch("");
    setOperatorId("");
    setCaixa("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate && date && endDate < date) {
      setEndDate("");
    }
    setPage(1);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleViewDetails = (movement: CashRegisterMovement) => {
    setSelectedMovement(movement);
  };

  const handleValidateClick = (
    movement: CashRegisterMovement,
    action: "approved" | "rejected",
  ) => {
    setValidationDialog({ open: true, movement, action });
    if (action === "rejected") setRejectionReason("");
  };

  const handleConfirmValidation = async () => {
    const { movement, action } = validationDialog;

    if (!movement || !action) return;

    if (action === "rejected" && !rejectionReason.trim()) {
      toast.error("Por favor, informe o motivo da rejeição");
      return;
    }

    setIsValidating(true);

    try {
      await validateMovement.mutateAsync({
        movementId: movement.code,
        action,
        rejectionReason: action === "rejected" ? rejectionReason : undefined,
      });

      toast.success(
        action === "approved"
          ? "Movimento validado com sucesso!"
          : "Movimento rejeitado com sucesso!",
      );

      setValidationDialog({ open: false, movement: null, action: null });
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao validar movimento");
    } finally {
      setIsValidating(false);
    }
  };

  const movements = data?.data ?? [];
  const meta = data?.meta;
  const colSpan = 8;

  return (
    <>
      <div className="space-y-4">
        <FiltersBar
          search={search}
          onSearchChange={handleSearchChange}
          operatorId={operatorId}
          onOperatorChange={setOperatorId}
          caixa={caixa}
          onCaixaChange={setCaixa}
          startDate={startDate}
          onStartDateChange={handleStartDateChange}
          endDate={endDate}
          onEndDateChange={handleEndDateChange}
          onClearFilters={handleCleanFilters}
        />

        {/* Botões de Exportação - Adicionados aqui */}
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
              {isLoading && <LoadingRow colSpan={colSpan} />}

              {!isLoading && movements.length === 0 && (
                <EmptyRow colSpan={colSpan} />
              )}

              {!isLoading &&
                movements.map((movement) => (
                  <MovementRow
                    key={movement.code}
                    movement={movement}
                    onViewDetails={handleViewDetails}
                    onValidate={handleValidateClick}
                  />
                ))}
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
        onOpenChange={(open) => !open && setSelectedMovement(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Movimento</DialogTitle>
            <DialogDescription>
              Informações detalhadas do movimento #{selectedMovement?.code}
            </DialogDescription>
          </DialogHeader>
          {selectedMovement && <MovementDetails movement={selectedMovement} />}
        </DialogContent>
      </Dialog>

      <ValidationDialog
        open={validationDialog.open}
        movement={validationDialog.movement}
        action={validationDialog.action}
        rejectionReason={rejectionReason}
        isValidating={isValidating}
        onOpenChange={(open) => {
          if (!isValidating && !open) {
            setValidationDialog({ open: false, movement: null, action: null });
            setRejectionReason("");
          }
        }}
        onRejectionReasonChange={setRejectionReason}
        onConfirm={handleConfirmValidation}
      />
    </>
  );
}
