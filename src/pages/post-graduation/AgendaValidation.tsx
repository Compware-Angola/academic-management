import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useMutationUpdateAgendaValidationStatus } from "@/hooks/post-graduation/use-mutation-update-agenda-validation-status";
import { useQueryAgendaValidationOptions } from "@/hooks/post-graduation/use-query-agenda-validation-options";
import { useQueryAgendaValidations } from "@/hooks/post-graduation/use-query-agenda-validations";
import { useQueryMissingAgendaValidations } from "@/hooks/post-graduation/use-query-missing-agenda-validations";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useToast } from "@/hooks/use-toast";
import type { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import type { PostGraduationAgendaValidation } from "@/services/post-graduation/fetch-agenda-validations.service";
import { viewFile } from "@/services/upload/upload-single.service";
import { formatDateTimePt } from "@/util/date-formate";
import {
  AgendaValidationDecision,
  AgendaValidationDecisionDialog,
} from "./components/AgendaValidationDecisionDialog";

type ActiveTab = "submitted" | "missing";

type FilterState = {
  academicYearId: string;
  degreeId: string;
  semesterId: string;
  courseId: string;
  curricularYearId: string;
  curricularGradeId: string;
  assessmentTypeId: string;
  statusId: string;
};

type DegreeOption = PostGraduationDegree & { id: number };

type PaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const MASTERS_DEGREE_ID = 2;

const initialFilters: FilterState = {
  academicYearId: "",
  degreeId: "",
  semesterId: "",
  courseId: "all",
  curricularYearId: "all",
  curricularGradeId: "all",
  assessmentTypeId: "all",
  statusId: "all",
};

function Pagination({
  page,
  limit,
  totalPages,
  isFetching,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Registos por página</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <span className="min-w-24 text-center text-sm">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

function renderStatus(statusId: number, status: string | null) {
  if (statusId === 1) {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-700">
        {status ?? "Pendente"}
      </Badge>
    );
  }

  if (statusId === 2) {
    return (
      <Badge className="border-green-500/30 bg-green-500/15 text-green-700">
        {status ?? "Aprovada"}
      </Badge>
    );
  }

  if (statusId === 3) {
    return <Badge variant="destructive">{status ?? "Rejeitada"}</Badge>;
  }

  return <Badge variant="secondary">{status ?? "Sem estado"}</Badge>;
}

export default function PostGraduationAgendaValidation() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("submitted");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [submittedPage, setSubmittedPage] = useState(1);
  const [submittedLimit, setSubmittedLimit] = useState(10);
  const [missingPage, setMissingPage] = useState(1);
  const [missingLimit, setMissingLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] =
    useState<PostGraduationAgendaValidation | null>(null);
  const [decision, setDecision] =
    useState<AgendaValidationDecision | null>(null);
  const { toast } = useToast();

  const {
    data: academicYears = [],
    isLoading: isLoadingAcademicYears,
    isError: isAcademicYearsError,
  } = useQueryAnoAcademico();
  const {
    data: degreesResponse,
    isLoading: isLoadingDegrees,
    isError: isDegreesError,
  } = useQueryPostGraduationDegrees();
  const {
    data: semestersResponse = [],
    isLoading: isLoadingSemesters,
    isError: isSemestersError,
  } = useQuerySemestres();

  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree): degree is DegreeOption =>
          degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );
  const semesters = useMemo(
    () =>
      semestersResponse.filter((semester) =>
        [1, 2].includes(Number(semester.codigo)),
      ),
    [semestersResponse],
  );

  useEffect(() => {
    if (filters.academicYearId || academicYears.length === 0) return;

    const activeAcademicYear = academicYears.find((academicYear) =>
      ["activo", "ativo"].includes(
        academicYear.estado?.trim().toLowerCase(),
      ),
    );

    if (activeAcademicYear) {
      setFilters((current) => ({
        ...current,
        academicYearId: String(activeAcademicYear.codigo),
      }));
    }
  }, [academicYears, filters.academicYearId]);

  useEffect(() => {
    if (filters.degreeId || degrees.length === 0) return;

    const mastersDegree = degrees.find(
      (degree) => degree.id === MASTERS_DEGREE_ID,
    );

    setFilters((current) => ({
      ...current,
      degreeId: String(mastersDegree?.id ?? degrees[0].id),
    }));
  }, [degrees, filters.degreeId]);

  const baseParams = {
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
    semesterId: Number(filters.semesterId),
  };
  const hasBaseFilters =
    baseParams.academicYearId > 0 &&
    [2, 3].includes(baseParams.degreeId) &&
    [1, 2].includes(baseParams.semesterId);

  const {
    data: optionsResponse,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
    refetch: refetchOptions,
  } = useQueryAgendaValidationOptions(baseParams);
  const options = optionsResponse?.data;

  const curricularYears = useMemo(() => {
    if (!options || filters.courseId === "all") return [];

    return options.curricularYears.filter(
      (item) => item.courseId === Number(filters.courseId),
    );
  }, [filters.courseId, options]);

  const curricularUnits = useMemo(() => {
    if (
      !options ||
      filters.courseId === "all" ||
      filters.curricularYearId === "all"
    ) {
      return [];
    }

    return options.curricularUnits.filter(
      (item) =>
        item.courseId === Number(filters.courseId) &&
        item.curricularYearId === Number(filters.curricularYearId),
    );
  }, [filters.courseId, filters.curricularYearId, options]);

  const commonFilters = {
    ...baseParams,
    courseId:
      filters.courseId === "all" ? undefined : Number(filters.courseId),
    curricularYearId:
      filters.curricularYearId === "all"
        ? undefined
        : Number(filters.curricularYearId),
    curricularGradeId:
      filters.curricularGradeId === "all"
        ? undefined
        : Number(filters.curricularGradeId),
  };

  const submittedQuery = useQueryAgendaValidations(
    {
      ...commonFilters,
      assessmentTypeId:
        filters.assessmentTypeId === "all"
          ? undefined
          : Number(filters.assessmentTypeId),
      statusId:
        filters.statusId === "all" ? undefined : Number(filters.statusId),
      page: submittedPage,
      limit: submittedLimit,
    },
    activeTab === "submitted",
  );

  const missingQuery = useQueryMissingAgendaValidations(
    {
      ...commonFilters,
      page: missingPage,
      limit: missingLimit,
    },
    activeTab === "missing",
  );

  const updateStatusMutation = useMutationUpdateAgendaValidationStatus();

  const submittedRecords = submittedQuery.data?.data ?? [];
  const submittedTotal = submittedQuery.data?.total ?? 0;
  const submittedTotalPages = Math.max(
    1,
    submittedQuery.data?.totalPages ?? 1,
  );
  const missingRecords = missingQuery.data?.data ?? [];
  const missingTotal = missingQuery.data?.total ?? 0;
  const missingTotalPages = Math.max(1, missingQuery.data?.totalPages ?? 1);

  useEffect(() => {
    if (submittedPage > submittedTotalPages) {
      setSubmittedPage(submittedTotalPages);
    }
  }, [submittedPage, submittedTotalPages]);

  useEffect(() => {
    if (missingPage > missingTotalPages) {
      setMissingPage(missingTotalPages);
    }
  }, [missingPage, missingTotalPages]);

  function resetPages() {
    setSubmittedPage(1);
    setMissingPage(1);
  }

  function handleBaseFilterChange(
    field: "academicYearId" | "degreeId" | "semesterId",
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      [field]: value,
      courseId: "all",
      curricularYearId: "all",
      curricularGradeId: "all",
      assessmentTypeId: "all",
      statusId: "all",
    }));
    resetPages();
  }

  async function handleDownload(fileName: string) {
    try {
      const blob = await viewFile(fileName);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (downloadError) {
      toast({
        title: "Não foi possível abrir a pauta.",
        description:
          downloadError instanceof Error
            ? downloadError.message
            : "Ocorreu um erro ao buscar o ficheiro.",
        variant: "destructive",
      });
    }
  }

  function openDecision(
    record: PostGraduationAgendaValidation,
    nextDecision: AgendaValidationDecision,
  ) {
    setSelectedRecord(record);
    setDecision(nextDecision);
  }

  function closeDecision() {
    if (updateStatusMutation.isPending) return;
    setSelectedRecord(null);
    setDecision(null);
  }

  async function confirmDecision() {
    if (!selectedRecord || !decision) return;

    try {
      await updateStatusMutation.mutateAsync({
        agendaId: selectedRecord.id,
        statusId: decision === "approve" ? 2 : 3,
      });
      setSelectedRecord(null);
      setDecision(null);
    } catch {
      return;
    }
  }

  function refreshActiveTab() {
    void refetchOptions();

    if (activeTab === "submitted") {
      void submittedQuery.refetch();
      return;
    }

    void missingQuery.refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validação de Pauta"
        subtitle="Aprovação e acompanhamento das pautas da Pós-Graduação"
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={
              !hasBaseFilters ||
              submittedQuery.isFetching ||
              missingQuery.isFetching
            }
            onClick={refreshActiveTab}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                submittedQuery.isFetching || missingQuery.isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
            Actualizar
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FormSelect
              label="Ano Lectivo"
              value={filters.academicYearId}
              options={academicYears}
              loading={isLoadingAcademicYears}
              disabled={isLoadingAcademicYears || isAcademicYearsError}
              map={(item) => ({
                key: item.codigo,
                value: item.codigo,
                label: item.designacao,
              })}
              onChange={(value) =>
                handleBaseFilterChange("academicYearId", value)
              }
            />

            <FormSelect
              label="Grau"
              value={filters.degreeId}
              options={degrees}
              loading={isLoadingDegrees}
              disabled={isLoadingDegrees || isDegreesError}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) =>
                handleBaseFilterChange("degreeId", value)
              }
            />

            <FormSelect
              label="Semestre"
              value={filters.semesterId}
              options={semesters}
              loading={isLoadingSemesters}
              disabled={isLoadingSemesters || isSemestersError}
              map={(item) => ({
                key: item.codigo,
                value: item.codigo,
                label: item.designacao,
              })}
              onChange={(value) =>
                handleBaseFilterChange("semesterId", value)
              }
            />

            <FormSelect
              label="Curso"
              value={filters.courseId}
              options={options?.courses ?? []}
              loading={isLoadingOptions}
              disabled={!hasBaseFilters || isLoadingOptions || isOptionsError}
              placeholder="Todos"
              defaultSelectItem={[{ value: "all", label: "Todos" }]}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => {
                setFilters((current) => ({
                  ...current,
                  courseId: value || "all",
                  curricularYearId: "all",
                  curricularGradeId: "all",
                }));
                resetPages();
              }}
            />

            <FormSelect
              label="Ano Curricular"
              value={filters.curricularYearId}
              options={curricularYears}
              disabled={filters.courseId === "all"}
              placeholder="Todos"
              defaultSelectItem={[{ value: "all", label: "Todos" }]}
              map={(item) => ({
                key: `${item.courseId}-${item.id}`,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => {
                setFilters((current) => ({
                  ...current,
                  curricularYearId: value || "all",
                  curricularGradeId: "all",
                }));
                resetPages();
              }}
            />

            <FormSelect
              label="Unidade Curricular"
              value={filters.curricularGradeId}
              options={curricularUnits}
              disabled={filters.curricularYearId === "all"}
              placeholder="Todas"
              defaultSelectItem={[{ value: "all", label: "Todas" }]}
              map={(item) => ({
                key: item.curricularGradeId,
                value: item.curricularGradeId,
                label: item.designation,
              })}
              onChange={(value) => {
                setFilters((current) => ({
                  ...current,
                  curricularGradeId: value || "all",
                }));
                resetPages();
              }}
            />

            {activeTab === "submitted" && (
              <>
                <FormSelect
                  label="Tipo de Avaliação"
                  value={filters.assessmentTypeId}
                  options={options?.assessmentTypes ?? []}
                  disabled={!hasBaseFilters || isLoadingOptions}
                  placeholder="Todos"
                  defaultSelectItem={[{ value: "all", label: "Todos" }]}
                  map={(item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.designation,
                  })}
                  onChange={(value) => {
                    setFilters((current) => ({
                      ...current,
                      assessmentTypeId: value || "all",
                    }));
                    setSubmittedPage(1);
                  }}
                />

                <FormSelect
                  label="Estado"
                  value={filters.statusId}
                  options={options?.statuses ?? []}
                  disabled={!hasBaseFilters || isLoadingOptions}
                  placeholder="Todos"
                  defaultSelectItem={[{ value: "all", label: "Todos" }]}
                  map={(item) => ({
                    key: item.id,
                    value: item.id,
                    label: item.designation,
                  })}
                  onChange={(value) => {
                    setFilters((current) => ({
                      ...current,
                      statusId: value || "all",
                    }));
                    setSubmittedPage(1);
                  }}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isOptionsError && hasBaseFilters && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar as opções</AlertTitle>
          <AlertDescription>
            Confirme o contexto académico selecionado e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="submitted">
            <FileText className="mr-2 h-4 w-4" />
            Pautas submetidas
          </TabsTrigger>
          <TabsTrigger value="missing">
            <AlertCircle className="mr-2 h-4 w-4" />
            Unidades sem pauta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="mt-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Pautas submetidas</CardTitle>
              <span className="text-sm text-muted-foreground">
                {submittedTotal} registo{submittedTotal === 1 ? "" : "s"}
              </span>
            </CardHeader>
            <CardContent>
              {!hasBaseFilters ? (
                <div className="py-12 text-center text-muted-foreground">
                  Selecione o ano lectivo, o grau e o semestre.
                </div>
              ) : submittedQuery.isLoading ? (
                <div className="flex min-h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : submittedQuery.isError ? (
                <Alert variant="destructive">
                  <AlertTitle>Não foi possível carregar as pautas</AlertTitle>
                  <AlertDescription>
                    {submittedQuery.error instanceof Error
                      ? submittedQuery.error.message
                      : "Tente novamente dentro de alguns instantes."}
                  </AlertDescription>
                </Alert>
              ) : submittedRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhuma pauta encontrada neste contexto.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[1250px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ficheiro</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Curso</TableHead>
                          <TableHead>Unidade Curricular</TableHead>
                          <TableHead>Ano Curricular</TableHead>
                          <TableHead>Docente</TableHead>
                          <TableHead>Tipo de Avaliação</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Validado por</TableHead>
                          <TableHead className="w-36 text-right">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submittedRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex max-w-48 items-center gap-2">
                                <FileText className="h-4 w-4 shrink-0 text-red-500" />
                                <span
                                  className="truncate"
                                  title={record.fileName}
                                >
                                  {record.fileName || "Sem ficheiro"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatDateTimePt(record.createdAt)}
                            </TableCell>
                            <TableCell>{record.course}</TableCell>
                            <TableCell>{record.curricularUnit}</TableCell>
                            <TableCell>{record.curricularYear}</TableCell>
                            <TableCell>{record.teacher}</TableCell>
                            <TableCell>{record.assessmentType}</TableCell>
                            <TableCell>
                              {renderStatus(record.statusId, record.status)}
                            </TableCell>
                            <TableCell>{record.validatedBy ?? "—"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {record.fileName && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Abrir pauta"
                                    onClick={() =>
                                      handleDownload(record.fileName)
                                    }
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                {record.statusId === 1 && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      title="Aprovar pauta"
                                      className="text-green-700 hover:bg-green-50 hover:text-green-800"
                                      onClick={() =>
                                        openDecision(record, "approve")
                                      }
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      title="Rejeitar pauta"
                                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() =>
                                        openDecision(record, "reject")
                                      }
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Pagination
                    page={submittedPage}
                    limit={submittedLimit}
                    totalPages={submittedTotalPages}
                    isFetching={submittedQuery.isFetching}
                    onPageChange={setSubmittedPage}
                    onLimitChange={(value) => {
                      setSubmittedLimit(value);
                      setSubmittedPage(1);
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing" className="mt-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Unidades sem pauta</CardTitle>
              <span className="text-sm text-muted-foreground">
                {missingTotal} registo{missingTotal === 1 ? "" : "s"}
              </span>
            </CardHeader>
            <CardContent>
              {!hasBaseFilters ? (
                <div className="py-12 text-center text-muted-foreground">
                  Selecione o ano lectivo, o grau e o semestre.
                </div>
              ) : missingQuery.isLoading ? (
                <div className="flex min-h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : missingQuery.isError ? (
                <Alert variant="destructive">
                  <AlertTitle>
                    Não foi possível carregar as unidades sem pauta
                  </AlertTitle>
                  <AlertDescription>
                    {missingQuery.error instanceof Error
                      ? missingQuery.error.message
                      : "Tente novamente dentro de alguns instantes."}
                  </AlertDescription>
                </Alert>
              ) : missingRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
                  <p className="text-muted-foreground">
                    Nenhuma unidade sem pauta neste contexto.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[850px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead>Unidade Curricular</TableHead>
                          <TableHead>Ano Curricular</TableHead>
                          <TableHead>Semestre</TableHead>
                          <TableHead>Docente</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {missingRecords.map((record) => (
                          <TableRow key={record.curricularGradeId}>
                            <TableCell>{record.course}</TableCell>
                            <TableCell>{record.curricularUnit}</TableCell>
                            <TableCell>{record.curricularYear}</TableCell>
                            <TableCell>{record.semester}</TableCell>
                            <TableCell>
                              {record.teacher ?? "Não atribuído"}
                            </TableCell>
                            <TableCell>
                              <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-700">
                                Sem pauta
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Pagination
                    page={missingPage}
                    limit={missingLimit}
                    totalPages={missingTotalPages}
                    isFetching={missingQuery.isFetching}
                    onPageChange={setMissingPage}
                    onLimitChange={(value) => {
                      setMissingLimit(value);
                      setMissingPage(1);
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AgendaValidationDecisionDialog
        record={selectedRecord}
        decision={decision}
        isPending={updateStatusMutation.isPending}
        onOpenChange={(open) => {
          if (!open) closeDecision();
        }}
        onConfirm={() => {
          void confirmDecision();
        }}
      />
    </div>
  );
}
