import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import {
  useCreatePreInscrito,
  useDeletePreInscrito,
  usePreInscritos,
  useUpdatePreInscrito,
} from "@/hooks/pre-inscritos/use-pre-inscritos";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTipoDocumento } from "@/hooks/acess/use-query-tipo-documento";
import {
  PreInscrito,
  TIPOS_CANDIDATURA,
} from "@/services/pre-inscritos/pre-inscritos.service";

type FormState = {
  name: string;
  email: string;
  telefone: string;
  grauacademico: string;
  tipo_de_documento: string;
  numero_documento: string;
  password: string;
  foto: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  telefone: "",
  grauacademico: "",
  tipo_de_documento: "",
  numero_documento: "",
  password: "",
  foto: "",
};

type ModalState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit" | "view"; preInscrito: PreInscrito }
  | { open: true; mode: "delete"; preInscrito: PreInscrito };

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PreInscritos() {
  const [filters, setFilters] = useState<{
    search: string;
    grauacademico: string;
    anoLectivoId: string;
    page: number;
    limit: number;
  }>({
    search: "",
    grauacademico: "",
    anoLectivoId: "",
    page: 1,
    limit: 10,
  });

  const [modal, setModal] = useState<ModalState>({ open: false });
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data, isLoading, refetch } = usePreInscritos({
    search: filters.search || undefined,
    grauacademico: filters.grauacademico || undefined,
    anoLectivoId: filters.anoLectivoId
      ? Number(filters.anoLectivoId)
      : undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutate: createPreInscrito, isPending: isCreating } =
    useCreatePreInscrito();
  const { mutate: updatePreInscrito, isPending: isUpdating } =
    useUpdatePreInscrito();
  const { mutate: deletePreInscrito, isPending: isDeleting } =
    useDeletePreInscrito();

  const { data: anosLectivos = [], isLoading: isLoadingAnoLectivo } =
    useQueryAnoAcademico();
  const { data: tiposDocumento = [] } = useQueryTipoDocumento();

  const preInscritos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const offset = (filters.page - 1) * filters.limit;

  function openCreate() {
    setForm(emptyForm);
    setModal({ open: true, mode: "create" });
  }

  function openEdit(preInscrito: PreInscrito) {
    setForm({
      name: preInscrito.name ?? "",
      email: preInscrito.email ?? "",
      telefone: preInscrito.telefone ?? "",
      grauacademico: preInscrito.grauacademico ?? "",
      tipo_de_documento:
        preInscrito.tipo_de_documento != null
          ? String(preInscrito.tipo_de_documento)
          : "",
      numero_documento: preInscrito.numero_documento ?? "",
      password: "",
      foto: preInscrito.foto ?? "",
    });
    setModal({ open: true, mode: "edit", preInscrito });
  }

  function openView(preInscrito: PreInscrito) {
    setModal({ open: true, mode: "view", preInscrito });
  }

  function openDelete(preInscrito: PreInscrito) {
    setModal({ open: true, mode: "delete", preInscrito });
  }

  function handleSave() {
    if (modal.open && modal.mode === "create") {
      createPreInscrito(
        {
          name: form.name,
          email: form.email,
          telefone: form.telefone || undefined,
          grauacademico: form.grauacademico || undefined,
          tipo_de_documento: form.tipo_de_documento
            ? Number(form.tipo_de_documento)
            : undefined,
          numero_documento: form.numero_documento || undefined,
          password: form.password,
          foto: form.foto || undefined,
        },
        { onSuccess: () => setModal({ open: false }) },
      );
    } else if (modal.open && modal.mode === "edit") {
      updatePreInscrito(
        {
          id: modal.preInscrito.id,
          payload: {
            name: form.name,
            email: form.email,
            telefone: form.telefone || undefined,
            grauacademico: form.grauacademico || undefined,
            tipo_de_documento: form.tipo_de_documento
              ? Number(form.tipo_de_documento)
              : undefined,
            numero_documento: form.numero_documento || undefined,
            password: form.password || undefined,
            foto: form.foto || undefined,
          },
        },
        { onSuccess: () => setModal({ open: false }) },
      );
    }
  }

  function handleDelete() {
    if (modal.open && modal.mode === "delete") {
      deletePreInscrito(modal.preInscrito.id, {
        onSuccess: () => setModal({ open: false }),
      });
    }
  }

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    (modal.open && modal.mode === "edit" ? true : form.password.length >= 8);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Exame de Acesso</span>
        <span>/</span>
        <span className="text-foreground">Pré-Inscritos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pré-Inscritos</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de utilizadores pré-inscritos no exame de acesso
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo pré-inscrito
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                search: "",
                grauacademico: "",
                anoLectivoId: "",
                page: 1,
                limit: 10,
              })
            }
          >
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome, e-mail, telefone ou nº documento..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              label="Tipo de candidatura"
              value={filters.grauacademico}
              onChange={(v) =>
                setFilters((prev) => ({ ...prev, grauacademico: v, page: 1 }))
              }
              defaultSelectItem={[{ value: "", label: "Todos", key: "all" }]}
              options={TIPOS_CANDIDATURA}
              map={(t) => ({ key: t, label: t, value: t })}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              label="Ano Letivo"
              value={filters.anoLectivoId}
              disabled={isLoadingAnoLectivo}
              loading={isLoadingAnoLectivo}
              onChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  anoLectivoId: v,
                  page: 1,
                }))
              }
              defaultSelectItem={[{ value: "", label: "Todos", key: "all" }]}
              options={anosLectivos}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : preInscritos.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Nenhum registo encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Não foram encontrados pré-inscritos com os critérios selecionados
          </p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo de candidatura</TableHead>
                    <TableHead>Tipo de documento</TableHead>
                    <TableHead>Nº documento</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preInscritos.map((preInscrito) => (
                    <TableRow key={preInscrito.id}>
                      <TableCell className="font-medium">
                        {preInscrito.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {preInscrito.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {preInscrito.telefone ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {preInscrito.grauacademico ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {preInscrito.tipo_documento_descricao ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {preInscrito.numero_documento ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(preInscrito.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openView(preInscrito)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(preInscrito)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDelete(preInscrito)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">
                Itens por página:
              </Label>
              <Select
                value={String(filters.limit)}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, limit: Number(v), page: 1 }))
                }
              >
                <SelectTrigger id="items-per-page" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {offset + 1} a{" "}
                {Math.min(offset + filters.limit, total)} de {total} registos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {filters.page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={filters.page === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de criar/editar */}
      <Dialog
        open={modal.open && (modal.mode === "create" || modal.mode === "edit")}
        onOpenChange={(open) => {
          if (!open) setModal({ open: false });
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {modal.open && modal.mode === "create"
                ? "Novo pré-inscrito"
                : "Editar pré-inscrito"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
                placeholder="+244 9XX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <FormSelect
                label="Tipo de candidatura"
                value={form.grauacademico}
                onChange={(v) => setField("grauacademico", v)}
                options={TIPOS_CANDIDATURA}
                map={(t) => ({
                  key: t,
                  label: t,
                  value: t,
                })}
              />
            </div>
            <div className="space-y-2">
              <FormSelect
                label="Tipo de documento"
                value={form.tipo_de_documento}
                onChange={(v) => setField("tipo_de_documento", v)}
                options={tiposDocumento}
                map={(t) => ({
                  key: t.codigo,
                  label: t.designacao,
                  value: t.codigo,
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nº do documento</Label>
              <Input
                value={form.numero_documento}
                onChange={(e) => setField("numero_documento", e.target.value)}
                placeholder="Número do documento"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>
                Senha{" "}
                {modal.open && modal.mode === "create"
                  ? "*"
                  : "(deixe em branco para manter)"}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Senha"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false })}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? "A guardar..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de visualização */}
      <Dialog
        open={modal.open && modal.mode === "view"}
        onOpenChange={(open) => {
          if (!open) setModal({ open: false });
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do pré-inscrito</DialogTitle>
          </DialogHeader>

          {modal.open && modal.mode === "view" && (
            <div className="space-y-3 text-sm">
              {modal.preInscrito.foto && (
                <div className="flex justify-center">
                  <img
                    src={modal.preInscrito.foto}
                    alt={modal.preInscrito.name}
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Nome completo</span>
                <span className="font-medium text-right">
                  {modal.preInscrito.name}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">E-mail</span>
                <span className="font-medium">{modal.preInscrito.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Telefone</span>
                <span className="font-medium">
                  {modal.preInscrito.telefone ?? "—"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  Tipo de candidatura
                </span>
                <span className="font-medium">
                  {modal.preInscrito.grauacademico ?? "—"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Tipo de documento</span>
                <span className="font-medium">
                  {modal.preInscrito.tipo_documento_descricao ?? "—"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Nº do documento</span>
                <span className="font-medium font-mono">
                  {modal.preInscrito.numero_documento ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em</span>
                <span className="font-medium">
                  {formatDate(modal.preInscrito.created_at)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false })}>
              Fechar
            </Button>
            {modal.open && modal.mode === "view" && (
              <Button
                onClick={() => {
                  const preInscrito = modal.preInscrito;
                  setModal({ open: false });
                  openEdit(preInscrito);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de eliminação */}
      <AlertDialog
        open={modal.open && modal.mode === "delete"}
        onOpenChange={(open) => {
          if (!open) setModal({ open: false });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar pré-inscrito</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar{" "}
              <span className="font-medium">
                {modal.open && modal.mode === "delete"
                  ? modal.preInscrito.name
                  : ""}
              </span>
              ? Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "A eliminar..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
