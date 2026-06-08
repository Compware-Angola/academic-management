import { useState } from "react";
import {
  Loader2,
  LockOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  SquarePen,
  X,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useDeleteCashRegister, useQueryCashRegisters } from "@/hooks/financa/use-cash-register";
import { CashRegister } from "@/services/finance/cash-register.service";

import { Badge } from "@/components/ui/badge";
import { OpenCashRegisterForm } from "./open-cash-register-form";
import { cn } from "@/lib/utils";
import { ModalUpsertCashRegister } from "./moviment/ModalUpsertCashRegister";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePermission } from "@/auth/permission.helper";
import { PermissionType, PermissionTypeDetails } from "@/constants/permission.type";
export function CaixasDisponiveisTab() {
  const { hasPermission } = usePermission();
  const deleteCashRegister = useDeleteCashRegister();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cashRegisterToEdit, setCashRegisterToEdit] = useState<{ id: number; name: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: dataCashRegisters,
    isLoading,
    refetch: refetchCashRegisters,
    isFetching,
  } = useQueryCashRegisters({
    search: search || undefined,
    page,
    limit: 10,
  });

  const handleRefresh = () => {
    setSearch("");
    setPage(1);
    refetchCashRegisters();
  };

  const cashRegisters = dataCashRegisters?.data ?? [];
  const meta = dataCashRegisters?.meta;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (meta && page < meta.totalPages) setPage(page + 1);
  };

  const getStatusBadge = (status: string) => {
    if (status === "aberto") {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Aberto
        </Badge>
      );
    }
    return <Badge variant="secondary">Fechado</Badge>;
  };


  const handleEditCashRegister = (cashRegister: typeof cashRegisterToEdit) => {
    setCashRegisterToEdit(cashRegister);
    setIsModalOpen(true);
  };
  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open);
    setCashRegisterToEdit(null);
  };
  const handleNewCashRegisterModal = () => {
    setSelectedRegister(null);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteCashRegister.mutate(deleteId, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteId(null);
      },
    });
  };
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const canManegerCash = hasPermission(PermissionTypeDetails.CONFIGURACAO_CAIXA.sigla);


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Caixas disponíveis</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar caixa por nome ou operador..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {canManegerCash && (
                <Button variant="default" onClick={handleNewCashRegisterModal} className="ml-2">
                  <Plus />
                  Novo
                </Button>
              )}
              <Button onClick={handleRefresh} variant="outline" className="ml-2">
                <RefreshCw
                  className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")}
                />
                Atualizar
              </Button>
            </div>

          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Código</TableHead>
                  <TableHead>Nome da Caixa</TableHead>
                  <TableHead>Operador Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bloqueado</TableHead>
                  <TableHead className="text-center w-[100px]">Ação</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading || isFetching ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando caixas...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : cashRegisters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="text-muted-foreground">
                        Nenhum caixa encontrado.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {cashRegisters.map((item) => (
                      <TableRow key={item.code}>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          #{String(item.code).padStart(3, "0")}
                        </TableCell>

                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>

                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.operator_name}
                            </span>

                            {item.operator_code && (
                              <span className="text-xs text-muted-foreground">
                                ID: #
                                {String(item.operator_code).padStart(3, "0")}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>{getStatusBadge(item.status)}</TableCell>

                        <TableCell>
                          {item.blocked === "S" ? "Sim" : "Não"}
                        </TableCell>

                        <TableCell className="text-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                disabled={
                                  item.blocked === "S" ||
                                  item.status === "aberto"
                                }
                                className={
                                  item.blocked === "S"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-950"
                                }
                                onClick={() =>
                                  setSelectedRegister({
                                    blocked: item.blocked,
                                    id: item.code,
                                    name: item.name,
                                    operatorId: item.operator_code,
                                    status: item.status,
                                  })
                                }
                                title={
                                  item.blocked === "S"
                                    ? "Caixa bloqueado"
                                    : "Abrir caixa"
                                }
                              >
                                <LockOpen className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Abrir caixa</p>
                            </TooltipContent>
                          </Tooltip>

                          {
                            canManegerCash && (<>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    disabled={item.status === "aberto"}
                                    size="icon"
                                    variant="outline"
                                    onClick={() =>
                                      handleEditCashRegister({
                                        id: item.code,
                                        name: item.name,
                                      })
                                    }
                                    title="Editar caixa"
                                  >
                                    <SquarePen className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Editar caixa</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    disabled={item.status === "aberto"}
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.code)}
                                    title="Eliminar caixa"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Eliminar caixa</p>
                                </TooltipContent>
                              </Tooltip>
                            </>)
                          }

                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
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
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                {/* <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      let pageNumber;
                      if (meta.totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (page <= 3) {
                        pageNumber = i + 1;
                      } else if (page >= meta.totalPages - 2) {
                        pageNumber = meta.totalPages - 4 + i;
                      } else {
                        pageNumber = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={page === pageNumber ? "default" : "outline"}
                          size="sm"
                          className="w-8"
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    },
                  )}
                </div> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === meta.totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card >

      <Dialog
        open={!!selectedRegister}
        onOpenChange={(open) => !open && setSelectedRegister(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockOpen className="h-5 w-5 text-muted-foreground" />
              Abrir Caixa
            </DialogTitle>
            <DialogDescription>
              Defina o montante inicial para começar as operações financeiras.
            </DialogDescription>
          </DialogHeader>

          {selectedRegister && (
            <OpenCashRegisterForm
              register={selectedRegister}
              onSuccess={() => setSelectedRegister(null)}
              onCancel={() => setSelectedRegister(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <ModalUpsertCashRegister open={isModalOpen} handleOpenChange={handleCloseModal} cashRegister={cashRegisterToEdit} />
      <DeleteCashRegisterDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        loading={deleteCashRegister.isPending}
      />
    </>
  );
}




type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function DeleteCashRegisterDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar eliminação
          </DialogTitle>

          <DialogDescription>
            Tens a certeza que queres eliminar este caixa? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "A eliminar..." : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}