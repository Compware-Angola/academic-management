import { useMemo, useState } from "react";
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
  Pencil,
  UserCheck,
} from "lucide-react";

import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

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
import { Badge } from "@/components/ui/badge";
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";

import { useMutationDisponibilidadeHorario } from "@/hooks/horario/use-mutation-update-disponibilidade-horario";
import { Switch } from "@/components/ui/switch";
import { useMutationValidarHorarioDirector } from "@/hooks/horario/use-query-validar-horario-director";
import { useMutationDeletarHorario } from "@/hooks/horario/use-query-delete-schedule";
import { useAuth } from "@/hooks/use-auth";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

import { PermissionTypeDetails } from "@/constants/permission.type";
import { usePermission } from "@/auth/permission.helper";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import { ExcelActions } from "@/components/views/excel/GenericExcelExport";
import { useMutationCriarDocenteSubstituto } from "@/hooks/horario/use-mutation-criar-docente-substituto";
import DocenteSubstitutoModal from "./components/DocenteSubstitutoModal";
import { Roles } from "./EditSchedule";

export default function ScheduleList() {
  const { user: userData } = useAuth();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [itemIdToConfirm, setItemIdToConfirm] = useState<number | null>(null);

  const [isSubstitutoModalOpen, setIsSubstitutoModalOpen] = useState(false);
  const [selectedHorarioForSubstituto, setSelectedHorarioForSubstituto] = useState<number | null>(null);

  const { haveFullAccess } = usePermission();
  const roles = userData?.roles as Roles | undefined;
  const criarSubstitutoMutation = useMutationCriarDocenteSubstituto();
  const openSubstitutoModal = (horarioId?: number) => {
    setSelectedHorarioForSubstituto(horarioId || null);
    setIsSubstitutoModalOpen(true);
  };

  const isPrivilegedUser: boolean =
    haveFullAccess() ||
    roles?.Reitor === true ||
    roles?.Vice_Reitor === true ||
    roles?.Acessor_do_Reitor === true ||
    roles?.Coordenador === true ||
    roles?.Decano === true ||
    roles?.Director === true
  // Filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    estado: "",
    afetacaoDocente: "",
  });

  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Dados base
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

  // ==============================================
  // Parâmetros da query - sem useMemo problemático
  // ==============================================
  const queryParams = {
    page,
    limit,
    anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    periodo: filters.periodo ? Number(filters.periodo) : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    unidadeCurricular: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : undefined,
    ...(filters.afetacaoDocente != null &&
      filters.afetacaoDocente !== "" &&
      !isNaN(Number(filters.afetacaoDocente)) && {
      afetacaoDocente: Number(filters.afetacaoDocente),
    }),

    ...(filters.estado != null &&
      filters.estado !== "" &&
      !isNaN(Number(filters.estado)) && {
      estado: Number(filters.estado),
    }),
  };

  const {
    data: ScheduleResponse,
    isLoading: isLoadingSchedule,
    refetch: refetchHorarios,
  } = useQueryHorariosExistentes(queryParams);

  const deleteMutation = useMutationDeletarHorario();
  const mutation = useMutationDisponibilidadeHorario();
  const validarMutation = useMutationValidarHorarioDirector();

  const tableData = ScheduleResponse?.data || [];
  const total = ScheduleResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Funções de ação
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

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };
  // ====================== EXPORTAÇÃO PDF + EXCEL ======================

  const exportRows = useMemo(() =>
    tableData.map((item) => ({
      designacao: item.designacao ?? "—",
      curso: item.curso ?? "—",
      unidadeCurricular: item.unidadecurricular ?? "—",
      anoCurricular: item.ano ?? "—",
      capacidade: item.capacidade ?? "—",
      estado: item.estado ?? "—",
      disponibilidade: item.disponibilidade ?? "—",
      criadoEm: item.datacriacao ?? "—",
      criadoPor: item.criadopor ?? "—",
      atualizadoPor: item.atualizadopor ?? "—",
    })),
    [tableData]
  );

  // Filtros aplicados para mostrar no documento
  const filtrosAplicados = [
    filters.anoLetivo ? `Ano Letivo: ${filters.anoLetivo}` : null,
    filters.semestre ? `Semestre: ${filters.semestre}` : null,
    filters.periodo ? `Período: ${filters.periodo}` : null,
    filters.curso ? `Curso: ${filters.curso}` : null,
    filters.anoCurricular && filters.anoCurricular !== "all"
      ? `Ano Curricular: ${filters.anoCurricular}`
      : null,
    filters.unidadeCurricular ? `Unidade Curricular: ${filters.unidadeCurricular}` : null,
    filters.estado ? `Estado: ${filters.estado}` : null,
    filters.afetacaoDocente ? `Docente: ${filters.afetacaoDocente}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const pdfData = exportRows.length
    ? {
      filtros: filtrosAplicados || "Sem filtros aplicados",
      rows: exportRows,
    }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Horários Existentes"
      subtitle="Lista de horários por curso, semestre e ano letivo"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "designacao", label: "Designação", width: "20%" },
          { key: "curso", label: "Curso", width: "15%" },
          { key: "unidadeCurricular", label: "Unidade Curricular", width: "20%" },
          { key: "anoCurricular", label: "Ano Curricular", width: "10%" },
          { key: "capacidade", label: "Capacidade", width: "8%" },
          { key: "estado", label: "Estado", width: "10%" },
          { key: "disponibilidade", label: "Disponibilidade", width: "10%" },
          { key: "criadoEm", label: "Criado Em", width: "12%" },
          { key: "criadoPor", label: "Criado Por", width: "12%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Horários Existentes",
      subtitle: "Lista de horários por curso, semestre e ano letivo",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "designacao", label: "Designação", width: 30 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "unidadeCurricular", label: "Unidade Curricular", width: 35 },
          { key: "anoCurricular", label: "Ano Curricular", width: 15 },
          { key: "capacidade", label: "Capacidade", width: 12 },
          { key: "estado", label: "Estado", width: 15 },
          { key: "disponibilidade", label: "Disponibilidade", width: 15 },
          { key: "criadoEm", label: "Criado Em", width: 18 },
          { key: "criadoPor", label: "Criado Por", width: 20 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;

  const baseFileName = `Horarios_Existentes_${new Date().toISOString().slice(0, 10)}`;
  return (
    <div className="p-12 space-y-12">
      {/* Breadcrumb e título */}
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
            Horários Existentes
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os horários criados por ano letivo, semestre,
            período, curso e ano curricular.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Botão Criar Horário */}


          {/* === BOTÕES DE EXPORTAÇÃO === */}
          {pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`${baseFileName}.pdf`}
              showDownload
              showPrint
            />
          )}

          {excelProps && (
            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>

          {/* Botão Limpar Filtros */}
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setFilters({
                anoLetivo: "",
                semestre: "",
                periodo: "",
                curso: "",
                anoCurricular: "",
                unidadeCurricular: "",
                estado: "",
                afetacaoDocente: "",
              });

              setPage(1);
            }}
            className=" hover:text-foreground hover:bg-muted/50"
            disabled={
              !filters.anoLetivo &&
              !filters.semestre &&
              !filters.periodo &&
              !filters.curso &&
              !filters.anoCurricular &&
              !filters.unidadeCurricular
            }
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

            <FormSelect
              label="Estado do Horário"
              disabled={isLoadingSchedule || isLoadingAcademicYear}
              value={filters.estado || ""}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={[
                { codigo: null, designacao: "Todos" },
                { codigo: "2", designacao: "Pendente" },
                { codigo: "3", designacao: "Validado" },
              ]}
              map={(option) => ({
                key: option.codigo,
                label: option.designacao,
                value: option.codigo,
              })}
            />
            <FormSelect
              label="Docente"
              disabled={isLoadingSchedule || isLoadingAcademicYear}
              value={filters.afetacaoDocente || ""}
              onChange={(v) => setFilters({ ...filters, afetacaoDocente: v })}
              options={[
                { codigo: null, designacao: "Todos" },
                { codigo: "1", designacao: "Com Docente" },
                { codigo: "2", designacao: "Sem Docente" },
              ]}
              map={(option) => ({
                key: option.codigo,
                label: option.designacao,
                value: option.codigo,
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Encontrados</CardTitle>
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
                      <TableHead>Criado por</TableHead>
                      <TableHead>Atualizado por</TableHead>
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
                        <TableCell className="text-sm text-muted-foreground">
                          {item.criadopor}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.atualizadopor}
                        </TableCell>
                        <TableCell className="w-48 min-w-48">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {/* Ver Detalhes */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetails(item.codigo)}
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Editar Horário */}
                            <Button
                              variant="outline"
                              size="icon"
                              title="Editar horário"
                              onClick={() => navigate(`/schedule/${item.codigo}/edit`)}
                              disabled={!isPrivilegedUser}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Nova Substituição - NOVO BOTÃO */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openSubstitutoModal(item.codigo)}
                              title="Nova Substituição de Docente"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
                              disabled={!isPrivilegedUser}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>

                            {/* Eliminar */}
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => openDeleteDialog(item.codigo)}
                              disabled={
                                deleteMutation.isPending && itemIdToConfirm === item.codigo ||
                                !isPrivilegedUser
                              }
                            >
                              {deleteMutation.isPending && itemIdToConfirm === item.codigo ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>

                            {/* Validar (condicional) */}
                            {Number(item.estadoid) === 2 && hasPermission(PermissionTypeDetails.VALIDACAO_HORARIO.sigla) && (
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() => openValidateDialog(item.codigo)}
                                disabled={
                                  validarMutation.isPending && itemIdToConfirm === item.codigo ||
                                  !isPrivilegedUser
                                }
                                className="bg-green-500 hover:bg-green-600"
                              >
                                {validarMutation.isPending && itemIdToConfirm === item.codigo ? (
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
                      setPage(1); // reset para página 1 ao mudar limite
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

      {/* Modal e Dialogs */}
      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}

      />
      <DocenteSubstitutoModal
        isOpen={isSubstitutoModalOpen}
        onClose={() => {
          setIsSubstitutoModalOpen(false);
          setSelectedHorarioForSubstituto(null);
        }}
        horarioId={selectedHorarioForSubstituto}
        mutation={criarSubstitutoMutation}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O horário será removido permanentemente.
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
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isValidateDialogOpen}
        onOpenChange={setIsValidateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja validar este Horário?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao validar, você confirma que o horário está correto e pode ser
              usado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={validarMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleValidateConfirmed}
              disabled={validarMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {validarMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Validar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
