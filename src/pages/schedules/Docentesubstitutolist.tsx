import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  Search,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  UserCheck,
  Calendar,
  Save,
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

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

import { FormSelect } from "@/components/common/FormSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { Badge } from "@/components/ui/badge";

import { useQueryDocenteSubstituto } from "@/hooks/horario/use-docente-substituto";
import { useMutationDeletarDocenteSubstituto } from "@/hooks/horario/use-mutation-deletar-docente-substituto";
import { useMutationAtualizarDocenteSubstituto } from "@/hooks/horario/use-mutation-atualizar-docente-substituto";
import { DocenteSubstituto } from "@/services/horario/listar-docente-substituto.service";


type EditForm = {
  fkDocenteOriginal: string;
  fkDocenteSubstituto: string;
  fkHorario: string;
  dataInicio: string;
  dataTermino: string;
  obs: string;
};

export default function DocenteSubstitutoList() {
  const navigate = useNavigate();

  // Delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null);

  // Edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemIdToEdit, setItemIdToEdit] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    fkDocenteOriginal: "",
    fkDocenteSubstituto: "",
    fkHorario: "",
    dataInicio: "",
    dataTermino: "",
    obs: "",
  });

  // Filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    fkDocenteOriginal: "",
    fkDocenteSubstituto: "",
    dataInicio: "",
    dataTermino: "",
  });

  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Dados base
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const { data: cursos } = useCursos();

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe:
        filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });

  // Parâmetros da query
  const queryParams = {
    page,
    limit,
    anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    periodo: filters.periodo ? Number(filters.periodo) : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    unidadeCurricular: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : undefined,
    fkDocenteOriginal: filters.fkDocenteOriginal
      ? Number(filters.fkDocenteOriginal)
      : undefined,
    fkDocenteSubstituto: filters.fkDocenteSubstituto
      ? Number(filters.fkDocenteSubstituto)
      : undefined,
    dataInicio: filters.dataInicio || undefined,
    dataTermino: filters.dataTermino || undefined,
  };

  const {
    data: substitutoResponse,
    isLoading: isLoadingSubstitutos,
  } = useQueryDocenteSubstituto(queryParams);

  const deleteMutation = useMutationDeletarDocenteSubstituto();
  const updateMutation = useMutationAtualizarDocenteSubstituto();

  const tableData = substitutoResponse?.data || [];
  const total = substitutoResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // ===== DELETE =====
  const handleDeleteConfirmed = () => {
    if (itemIdToDelete) {
      deleteMutation.mutate(
        { id: itemIdToDelete },
        { onSuccess: () => setIsDeleteDialogOpen(false) }
      );
    }
  };

  const openDeleteDialog = (id: number) => {
    setItemIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // ===== EDIT =====
  // Converte data DD/MM/YYYY → YYYY-MM-DD para input[type=date]
  const parseDate = (d: string | null) => {
    if (!d) return "";
    const parts = d.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return d;
  };

  const openEditDialog = (item: DocenteSubstituto) => {
    setItemIdToEdit(item.codigo);
    setEditForm({
      fkDocenteOriginal: String(item.fkdocenteoriginal ?? ""),
      fkDocenteSubstituto: String(item.fkdocentesubstituto ?? ""),
      fkHorario: String(item.fkhorario ?? ""),
      dataInicio: parseDate(item.datainicio),
      dataTermino: parseDate(item.datatermino),
      obs: item.obs ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditConfirmed = () => {
    if (!itemIdToEdit) return;
    updateMutation.mutate(
      {
        id: itemIdToEdit,
        fkDocenteOriginal: Number(editForm.fkDocenteOriginal),
        fkDocenteSubstituto: Number(editForm.fkDocenteSubstituto),
        fkHorario: Number(editForm.fkHorario),
        dataInicio: editForm.dataInicio,
        dataTermino: editForm.dataTermino || undefined,
        obs: editForm.obs || undefined,
      },
      { onSuccess: () => setIsEditDialogOpen(false) }
    );
  };

  // ===== FILTROS =====
  const limparFiltros = () => {
    setFilters({
      anoLetivo: "",
      semestre: "",
      periodo: "",
      curso: "",
      anoCurricular: "",
      unidadeCurricular: "",
      fkDocenteOriginal: "",
      fkDocenteSubstituto: "",
      dataInicio: "",
      dataTermino: "",
    });
    setPage(1);
  };

  const filtrosAtivos =
    !!filters.anoLetivo ||
    !!filters.semestre ||
    !!filters.periodo ||
    !!filters.curso ||
    !!filters.anoCurricular ||
    !!filters.unidadeCurricular ||
    !!filters.dataInicio ||
    !!filters.dataTermino;

  return (
    <div className="p-12 space-y-12">
      {/* Breadcrumb e título */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Docentes Substitutos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Docentes Substitutos
          </h1>
          <p className="text-muted-foreground">
            Gerencie as substituições de docentes por horário, período e curso.
          </p>
        </div>
       
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={limparFiltros}
            disabled={!filtrosAtivos}
          >
            Limpar Filtros
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormSelect
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              label="Ano Letivo"
              value={filters.anoLetivo}
              onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              options={anosAcademicos}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
            />

            <FormSelect
              disabled={isLoadingSemestres}
              loading={isLoadingSemestres}
              label="Semestre"
              value={filters.semestre}
              onChange={(v) => setFilters({ ...filters, semestre: v })}
              options={semestres}
              map={(s) => ({ key: s.codigo, label: s.designacao, value: s.codigo })}
            />

           <div className="space-y-2">
            <FormSelect
              disabled={isLoadingPeriodos || isLoadingAcademicYear || filters.anoLetivo === ""}
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.periodo?.toString() ?? "all"}
              onChange={(v) => setFilters((p) => ({ ...p, periodo: v === "all" ? undefined : v, page: 1 }))}
              options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
              map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
            />
          </div>
            <FormCommandSelect
              value={filters.curso}
              label="Curso"
              options={cursos}
              map={(c) => ({
                key: c.codigo.toString(),
                value: c.codigo.toString(),
                label: c.designacao,
              })}
              onChange={(v) =>
                setFilters({ ...filters, curso: v, unidadeCurricular: "" })
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, anoCurricular: v, unidadeCurricular: "" })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={filters.curso ? "Todos os anos" : "Selecione curso"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormCommandSelect
              value={filters.unidadeCurricular}
              label="Unidade Curricular"
              placeholder={
                !filters.curso
                  ? "Selecione curso"
                  : !filters.semestre
                    ? "Selecione semestre"
                    : isLoadingUC
                      ? "Carregando UCs..."
                      : "Selecionar UC"
              }
              options={unidadesCurriculares}
              disabled={!canLoadUcs}
              map={(u) => ({
                key: u.pk.toString(),
                value: u.pk.toString(),
                label: u.descricao,
              })}
              onChange={(u) => setFilters({ ...filters, unidadeCurricular: u })}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={filters.dataInicio}
                onChange={(e) =>
                  setFilters({ ...filters, dataInicio: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Término</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={filters.dataTermino}
                onChange={(e) =>
                  setFilters({ ...filters, dataTermino: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Substituições Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSubstitutos ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando substituições...</p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma substituição encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Não foram encontradas substituições com os filtros aplicados.
              </p>
              <Button onClick={() => navigate("/horarios/listar")}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Substituição
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Docente Original</TableHead>
                      <TableHead>Docente Substituto</TableHead>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Horário</TableHead>
                      
                      <TableHead>Período Substituição</TableHead>
                      <TableHead>Criado por</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.nomedocenteoriginal ?? "—"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {item.fkdocenteoriginal}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.nomedocentesubstituto ?? "—"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {item.fkdocentesubstituto}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{item.unidadecurricular ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.curso ?? "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {item.designacaohorario ?? "—"}
                          </span>
                        </TableCell>
                      
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {item.datainicio ?? "—"} → {item.datatermino ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.criadopor ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.datacriacao ?? "—"}
                        </TableCell>
                        <TableCell className="w-28 min-w-28">
                          <div className="flex items-center space-x-2 justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Editar substituição"
                              onClick={() => openEditDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              title="Eliminar substituição"
                              onClick={() => openDeleteDialog(item.codigo)}
                              disabled={
                                deleteMutation.isPending &&
                                itemIdToDelete === item.codigo
                              }
                            >
                              {deleteMutation.isPending &&
                              itemIdToDelete === item.codigo ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {tableData.length} de {total} registos
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm font-medium">
                    Página {page} de {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== DIALOG EDITAR ===== */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Editar Substituição</DialogTitle>
            <DialogDescription>
              Altere os dados da substituição e clique em Guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID Docente Original</Label>
                <Input
                  type="number"
                  value={editForm.fkDocenteOriginal}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fkDocenteOriginal: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>ID Docente Substituto</Label>
                <Input
                  type="number"
                  value={editForm.fkDocenteSubstituto}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fkDocenteSubstituto: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ID Horário</Label>
              <Input
                type="number"
                value={editForm.fkHorario}
                onChange={(e) =>
                  setEditForm({ ...editForm, fkHorario: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={editForm.dataInicio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dataInicio: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Data Término</Label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={editForm.dataTermino}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dataTermino: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                placeholder="Observações sobre a substituição"
                value={editForm.obs}
                onChange={(e) =>
                  setEditForm({ ...editForm, obs: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditConfirmed} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG ELIMINAR ===== */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja eliminar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O registo de substituição será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}