import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Hash,
  Home,
  ListChecks,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDisciplinasList } from "@/hooks/access_exam/use-tipos-disciplinas.hooks";
import {
  useCreateProva,
  useDeleteProva,
  useProvaById,
  useProvas,
  useUpdateProva,
} from "@/hooks/access_exam/use-provas";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { ProvaResumo } from "@/services/access_exam/provas.service";
import { parseFilter } from "@/util/parse-filter";
import {
  HtmlContent,
  plainTextFromHtml,
  QuestionContent,
} from "@/util/prova-text-format";

const PAGE_SIZE = 10;

type ProvaForm = {
  descricao: string;
  senhaProva: string;
  anoLetivoId: string;
  duracao: string;
  texto: string;
  perguntas: string;
  disciplinas: string;
  cursos: string;
};

const EMPTY_FORM: ProvaForm = {
  descricao: "",
  senhaProva: "",
  anoLetivoId: "",
  duracao: "",
  texto: "",
  perguntas: "",
  disciplinas: "",
  cursos: "",
};

function parseIds(value: string) {
  return parseIdValues(value).map((id) => ({ id }));
}

function parseIdValues(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}

function toggleDelimitedId(value: string, id: number, selected: boolean) {
  const ids = parseIdValues(value);
  const nextIds = selected
    ? [...ids, id].filter((item, index, items) => items.indexOf(item) === index)
    : ids.filter((item) => item !== id);

  return nextIds.join(", ");
}

function refsToText(refs?: { id: number }[]) {
  return refs?.map((item) => item.id).join(", ") ?? "";
}

