// src/pages/financas/caixa/components/movements-table.tsx

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useQueryCashRegisterMovements,
  useValidateMovement,
} from "@/hooks/financa/use-cash-register";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";
import { MovementDetails } from "./MovementDetails";
import { toast } from "sonner";

export function MovementsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovement, setSelectedMovement] =
    useState<CashRegisterMovement | null>(null);
  const [validationDialog, setValidationDialog] = useState<{
    open: boolean;
    movement: CashRegisterMovement | null;
    action: "approved" | "rejected" | null;
  }>({
    open: false,
    movement: null,
    action: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = useQueryCashRegisterMovements({
    search: search || undefined,
    page,
    limit: 10,
  });

  const validateMovement = useValidateMovement();

  const movements = data?.data ?? [];
  const meta = data?.meta;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (meta && page < meta.totalPages) setPage(page + 1);
  };

  const getStatusBadge = (status: string, adminStatus?: string) => {
    if (adminStatus === "validado") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-green-200"
        >
          Validado
        </Badge>
      );
    }
    if (adminStatus === "rejeitado") {
      return <Badge variant="destructive">Rejeitado</Badge>;
    }

    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      aberto: "default",
      fechado: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const canValidate = (movement: CashRegisterMovement) => {
    console.log(movement);
    return movement.closing_date && movement.validation_date === null;
  };

  const handleValidateClick = (
    movement: CashRegisterMovement,
    action: "approved" | "rejected",
  ) => {
    setValidationDialog({
      open: true,
      movement,
      action,
    });
    if (action === "rejected") {
      setRejectionReason("");
    }
  };

  const handleConfirmValidation = async () => {
    if (!validationDialog.movement || !validationDialog.action) return;

    if (validationDialog.action === "rejected" && !rejectionReason.trim()) {
      toast.error("Por favor, informe o motivo da rejeição");
      return;
    }

    try {
      await validateMovement.mutateAsync({
        movementId: validationDialog.movement.code,
        action: validationDialog.action,
        rejectionReason:
          validationDialog.action === "rejected" ? rejectionReason : undefined,
      });

      toast.success(
        validationDialog.action === "approved"
          ? "Movimento validado com sucesso!"
          : "Movimento rejeitado com sucesso!",
      );

      setValidationDialog({ open: false, movement: null, action: null });
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao validar movimento");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por caixa ou operador..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-center w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando movimentos...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                movements.map((movement) => (
                  <TableRow key={movement.code}>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      #{String(movement.code).padStart(3, "0")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.cash_register_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {movement.operator_name}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrencyAOA(movement.opening_amount)}
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">
                      {formatCurrencyAOA(movement.total_collected_amount)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(movement.date_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(movement.status, movement.admin_status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedMovement(movement)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {canValidate(movement) && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() =>
                                handleValidateClick(movement, "approved")
                              }
                              title="Aprovar movimento"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleValidateClick(movement, "rejected")
                              }
                              title="Rejeitar movimento"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                      <span>Nenhum movimento encontrado</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(meta.page - 1) * meta.limit + 1} -{" "}
              {Math.min(meta.page * meta.limit, meta.total)} de {meta.total}{" "}
              resultados
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === meta.totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog para detalhes do movimento */}
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

      {/* Alert Dialog para confirmação de validação */}
      <AlertDialog
        open={validationDialog.open}
        onOpenChange={(open) =>
          !open &&
          setValidationDialog({ open: false, movement: null, action: null })
        }
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {validationDialog.action === "approved"
                ? "Aprovar Movimento"
                : "Rejeitar Movimento"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {validationDialog.action === "approved"
                ? `Tem certeza que deseja aprovar o movimento #${String(validationDialog.movement?.code).padStart(3, "0")}?`
                : `Tem certeza que deseja rejeitar o movimento #${String(validationDialog.movement?.code).padStart(3, "0")}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {validationDialog.action === "rejected" && (
            <div className="space-y-2 py-4">
              <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Informe o motivo da rejeição..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmValidation}
              className={
                validationDialog.action === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {validateMovement.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {validationDialog.action === "approved" ? "Aprovar" : "Rejeitar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
