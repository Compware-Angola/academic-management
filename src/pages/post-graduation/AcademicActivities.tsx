import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Plus, RefreshCw, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useMutationfetchDeleteActivity } from "@/hooks/academiccalendar/use-mutation-delete-activity";
import { useMutationfetchCreateActivity } from "@/hooks/academiccalendar/use-mutation-create-activity";
import { useMutationActivity } from "@/hooks/academiccalendar/use-mutation-update-activity";
import { useQueryTypeCalendar } from "@/hooks/academiccalendar/use-query-type-calendar";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryAtividades } from "@/hooks/queries/use-query-atividades";
import { Atividade } from "@/services/fetch-atividade";
import { formatarData, formatDateForInput } from "@/util/date-formate";
import { useToast } from "@/hooks/use-toast";
import {
  CreateAcademicActivityForm,
  CreateAcademicActivityModal,
} from "./components/CreateAcademicActivityModal";
import {
  EditAcademicActivityForm,
  EditAcademicActivityModal,
} from "./components/EditAcademicActivityModal";

type FiltersState = {
  academicYearId: string;
  degreeId: string;
};

const initialFilters: FiltersState = {
  academicYearId: "",
  degreeId: "",
};

const ITEMS_PER_PAGE = 10;
const MASTERS_DEGREE_ID = "2";
const initialCreateForm: CreateAcademicActivityForm = {
  designacao: "",
  codigo_ano_lectivo: "",
  codigo_tipo_candidatura: "",
  codigo_tipo_calendario: "",
  data_inicio: "",
  data_fim: "",
};

