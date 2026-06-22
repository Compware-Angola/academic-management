import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarPlus,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryExamMarkingOptions } from "@/hooks/post-graduation/use-query-exam-marking-options";
import { useQueryExamMarkings } from "@/hooks/post-graduation/use-query-exam-markings";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { formatDateOnlyPt } from "@/util/date-formate";
import { CreateExamMarkingModal } from "./components/CreateExamMarkingModal";

type FilterState = {
  academicYearId: string;
  degreeId: string;
  semesterId: string;
  courseId: string;
  termId: string;
};

type DegreeOption = PostGraduationDegree & { id: number };

const MASTERS_DEGREE_ID = 2;

export default function PostGraduationExamMarkings() {
  const [filters, setFilters] = useState<FilterState>({
    academicYearId: "",
    degreeId: "",
    semesterId: "",
    courseId: "all",
    termId: "all",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
  } = useQueryExamMarkingOptions(baseParams);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQueryExamMarkings({
    ...baseParams,
    courseId:
      filters.courseId === "all"
        ? undefined
        : Number(filters.courseId),
    termId:
      filters.termId === "all" ? undefined : Number(filters.termId),
    page,
    limit,
  });

  const options = optionsResponse?.data;
  const records = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function handleFilterChange(field: keyof FilterState, value: string) {
    setFilters((current) => {
      if (
        field === "academicYearId" ||
        field === "degreeId" ||
        field === "semesterId"
      ) {
        return {
          ...current,
          [field]: value,
          courseId: "all",
          termId: "all",
        };
      }

      return { ...current, [field]: value };
    });
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marcação de Provas"
        subtitle="Avaliações da Pós-Graduação"
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
              <CalendarPlus className="mr-2 h-4 w-4" />
              Marcar prova
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
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
                handleFilterChange("academicYearId", value)
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
              onChange={(value) => handleFilterChange("degreeId", value)}
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
                handleFilterChange("semesterId", value)
              }
            />

            <FormSelect
              label="Curso"
              value={filters.courseId}
              options={options?.courses ?? []}
              loading={isLoadingOptions}
              disabled={!hasBaseFilters || isOptionsError}
              defaultSelectItem={[{ value: "all", label: "Todos" }]}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => handleFilterChange("courseId", value)}
            />

            <FormSelect
              label="Tipo de Época"
              value={filters.termId}
              options={options?.terms ?? []}
              loading={isLoadingOptions}
              disabled={!hasBaseFilters || isOptionsError}
              defaultSelectItem={[{ value: "all", label: "Todos" }]}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: `${item.assessmentType ?? `Prazo ${item.id}`}${
                  item.isOpen ? " (aberto)" : ""
                }`,
              })}
              onChange={(value) => handleFilterChange("termId", value)}
            />
          </div>

          {(isAcademicYearsError ||
            isDegreesError ||
            isSemestersError ||
            isOptionsError) && (
            <p className="mt-4 text-sm text-destructive">
              Não foi possível carregar um ou mais filtros da página.
            </p>
          )}
        </CardContent>
      </Card>

      {!hasBaseFilters && (
        <Alert>
          <AlertTitle>Complete os filtros</AlertTitle>
          <AlertDescription>
            Seleccione o ano lectivo, grau e semestre para listar as provas.
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não foi possível carregar as provas</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          {isLoading && hasBaseFilters ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
              {hasBaseFilters
                ? "Nenhuma prova encontrada para os filtros seleccionados."
                : "A listagem será apresentada depois de completar os filtros."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[1180px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Época</TableHead>
                      <TableHead>Tipo de Prova</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Vigilantes</TableHead>
                      <TableHead>Registado por</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.course}</TableCell>
                        <TableCell>{item.curricularUnit}</TableCell>
                        <TableCell>{item.schedule}</TableCell>
                        <TableCell>{item.assessmentType ?? "-"}</TableCell>
                        <TableCell>{item.examType ?? "-"}</TableCell>
                        <TableCell>{item.modality ?? "-"}</TableCell>
                        <TableCell>{item.room ?? "-"}</TableCell>
                        <TableCell>
                          {formatDateOnlyPt(item.examDate)}
                        </TableCell>
                        <TableCell>
                          {item.startTime} - {item.endTime}
                        </TableCell>
                        <TableCell>
                          <div className="flex max-w-64 flex-wrap gap-1">
                            {item.invigilators.length > 0 ? (
                              item.invigilators.map((invigilator) => (
                                <Badge
                                  key={`${item.id}-${invigilator.id}`}
                                  variant="secondary"
                                >
                                  {invigilator.name}
                                </Badge>
                              ))
                            ) : (
                              "-"
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.createdBy ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  A mostrar {records.length} de {total} registos
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Próxima
                  </Button>
                  <Select
                    value={String(limit)}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-20">
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

      {hasBaseFilters && (
        <CreateExamMarkingModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          academicYearId={baseParams.academicYearId}
          degreeId={baseParams.degreeId}
          semesterId={baseParams.semesterId}
          initialCourseId={
            filters.courseId === "all"
              ? undefined
              : Number(filters.courseId)
          }
        />
      )}
    </div>
  );
}