function SelectionList<T>({
  value,
  items,
  isLoading,
  emptyMessage,
  getId,
  getLabel,
  onChange,
}: {
  value: string;
  items: T[];
  isLoading: boolean;
  emptyMessage: string;
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  onChange: (value: string) => void;
}) {
  const selectedIds = parseIdValues(value);

  if (isLoading) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        A carregar...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-44">
        <div className="space-y-1 p-2">
          {items.map((item) => {
            const id = getId(item);
            const checked = selectedIds.includes(id);

            return (
              <label
                key={id}
                className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/60"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextChecked) =>
                    onChange(toggleDelimitedId(value, id, nextChecked === true))
                  }
                />
                <span className="leading-5">{getLabel(item)}</span>
              </label>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Sem data";

  return new Date(value).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "Sem data";

  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status?: number) {
  return status === 1 ? "Activo" : "Inactivo";
}

function statusVariant(status?: number): "default" | "secondary" {
  return status === 1 ? "default" : "secondary";
}

export default function ListagemProvas() {
  const [search, setSearch] = useState("");
  const [anoLetivo, setAnoLetivo] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [viewingId, setViewingId] = useState<number | undefined>();
  const [editing, setEditing] = useState<ProvaResumo | null>(null);
  const [deleting, setDeleting] = useState<ProvaResumo | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProvaForm>(EMPTY_FORM);

  const { data: currentUser } = useCurrentUser("GA");
  const { data: academicYears = [], isLoading: isLoadingAcademicYears } =
    useQueryAnoAcademico();
  const { data: cursos = [], isLoading: isLoadingCursos } = useCursos();
  const { data: disciplinas = [], isLoading: isLoadingDisciplinas } =
    useDisciplinasList();

  const queryParams = {
    descricao: search.trim() || undefined,
    anoLetivoId: parseFilter(anoLetivo),
    page,
    limit,
  };

  const { data, isLoading, isFetching, refetch } = useProvas(queryParams);
  const { data: provaDetalhe, isLoading: isLoadingDetalhe } =
    useProvaById(viewingId);

  const createMutation = useCreateProva();
  const updateMutation = useUpdateProva();
  const deleteMutation = useDeleteProva();

  const provas = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  const stats = useMemo(
    () => ({
      total,
      activos: provas.filter((prova) => prova.status_ === 1).length,
      inactivos: provas.filter((prova) => prova.status_ !== 1).length,
      carregadas: provas.length,
    }),
    [provas, total]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setCreating(true);
  };

  const openEdit = (prova: ProvaResumo) => {
    setCreating(false);
    setEditing(prova);
    setForm({
      descricao: prova.descricao ?? "",
      senhaProva: "",
      anoLetivoId: String(prova.ano_lectivo_id ?? ""),
      duracao: String(prova.duracao ?? ""),
      texto: prova.texto ?? "",
      perguntas: refsToText(prova.perguntas),
      disciplinas: refsToText(prova.disciplinas),
      cursos: refsToText(prova.cursos),
    });
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const buildCreatePayload = () => {
    const userId = currentUser?.user?.pk_utilizador;

    if (!userId) {
      toast.error("Utilizador autenticado não encontrado.");
      return null;
    }

    if (
      !form.descricao.trim() ||
      !form.senhaProva.trim() ||
      !form.anoLetivoId ||
      !form.duracao
    ) {
      toast.error("Preencha descrição, senha, ano letivo e duração.");
      return null;
    }

    return {
      descricao: form.descricao.trim(),
      senhaProva: form.senhaProva.trim(),
      anoLetivoId: Number(form.anoLetivoId),
      userId,
      duracao: Number(form.duracao),
      texto: form.texto.trim() || undefined,
      perguntas: parseIds(form.perguntas),
      disciplinas: parseIds(form.disciplinas),
      cursos: parseIds(form.cursos),
    };
  };

  const buildUpdatePayload = () => {
    if (!form.descricao.trim() || !form.anoLetivoId || !form.duracao) {
      toast.error("Preencha descrição, ano letivo e duração.");
      return null;
    }

    return {
      descricao: form.descricao.trim(),
      senhaProva: form.senhaProva.trim() || undefined,
      anoLetivoId: Number(form.anoLetivoId),
      duracao: Number(form.duracao),
      perguntas: parseIds(form.perguntas),
      disciplinas: parseIds(form.disciplinas),
      cursos: parseIds(form.cursos),
    };
  };

  const handleSave = () => {
    if (editing) {
      const payload = buildUpdatePayload();
      if (!payload) return;

      updateMutation.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            toast.success("Prova atualizada com sucesso.");
            closeForm();
          },
        }
      );
      return;
    }

    const payload = buildCreatePayload();
    if (!payload) return;

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Prova criada com sucesso.");
        closeForm();
      },
    });
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Prova removida com sucesso.");
        setDeleting(null);
      },
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
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
            <BreadcrumbLink>Portal Administrativo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Listagem de Provas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Listagem de Provas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestão das provas de exame de acesso.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Prova
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileCheck className="h-8 w-8 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carregadas</p>
                <p className="text-2xl font-bold">{stats.carregadas}</p>
              </div>
              <ListChecks className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold">{stats.activos}</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivas</p>
                <p className="text-2xl font-bold">{stats.inactivos}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label>Pesquisar por descrição</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Descrição da prova..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ano Letivo</Label>
            <Select
              value={anoLetivo}
              onValueChange={(value) => {
                setAnoLetivo(value);
                setPage(1);
              }}
              disabled={isLoadingAcademicYears}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {academicYears.map((ano) => (
                  <SelectItem key={ano.codigo} value={String(ano.codigo)}>
                    {ano.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ano Letivo</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    A carregar provas...
                  </span>
                </TableCell>
              </TableRow>
            ) : provas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  Nenhuma prova encontrada.
                </TableCell>
              </TableRow>
            ) : (
              provas.map((prova) => (
                <TableRow key={prova.id}>
                  <TableCell className="font-mono font-semibold">
                    {prova.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {plainTextFromHtml(prova.descricao)}
                    </div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {plainTextFromHtml(prova.texto) || "Sem texto/instruções"}
                    </div>
                  </TableCell>
                  <TableCell>{prova.ano_letivo}</TableCell>
                  <TableCell>{prova.duracao} min</TableCell>
                  <TableCell>{prova.usuario}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">
                        {prova.perguntas?.length ?? 0} perguntas
                      </Badge>
                      <Badge variant="outline">
                        {prova.cursos?.length ?? 0} cursos
                      </Badge>
                      <Badge variant="outline">
                        {prova.disciplinas?.length ?? 0} disciplinas
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(prova.status_)}>
                      {statusLabel(prova.status_)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ver detalhes"
                        onClick={() => setViewingId(prova.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() => openEdit(prova)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        onClick={() => setDeleting(prova)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((item) => (
                <SelectItem key={item} value={String(item)}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            por página - Total: {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {page} de {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!viewingId} onOpenChange={(open) => !open && setViewingId(undefined)}>
        <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da prova</DialogTitle>
            <DialogDescription>
              Informações completas da prova selecionada.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetalhe ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                A carregar detalhes...
              </p>
            </div>
          ) : provaDetalhe ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="h-3.5 w-3.5" />
                      ID
                    </p>
                    <p className="mt-1 font-semibold">{provaDetalhe.id}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Ano Letivo
                    </p>
                    <p className="mt-1 font-semibold">
                      {provaDetalhe.ano_letivo}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      Autor
                    </p>
                    <p className="mt-1 font-semibold">{provaDetalhe.usuario}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label>Descrição</Label>
                <div className="mt-1 rounded-md border bg-muted/30 p-3">
                  <HtmlContent value={provaDetalhe.descricao} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Duração</Label>
                  <p className="mt-1 text-sm">{provaDetalhe.duracao} min</p>
                </div>
                <div>
                  <Label>Criada em</Label>
                  <p className="mt-1 text-sm">
                    {formatDateTime(provaDetalhe.created_at)}
                  </p>
                </div>
                <div>
                  <Label>Data de realização</Label>
                  <p className="mt-1 text-sm">
                    {formatDate(provaDetalhe.data_realizacao)}
                  </p>
                </div>
              </div>

              {provaDetalhe.texto && (
                <div>
                  <Label>Texto/Instruções</Label>
                  <div className="mt-1 rounded-md border bg-muted/30 p-3">
                    <HtmlContent value={provaDetalhe.texto} />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="mb-3 font-semibold">Cursos</h4>
                    {provaDetalhe.cursos.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum curso associado.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {provaDetalhe.cursos.map((curso) => (
                          <Badge key={curso.codigo} variant="outline">
                            {curso.designacao}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <h4 className="mb-3 font-semibold">Disciplinas</h4>
                    {provaDetalhe.disciplinas.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma disciplina associada.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {provaDetalhe.disciplinas.map((disciplina) => (
                          <Badge key={disciplina.id} variant="outline">
                            {disciplina.designacao}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <h4 className="mb-3 font-semibold">Perguntas</h4>
                  {provaDetalhe.perguntas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma pergunta associada.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {provaDetalhe.perguntas.map((pergunta, index) => (
                        <div
                          key={pergunta.id}
                          className="rounded-md border bg-background p-4"
                        >
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              Pergunta {index + 1}
                            </Badge>
                            <Badge variant="outline">
                              {pergunta.tipo_pergunta}
                            </Badge>
                            <Badge variant="outline">
                              {pergunta.disciplina}
                            </Badge>
                            <Badge variant="outline">
                              {pergunta.respostas.length} respostas
                            </Badge>
                          </div>
                          <div className="rounded-md border bg-muted/20 p-4">
                            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                              Enunciado
                            </p>
                            <div className="min-w-0">
                              <QuestionContent value={pergunta.pergunta_texto} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingId(undefined)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creating || !!editing} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Prova" : "Nova Prova"}</DialogTitle>
            <DialogDescription>
              Preencha os campos conforme o contrato do backend.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição *</Label>
              <Input
                value={form.descricao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Senha {editing ? "" : "*"}</Label>
              <Input
                value={form.senhaProva}
                placeholder={editing ? "Manter senha atual" : ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    senhaProva: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Ano Letivo *</Label>
              <Select
                value={form.anoLetivoId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, anoLetivoId: value }))
                }
                disabled={isLoadingAcademicYears}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar ano letivo" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((ano) => (
                    <SelectItem key={ano.codigo} value={String(ano.codigo)}>
                      {ano.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duração em minutos *</Label>
              <Input
                type="number"
                min={1}
                value={form.duracao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    duracao: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Cursos</Label>
              <SelectionList
                value={form.cursos}
                items={cursos}
                isLoading={isLoadingCursos}
                emptyMessage="Nenhum curso encontrado."
                getId={(curso) => curso.codigo}
                getLabel={(curso) => curso.designacao}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    cursos: value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                {parseIdValues(form.cursos).length} curso(s) selecionado(s)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Disciplinas</Label>
              <SelectionList
                value={form.disciplinas}
                items={disciplinas}
                isLoading={isLoadingDisciplinas}
                emptyMessage="Nenhuma disciplina encontrada."
                getId={(disciplina) => disciplina.id}
                getLabel={(disciplina) => disciplina.designacao}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    disciplinas: value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                {parseIdValues(form.disciplinas).length} disciplina(s)
                selecionada(s)
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Perguntas</Label>
              <Input
                value={form.perguntas}
                placeholder="Ex: 1, 2, 3"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    perguntas: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Texto/Instruções</Label>
              <Textarea
                value={form.texto}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    texto: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Guardar alterações" : "Criar prova"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar prova?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. A prova{" "}
              <strong>{deleting?.descricao}</strong> será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A eliminar..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
