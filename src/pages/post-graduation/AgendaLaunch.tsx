import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
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
import { useQueryAgendaLaunchOptions } from "@/hooks/post-graduation/use-query-agenda-launch-options";
import { useQueryAgendaLaunches } from "@/hooks/post-graduation/use-query-agenda-launches";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useToast } from "@/hooks/use-toast";
import type { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { viewFile } from "@/services/upload/upload-single.service";
import { formatDateTimePt } from "@/util/date-formate";
import { CreateAgendaLaunchModal } from "./components/CreateAgendaLaunchModal";

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

export default function PostGraduationAgendaLaunch() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
  } = useQueryAgendaLaunchOptions(baseParams);
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

  const assessmentTypes = useMemo(() => {
    const unique = new Map<number, { id: number; designation: string }>();

    (options?.terms ?? []).forEach((term) => {
      unique.set(term.assessmentTypeId, {
        id: term.assessmentTypeId,
        designation: term.assessmentType,
      });
    });

    return [...unique.values()];
  }, [options?.terms]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQueryAgendaLaunches({
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
    assessmentTypeId:
      filters.assessmentTypeId === "all"
        ? undefined
        : Number(filters.assessmentTypeId),
    statusId:
      filters.statusId === "all" ? undefined : Number(filters.statusId),
    page,
    limit,
  });

  const records = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
    setPage(1);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lançamento de Pauta"
        subtitle="Consulta e submissão de pautas da Pós-Graduação"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasBaseFilters || isFetching}
              onClick={() => refetch()}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Actualizar
            </Button>
            <Button
              size="sm"
              disabled={!hasBaseFilters || isLoadingOptions || isOptionsError}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Submeter pauta
            </Button>
          </>
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
                setPage(1);
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
                setPage(1);
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
                setPage(1);
              }}
            />

            <FormSelect
              label="Tipo de Avaliação"
              value={filters.assessmentTypeId}
              options={assessmentTypes}
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
                setPage(1);
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
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {isOptionsError && hasBaseFilters && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar as opções</AlertTitle>
          <AlertDescription>
            Confirme o contexto académico seleccionado e tente novamente.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Pautas submetidas</CardTitle>
          <span className="text-sm text-muted-foreground">
            {total} registo{total === 1 ? "" : "s"}
          </span>
        </CardHeader>
        <CardContent>
          {!hasBaseFilters ? (
            <div className="py-12 text-center text-muted-foreground">
              Seleccione o ano lectivo, o grau e o semestre.
            </div>
          ) : isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertTitle>Não foi possível carregar as pautas</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Tente novamente dentro de alguns instantes."}
              </AlertDescription>
            </Alert>
          ) : records.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhuma pauta encontrada neste contexto.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[1100px]">
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
                      <TableHead className="w-16 text-right">Acção</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex max-w-48 items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-red-500" />
                            <span className="truncate" title={record.fileName}>
                              {record.fileName}
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
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Abrir pauta"
                            onClick={() => handleDownload(record.fileName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Registos por página</span>
                  <Select
                    value={String(limit)}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
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
                    onClick={() => setPage((current) => current - 1)}
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
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Seguinte
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CreateAgendaLaunchModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        academicYearId={baseParams.academicYearId}
        degreeId={baseParams.degreeId}
        semesterId={baseParams.semesterId}
        options={options}
      />
    </div>
  );
}