export default function PostGraduationAcademicActivities() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterError, setFilterError] = useState("");
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<EditAcademicActivityForm | null>(null);
  const [editValidationError, setEditValidationError] = useState("");
  const [activityToDelete, setActivityToDelete] =
    useState<Atividade | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateAcademicActivityForm>(initialCreateForm);
  const [createValidationError, setCreateValidationError] = useState("");

  const { toast } = useToast();
  const createActivityMutation = useMutationfetchCreateActivity();
  const updateActivityMutation = useMutationActivity();
  const deleteActivityMutation = useMutationfetchDeleteActivity();

  const { data: academicYears = [], isLoading: isLoadingAcademicYears } =
    useQueryAnoAcademico();
  const {
    data: degreesResponse,
    isLoading: isLoadingDegrees,
    isError: isDegreesError,
  } = useQueryPostGraduationDegrees();
  const {
    data: calendarTypes = [],
    isLoading: isLoadingCalendarTypes,
  } = useQueryTypeCalendar();

  const {
    data: activities = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQueryAtividades({
    anoLetivoId: filters.academicYearId,
    tipoCandidaturaId: filters.degreeId,
  });

  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree) => degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(activities.length / ITEMS_PER_PAGE),
  );

  const paginatedActivities = useMemo(
    () =>
      activities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [activities, currentPage],
  );

  useEffect(() => {
    if (
      hasInitializedFilters ||
      academicYears.length === 0 ||
      degrees.length === 0
    ) {
      return;
    }

    const activeAcademicYear = academicYears.find((year) =>
      ["activo", "ativo"].includes(year.estado?.trim().toLowerCase()),
    );
    const mastersDegree = degrees.find(
      (degree) => String(degree.id) === MASTERS_DEGREE_ID,
    );

    if (!activeAcademicYear || !mastersDegree) {
      setFilterError(
        !activeAcademicYear
          ? "Não foi encontrado um ano lectivo ativo."
          : "Não foi possível selecionar o grau Mestrado.",
      );
      setHasInitializedFilters(true);
      return;
    }

    setFilters({
      academicYearId: String(activeAcademicYear.codigo),
      degreeId: String(mastersDegree.id),
    });
    setHasInitializedFilters(true);
  }, [academicYears, degrees, hasInitializedFilters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Descrição", accessor: "descricao" },
    {
      header: "Data de início",
      accessor: "data_inicio",
      cell: (activity: Atividade) => formatarData(activity.data_inicio),
    },
    {
      header: "Data de término",
      accessor: "data_termino",
      cell: (activity: Atividade) => formatarData(activity.data_termino),
    },
    { header: "Ano lectivo", accessor: "ano_lectivo" },
    { header: "Grau", accessor: "tipo_candidatura" },
    { header: "Tipo de calendário", accessor: "tipo_calendario" },
    {
      header: "Criado por",
      accessor: "descricao_utilizador",
      cell: (activity: Atividade) =>
        activity.descricao_utilizador?.trim() || "-",
    },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (activity: Atividade) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Editar atividade"
            onClick={() => handleOpenEdit(activity)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Eliminar atividade"
            onClick={() => setActivityToDelete(activity)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  function handleFilterChange(key: keyof FiltersState, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
    setCurrentPage(1);
    setFilterError("");
  }

  function handleRefresh() {
    if (filters.academicYearId && filters.degreeId) {
      refetch();
    }
  }

  function handleOpenCreate() {
    setCreateValidationError("");
    setCreateForm({
      ...initialCreateForm,
      codigo_ano_lectivo: filters.academicYearId,
      codigo_tipo_candidatura: filters.degreeId,
    });
    setIsCreateModalOpen(true);
  }

  async function handleCreateActivity() {
    const {
      designacao,
      codigo_ano_lectivo,
      codigo_tipo_candidatura,
      codigo_tipo_calendario,
      data_inicio,
      data_fim,
    } = createForm;

    if (
      !designacao.trim() ||
      !codigo_ano_lectivo ||
      !codigo_tipo_candidatura ||
      !codigo_tipo_calendario ||
      !data_inicio ||
      !data_fim
    ) {
      setCreateValidationError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (data_inicio > data_fim) {
      setCreateValidationError(
        "A data de início não pode ser posterior à data de término.",
      );
      return;
    }

    setCreateValidationError("");

    try {
      await createActivityMutation.mutateAsync({
        designacao: designacao.trim(),
        codigo_ano_lectivo: Number(codigo_ano_lectivo),
        codigo_tipo_candidatura: Number(codigo_tipo_candidatura),
        codigo_tipo_calendario: Number(codigo_tipo_calendario),
        data_inicio,
        data_fim,
      });
      setIsCreateModalOpen(false);
      setCreateForm(initialCreateForm);
      toast({
        title: "Atividade criada",
        description: "A atividade letiva foi criada com sucesso.",
      });
    } catch {
      // A mensagem de erro é apresentada pelo hook compartilhado.
    }
  }

  function handleOpenEdit(activity: Atividade) {
    setEditValidationError("");
    setEditingActivity({
      codigo: Number(activity.codigo),
      designacao: activity.descricao,
      codigo_ano_lectivo: String(activity.cod_ano_lectivo),
      codigo_tipo_candidatura: Number(
        activity.codigo_tipo_candidatura,
      ),
      codigo_tipo_calendario: Number(activity.codigo_tipo_calendario),
      tipo_candidatura: activity.tipo_candidatura,
      tipo_calendario: activity.tipo_calendario,
      data_inicio: formatDateForInput(activity.data_inicio),
      data_fim: formatDateForInput(activity.data_termino),
    });
  }

  async function handleUpdateActivity() {
    if (!editingActivity) return;

    const {
      codigo,
      designacao,
      codigo_ano_lectivo,
      codigo_tipo_candidatura,
      codigo_tipo_calendario,
      data_inicio,
      data_fim,
    } = editingActivity;

    if (
      !codigo ||
      !designacao.trim() ||
      !codigo_ano_lectivo ||
      !codigo_tipo_candidatura ||
      !codigo_tipo_calendario ||
      !data_inicio ||
      !data_fim
    ) {
      setEditValidationError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (data_inicio > data_fim) {
      setEditValidationError(
        "A data de início não pode ser posterior à data de término.",
      );
      return;
    }

    setEditValidationError("");

    try {
      await updateActivityMutation.mutateAsync({
        codigo,
        designacao: designacao.trim(),
        codigo_ano_lectivo: Number(codigo_ano_lectivo),
        codigo_tipo_candidatura,
        codigo_tipo_calendario,
        data_inicio,
        data_fim,
      });
      setEditingActivity(null);
    } catch {
      // A mensagem de erro é apresentada pelo hook compartilhado.
    }
  }

  async function handleDeleteActivity() {
    if (!activityToDelete) return;

    try {
      await deleteActivityMutation.mutateAsync(activityToDelete.codigo);
      setActivityToDelete(null);
      toast({
        title: "Atividade eliminada",
        description: "A atividade letiva foi eliminada com sucesso.",
      });
    } catch {
      // A mensagem de erro é apresentada pelo hook compartilhado.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atividades Letivas de Pós-Graduação"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={
                !filters.academicYearId || !filters.degreeId || isFetching
              }
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
            <Button
              size="sm"
              onClick={handleOpenCreate}
              disabled={
                !filters.academicYearId ||
                !filters.degreeId ||
                isLoadingCalendarTypes
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova atividade
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo</label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) =>
                  handleFilterChange("academicYearId", value)
                }
                disabled={isLoadingAcademicYears}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingAcademicYears
                        ? "Carregando anos..."
                        : "Selecione o ano lectivo"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem
                      key={year.codigo}
                      value={String(year.codigo)}
                    >
                      {year.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Grau</label>
              <Select
                value={filters.degreeId}
                onValueChange={(value) =>
                  handleFilterChange("degreeId", value)
                }
                disabled={isLoadingDegrees || isDegreesError}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingDegrees
                        ? "Carregando graus..."
                        : "Selecione o grau"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem
                      key={degree.id}
                      value={String(degree.id)}
                    >
                      {degree.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isDegreesError && (
                <p className="text-sm text-destructive">
                  Não foi possível carregar os graus.
                </p>
              )}
            </div>
          </div>

          {filterError && (
            <p className="mt-3 text-sm text-destructive">{filterError}</p>
          )}

        </CardContent>
      </Card>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar as atividades</AlertTitle>
          <AlertDescription>
            Não foi possível consultar as atividades letivas de
            Pós-Graduação.
          </AlertDescription>
        </Alert>
      )}

      {filters.academicYearId && filters.degreeId ? (
        <>
          <div className="font-semibold text-primary">
            Total de atividades: {activities.length}
          </div>

          <DataTable
            columns={columns}
            data={paginatedActivities}
            loading={isLoading || isFetching}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertTitle>Consulta de atividades letivas</AlertTitle>
          <AlertDescription>
            {isLoadingAcademicYears || isLoadingDegrees
              ? "A preparar os filtros iniciais..."
              : "Não foi possível inicializar os filtros da consulta."}
          </AlertDescription>
        </Alert>
      )}

      <CreateAcademicActivityModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setCreateValidationError("");
          }
        }}
        form={createForm}
        setForm={setCreateForm}
        academicYears={academicYears}
        degrees={degrees}
        calendarTypes={calendarTypes}
        isLoadingCalendarTypes={isLoadingCalendarTypes}
        isSubmitting={createActivityMutation.isPending}
        validationError={createValidationError}
        onSubmit={handleCreateActivity}
      />

      <EditAcademicActivityModal
        open={Boolean(editingActivity)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingActivity(null);
            setEditValidationError("");
          }
        }}
        form={editingActivity}
        setForm={setEditingActivity}
        academicYears={academicYears}
        isSubmitting={updateActivityMutation.isPending}
        validationError={editValidationError}
        onSubmit={handleUpdateActivity}
      />

      <AlertDialog
        open={Boolean(activityToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteActivityMutation.isPending) {
            setActivityToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar atividade letiva?</AlertDialogTitle>
            <AlertDialogDescription>
              A atividade “{activityToDelete?.descricao}” deixará de aparecer
              na listagem. Esta operação não altera outras atividades.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteActivityMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteActivity}
              disabled={deleteActivityMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteActivityMutation.isPending
                ? "Eliminando..."
                : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
