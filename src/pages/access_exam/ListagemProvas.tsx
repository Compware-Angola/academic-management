import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  Home,
  ListChecks,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  useCreateProva,
  useDeleteProva,
  useProvaById,
  useProvas,
  useUpdateProva,
} from "@/hooks/access_exam/use-provas";
import { usePerguntas } from "@/hooks/access_exam/use-exames-de-acesso.hooks";
import { useDisciplinasList } from "@/hooks/access_exam/use-tipos-disciplinas.hooks";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { ProvaResumo } from "@/services/access_exam/provas.service";
import { parseFilter } from "@/util/parse-filter";
import { DeleteProvaDialog } from "./components/DeleteProvaDialog";
import { ProvaDetailsDialog } from "./components/ProvaDetailsDialog";
import {
  ProvaFormDialog,
  type ProvaForm,
} from "./components/ProvaFormDialog";
import { ProvasTable } from "./components/ProvasTable";

const PAGE_SIZE = 10;

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

function refsToText(refs?: { id: number }[]) {
  return refs?.map((item) => item.id).join(", ") ?? "";
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
  const { data: perguntasResponse, isLoading: isLoadingPerguntas } =
    usePerguntas({ page: 1, limit: 100 });

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
  const perguntas = perguntasResponse?.data ?? [];
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

      <ProvasTable
        provas={provas}
        isLoading={isLoading}
        onView={setViewingId}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

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

      <ProvaDetailsDialog
        open={!!viewingId}
        provaDetalhe={provaDetalhe}
        isLoading={isLoadingDetalhe}
        onClose={() => setViewingId(undefined)}
      />

      <ProvaFormDialog
        open={creating || !!editing}
        isEditing={!!editing}
        form={form}
        setForm={setForm}
        academicYears={academicYears}
        isLoadingAcademicYears={isLoadingAcademicYears}
        disciplinas={disciplinas}
        isLoadingDisciplinas={isLoadingDisciplinas}
        isSaving={isSaving}
        onClose={closeForm}
        onSave={handleSave}
      />

      <DeleteProvaDialog
        prova={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
