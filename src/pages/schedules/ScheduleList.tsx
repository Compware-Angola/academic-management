// src/pages/SchedulesByUC.tsx
import { useState, useMemo } from "react";
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
  Home,
  Search,
  Eye,
  Loader2,
  Plus,
  Trash2,
  Check,
  X,
  Pencil,
} from "lucide-react";

import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

// Importações para o Dialog de Confirmação
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Certifique-se de que este caminho está correto

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

import { FormSelect } from "@/components/common/FormSelect";
import { Badge } from "@/components/ui/badge";
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";

import { useMutationDisponibilidadeHorario } from "@/hooks/horario/use-mutation-update-disponibilidade-horario";
import { Switch } from "@/components/ui/switch";
import { useMutationValidarHorarioDirector } from "@/hooks/horario/use-query-validar-horario-director";
import { useToast } from "@/hooks/use-toast";
import { useMutationDeletarHorario } from "@/hooks/horario/use-query-delete-schedule";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

export default function ScheduleList() {
  const { user:userData } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  // === Estados para os Diálogos de Confirmação ===
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [itemIdToConfirm, setItemIdToConfirm] = useState<number | null>(null);
  // ==============================================

  const deleteMutation = useMutationDeletarHorario();

  const mutation = useMutationDisponibilidadeHorario();

  const validarMutation = useMutationValidarHorarioDirector();
  // Filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });

  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // === Dados base ===
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
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

  // Memorizar parâmetros para evitar re-renders infinitos
  const queryParams = useMemo(
    () => ({
      anoLectivo: Number(filters.anoLetivo),
      semestre: Number(filters.semestre),
      periodo: Number(filters.periodo),
      curso: Number(filters.curso),
      unidadeCurricular: Number(filters.unidadeCurricular),
      page,
      limit,
    }),
    [filters, page, limit]
  );

  const {
    data: ScheduleResponse,
    isLoading: isLoadingSchedule,
    isError,
    refetch: refetchHorarios,
  } = useQueryHorariosExistentes(queryParams);

  // === Funções de Ação com Confirmação ===

  const handleDeleteConfirmed = async () => {
    if (itemIdToConfirm) {
      deleteMutation.mutate({
        horarioId: itemIdToConfirm,
        userId: userData.user.pk_utilizador,
      });
    }
  };

  const handleValidateConfirmed = async () => {
    if (itemIdToConfirm) {
      validarMutation.mutate({
        horarioId: itemIdToConfirm,
      userId: userData.user.pk_utilizador,
      });
    }
  };

  const openDeleteDialog = (horarioId: number) => {
    setItemIdToConfirm(horarioId);
    setIsDeleteDialogOpen(true);
  };

  const openValidateDialog = (horarioId: number) => {
    setItemIdToConfirm(horarioId);
    setIsValidateDialogOpen(true);
  };

  const openDetails = async (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };

  // ========================================

  const tableData = ScheduleResponse?.data || [];
  const total = ScheduleResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Listar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Horário Existentes
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os Horário criadas por ano letivo, semestre,
            período, curso e ano curricular.
          </p>
        </div>
        <Button onClick={() => navigate("/horarios/criar")}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Horário
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <FormSelect
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              label="Ano Letivo"
              value={filters.anoLetivo}
              onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              options={anosAcademicos}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <FormSelect
              disabled={isLoadingSemestres}
              loading={isLoadingSemestres}
              label="Semestre"
              value={filters.semestre}
              onChange={(v) => setFilters({ ...filters, semestre: v })}
              options={semestres}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) => setFilters({ ...filters, periodo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {periodos?.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo.toString()}>
                      {p.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                setFilters({
                  ...filters,
                  curso: v,

                  unidadeCurricular: "",
                })
              }
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    anoCurricular: v,
                    unidadeCurricular: "",
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filters.curso ? "Todos os anos" : "Selecione curso"
                    }
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
          </div>
        </CardContent>
      </Card>

      {/* Tabela    */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum registo encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Não foram encontrados horários com os filtros aplicados.
              </p>
              <Button onClick={() => navigate("/horarios/criar")}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Horário
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designação</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Capacidade</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Disponibilidade</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.designacao}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.unidadecurricular}</TableCell>
                        <TableCell>{item.ano}</TableCell>
                        <TableCell>{item.capacidade}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.estado.toLowerCase().includes("pendente") ||
                              item.estado.toLowerCase().includes("distribuição")
                                ? "secondary"
                                : "default"
                            }
                          >
                            {item.estado}
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={item.disponibilidade === "Disponivel"}
                            disabled={mutation.isPending}
                            onCheckedChange={() =>
                              mutation.mutateAsync({
                                horarioId: item.codigo,
                                userId: userData.user.pk_utilizador,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.datacriacao}
                        </TableCell>
                        <TableCell className="w-40 min-w-40">
                          <div className="flex items-center space-x-2 justify-center">
                            {/* 1. Botão de Detalhes (Eye) */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetails(item.codigo)}
                              title="Ver Detalhes"
                              aria-label="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Editar horário"
                              onClick={() =>
                                navigate(`/schedule/${item.codigo}/edit`)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => openDeleteDialog(item.codigo)}
                              title="Excluir Horário"
                              aria-label="Excluir Horário"
                              disabled={
                                deleteMutation.isPending &&
                                itemIdToConfirm === item.codigo
                              }
                            >
                              {deleteMutation.isPending &&
                              itemIdToConfirm === item.codigo ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>

                            {/* 3. Botão de Validar (Check) - Abre o Dialog se PENDENTE */}
                            {Number(item.estadoid) == 2 && (
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() => openValidateDialog(item.codigo)}
                                disabled={
                                  validarMutation.isPending &&
                                  itemIdToConfirm === item.codigo
                                }
                                title="Validar Horário"
                                aria-label="Validar Horário"
                                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                              >
                                {validarMutation.isPending &&
                                itemIdToConfirm === item.codigo ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {tableData.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
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
                    <SelectTrigger className="w-20">
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

      {/* Modal de Detalhes */}
      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />

      {/* === Diálogo de Confirmação de Exclusão === */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O horário selecionado será removido
              permanentemente do servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setItemIdToConfirm(null);
              }}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ======================================== */}

      {/* === Diálogo de Confirmação de Validação === */}
      <AlertDialog
        open={isValidateDialogOpen}
        onOpenChange={setIsValidateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja validar este Horário?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao validar, você confirma que o horário está correto e pode ser
              usado. Esta ação não pode ser desfeita facilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsValidateDialogOpen(false);
                setItemIdToConfirm(null);
              }}
              disabled={validarMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleValidateConfirmed}
              disabled={validarMutation.isPending}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              {validarMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Validar Horário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ========================================== */}
    </div>
  );
}
