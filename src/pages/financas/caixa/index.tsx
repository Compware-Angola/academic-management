import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Ban,
  CheckCircle2,
  Home,
  Loader2,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CashRegister } from "@/services/finance/cash-register.service";

import {
  useCloseCashRegister,
  useCreateCashRegister,
  useDeleteCashRegister,
  useOpenCashRegister,
  useQueryCashRegisters,
  useUpdateCashRegister,
} from "@/hooks/financa/use-cash-register";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === "aberto";
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${
        isOpen
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {isOpen ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
      {isOpen ? "Aberto" : "Fechado"}
    </Badge>
  );
}

export function CaixaPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<CashRegister | null>(null);
  const [name, setName] = useState("");
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [closingId, setClosingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filters = useMemo(
    () => ({
      search,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [search, statusFilter],
  );

  const { data, isLoading } = useQueryCashRegisters(filters);
  const createMutation = useCreateCashRegister();
  const updateMutation = useUpdateCashRegister();
  const openMutation = useOpenCashRegister();
  const closeMutation = useCloseCashRegister();
  const deleteMutation = useDeleteCashRegister();

  function resetForm() {
    setSelected(null);
    setName("");
  }

  function handleOpenCreate() {
    resetForm();
    setOpenForm(true);
  }

  function handleEdit(item: CashRegister) {
    setSelected(item);
    setName(item.name);
    setOpenForm(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    const payload = { name };
    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpenForm(false);
    resetForm();
  }

  async function handleOpenRegister(id: number) {
    try {
      setOpeningId(id);
      await openMutation.mutateAsync(id);
    } finally {
      setOpeningId(null);
    }
  }

  async function handleClose(id: number) {
    try {
      setClosingId(id);
      await closeMutation.mutateAsync(id);
    } finally {
      setClosingId(null);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* ── Breadcrumb ── */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Financeiro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Caixas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Caixas</h1>
          <p className="text-sm text-muted-foreground">
            Controle de abertura e fechamento caixas
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Caixa
        </Button>
      </div>

      {/* ── Table card ── */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Caixas</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar caixa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="aberto">Abertos</SelectItem>
                <SelectItem value="fechado">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead className="text-center min-w-[140px]">
                  Acções
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading */}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Rows */}
              {!isLoading &&
                data?.map((item) => {
                  const isBusy =
                    openingId === item.id ||
                    closingId === item.id ||
                    deletingId === item.id;
                  const isDeleting = deletingId === item.id;
                  const isToggling =
                    openingId === item.id || closingId === item.id;
                  const isClosed = item.status === "fechado";

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground text-xs font-mono">
                        #{String(item.id).padStart(3, "0")}
                      </TableCell>

                      <TableCell className="font-medium">{item.name}</TableCell>

                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {item.operatorId ?? "—"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleEdit(item)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Editar</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Open / Close */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className={`h-8 w-8 ${
                                  isClosed
                                    ? "text-blue-600 hover:text-blue-700 hover:border-blue-300 dark:text-blue-400"
                                    : "text-amber-600 hover:text-amber-700 hover:border-amber-300 dark:text-amber-400"
                                }`}
                                disabled={isBusy}
                                onClick={() =>
                                  isClosed
                                    ? handleOpenRegister(item.id)
                                    : handleClose(item.id)
                                }
                              >
                                {isToggling ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isClosed ? (
                                  <LockOpen className="h-3.5 w-3.5" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {isClosed ? "Abrir caixa" : "Fechar caixa"}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Delete */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={isBusy}
                                onClick={() => handleDelete(item.id)}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Remover</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* Empty state */}
              {!isLoading && data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground text-sm"
                  >
                    Nenhum caixa encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Form dialog ── */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {selected ? "Editar Caixa" : "Novo Caixa"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="caixa-nome">Nome</Label>
              <Input
                id="caixa-nome"
                placeholder="Digite o nome do caixa"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenForm(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>

            <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              {selected ? "Actualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
