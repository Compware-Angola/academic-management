import { useState } from "react";

import { Link } from "react-router-dom";

import {
  Home,
  Loader2,
  Pencil,
  Plus,
  Search,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { Switch } from "@/components/ui/switch";

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

import { FormaPagamento } from "@/services/finance/forma-pagamento.service";

import {
  useCreateFormaPagamento,
  useQueryFormaPagamento,
  useToggleStatusFormaPagamento,
  useUpdateFormaPagamento,
} from "@/hooks/financa/use-forma-pagamento";

export function FormaPagamentoPage() {
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<string>("all");

  const [open, setOpen] =
    useState(false);

  const [selected, setSelected] =
    useState<FormaPagamento | null>(
      null,
    );

  const [descricao, setDescricao] =
    useState("");

  const [status, setStatus] =
    useState<string>("1");

  const [togglingId, setTogglingId] =
    useState<number | null>(null);

  const {
    data,
    isLoading,
  } = useQueryFormaPagamento({
    search,

    status:
      statusFilter === "all"
        ? undefined
        : Number(statusFilter),
  });

  const createMutation =
    useCreateFormaPagamento();

  const updateMutation =
    useUpdateFormaPagamento();

  const toggleMutation =
    useToggleStatusFormaPagamento();

  function resetForm() {
    setDescricao("");
    setStatus("1");
    setSelected(null);
  }

  function handleOpenCreate() {
    resetForm();
    setOpen(true);
  }

  function handleEdit(
    item: FormaPagamento,
  ) {
    setSelected(item);

    setDescricao(item.descricao);

    setStatus(
      String(item.status),
    );

    setOpen(true);
  }

  async function handleToggle(
    codigo: number,
  ) {
    setTogglingId(codigo);

    try {
      await toggleMutation.mutateAsync(
        codigo,
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSave() {
    if (!descricao.trim()) return;

    const payload = {
      descricao,
      status: Number(status),
    };

    if (selected) {
      await updateMutation.mutateAsync({
        codigo: selected.codigo,
        payload,
      });
    } else {
      await createMutation.mutateAsync(
        payload,
      );
    }

    setOpen(false);

    resetForm();
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
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
            <BreadcrumbLink>
              Finanças
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Forma de Pagamento
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Forma de Pagamento
          </h1>

          <p className="text-sm text-muted-foreground">
            Gestão de formas de
            pagamento
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Forma
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Formas de
            Pagamento
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Pesquisar descrição..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos
                </SelectItem>

                <SelectItem value="1">
                  Activos
                </SelectItem>

                <SelectItem value="0">
                  Inactivos
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Código
                  </TableHead>

                  <TableHead>
                    Descrição
                  </TableHead>

                  <TableHead>
                    Estado
                  </TableHead>

                  <TableHead className="w-[180px]">
                    Acções
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Carregando...
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  data?.map((item) => {
                    const isToggling =
                      togglingId ===
                      item.codigo;

                    return (
                      <TableRow
                        key={
                          item.codigo
                        }
                      >
                        <TableCell>
                          {
                            item.codigo
                          }
                        </TableCell>

                        <TableCell className="font-medium">
                          {
                            item.descricao
                          }
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              item.status ===
                              1
                                ? "default"
                                : "destructive"
                            }
                          >
                            {item.status ===
                            1
                              ? "Activo"
                              : "Inactivo"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={
                                item.status ===
                                1
                              }
                              disabled={
                                isToggling
                              }
                              onCheckedChange={() =>
                                handleToggle(
                                  item.codigo,
                                )
                              }
                            />

                            {isToggling && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleEdit(
                                  item,
                                )
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {!isLoading &&
                  data?.length ===
                    0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center"
                      >
                        Nenhum registo
                        encontrado
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? "Actualizar Forma de Pagamento"
                : "Nova Forma de Pagamento"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>
                Descrição
              </Label>

              <Input
                placeholder="Digite a descrição"
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Estado
              </Label>

              <Select
                value={status}
                onValueChange={
                  setStatus
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">
                    Activo
                  </SelectItem>

                  <SelectItem value="0">
                    Inactivo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {selected
                ? "Actualizar"
                : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}