import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, Search, Users } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryAttendanceList } from "@/hooks/post-graduation/use-query-exam-attendance-list";
import { useQueryExamMarkingOptions } from "@/hooks/post-graduation/use-query-exam-marking-options";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { parseFilter } from "@/util/parse-filter";

type FilterState = {
  academicYearId: string;
  degreeId: string;
  semesterId: string;
  periodId: string;
  courseId: string;
  curricularYearId: string;
  curricularGradeId: string;
  scheduleId: string;
};

type DegreeOption = PostGraduationDegree & { id: number };

const MASTERS_DEGREE_ID = 2;

const initialFilters: FilterState = {
  academicYearId: "",
  degreeId: "",
  semesterId: "",
  periodId: "",
  courseId: "",
  curricularYearId: "",
  curricularGradeId: "",
  scheduleId: "",
};

export default function PostGraduationExamAttendanceList() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

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
  const options = optionsResponse?.data;
  const courses = useMemo(() => {
    if (!options || !filters.periodId) return [];

    const courseIds = new Set(
      options.schedules
        .filter(
          (schedule) => schedule.periodId === Number(filters.periodId),
        )
        .map((schedule) => schedule.courseId),
    );

    return options.courses.filter((course) => courseIds.has(course.id));
  }, [filters.periodId, options]);

  const {
    data: curricularYears = [],
    isLoading: isLoadingCurricularYears,
    isError: isCurricularYearsError,
  } = useQueryClassFilterByCurso({ curso: filters.courseId });
  const {
    data: curricularUnitsResponse = [],
    isLoading: isLoadingCurricularUnits,
    isError: isCurricularUnitsError,
  } = useQueryDisciplinaWithFilter({
    curso: filters.courseId,
    semestre: filters.semesterId,
    classe: filters.curricularYearId,
  });
  const curricularUnits = useMemo(() => {
    if (!options || !filters.periodId || !filters.courseId) return [];

    const curricularGradeIds = new Set(
      options.schedules
        .filter(
          (schedule) =>
            schedule.periodId === Number(filters.periodId) &&
            schedule.courseId === Number(filters.courseId),
        )
        .map((schedule) => schedule.curricularGradeId),
    );

    return curricularUnitsResponse.filter((unit) =>
      curricularGradeIds.has(unit.pk),
    );
  }, [
    curricularUnitsResponse,
    filters.courseId,
    filters.periodId,
    options,
  ]);
  const schedules = useMemo(() => {
    if (!options || !filters.curricularGradeId) return [];

    return options.schedules.filter(
      (schedule) =>
        schedule.periodId === Number(filters.periodId) &&
        schedule.courseId === Number(filters.courseId) &&
        schedule.curricularGradeId ===
          Number(filters.curricularGradeId),
    );
  }, [
    filters.courseId,
    filters.curricularGradeId,
    filters.periodId,
    options,
  ]);

  const queryParams = {
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
    semesterId: Number(filters.semesterId),
    periodId: Number(filters.periodId),
    courseId: Number(filters.courseId),
    curricularYearId: Number(filters.curricularYearId),
    curricularGradeId: Number(filters.curricularGradeId),
    scheduleId: Number(filters.scheduleId),
    search: appliedSearch || undefined,
    page,
    limit,
  };
  const hasCompleteFilters =
    hasBaseFilters &&
    queryParams.periodId > 0 &&
    queryParams.courseId > 0 &&
    queryParams.curricularYearId > 0 &&
    queryParams.curricularGradeId > 0 &&
    queryParams.scheduleId > 0;

  const {
    data: attendanceResponse,
    isLoading: isLoadingAttendance,
    isFetching: isFetchingAttendance,
    isError: isAttendanceError,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQueryAttendanceList(queryParams);

  const students = attendanceResponse?.data ?? [];
  const totalPages = Math.max(1, attendanceResponse?.totalPages ?? 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function resetResultState() {
    setPage(1);
    setSearch("");
    setAppliedSearch("");
  }

  function handleFilterChange(field: keyof FilterState, value: string) {
    setFilters((current) => {
      const next = { ...current, [field]: value };

      if (field === "academicYearId" || field === "degreeId") {
        next.semesterId = "";
        next.periodId = "";
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "semesterId") {
        next.periodId = "";
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "periodId") {
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "courseId") {
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "curricularYearId") {
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "curricularGradeId") {
        next.scheduleId = "";
      }

      return next;
    });
    resetResultState();
  }

  function handleSearch() {
    setAppliedSearch(search.trim());
    setPage(1);
  }

  const hasFilterError =
    isDegreesError ||
    isSemestersError ||
    isOptionsError ||
    isCurricularYearsError ||
    isCurricularUnitsError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Presença"
        subtitle="Avaliações académicas da Pós-Graduação"
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={!hasCompleteFilters || isFetchingAttendance}
            onClick={() => refetchAttendance()}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isFetchingAttendance ? "animate-spin" : ""
              }`}
            />
            Actualizar
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtros de pesquisa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

            <AcademicYearsAvailableForOperationSelect
              key={filters.degreeId}
              label="Ano Lectivo"
              value={filters.academicYearId}
              tipoCandidaturaId={parseFilter(filters.degreeId) ?? 2}
              onlyConfigurable={false}
              enableDefaultActiveYear
              disabled={!filters.degreeId}
              onChangeValue={(value) =>
                handleFilterChange("academicYearId", value)
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
                handleFilterChange("semesterId", value)
              }
            />

            <FormSelect
              label="Período"
              value={filters.periodId}
              options={options?.periods ?? []}
              loading={isLoadingOptions}
              disabled={!hasBaseFilters || isOptionsError}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => handleFilterChange("periodId", value)}
            />

            <FormSelect
              label="Curso"
              value={filters.courseId}
              options={courses}
              loading={isLoadingOptions}
              disabled={!filters.periodId || isOptionsError}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => handleFilterChange("courseId", value)}
            />

            <FormSelect
              label="Ano Curricular"
              value={filters.curricularYearId}
              options={curricularYears}
              loading={isLoadingCurricularYears}
              disabled={!filters.courseId || isCurricularYearsError}
              map={(item) => ({
                key: item.codigo,
                value: item.codigo,
                label: item.designacao,
              })}
              onChange={(value) =>
                handleFilterChange("curricularYearId", value)
              }
            />

            <FormSelect
              label="Unidade Curricular"
              value={filters.curricularGradeId}
              options={curricularUnits}
              loading={isLoadingCurricularUnits}
              disabled={
                !filters.curricularYearId || isCurricularUnitsError
              }
              map={(item) => ({
                key: item.pk,
                value: item.pk,
                label: item.descricao,
              })}
              onChange={(value) =>
                handleFilterChange("curricularGradeId", value)
              }
            />

            <FormSelect
              label="Horário"
              value={filters.scheduleId}
              options={schedules}
              loading={isLoadingOptions}
              disabled={!filters.curricularGradeId || isOptionsError}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: item.designation,
              })}
              onChange={(value) => handleFilterChange("scheduleId", value)}
            />
          </div>

          {hasFilterError && (
            <p className="text-sm text-destructive">
              Não foi possível carregar um ou mais filtros da página.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estudantes elegíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {!hasCompleteFilters ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <Users className="h-10 w-10" />
              <p className="text-sm">
                Complete os filtros académicos para consultar a lista de
                presença.
              </p>
            </div>
          ) : isAttendanceError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não foi possível carregar a lista</AlertTitle>
              <AlertDescription>{attendanceError.message}</AlertDescription>
            </Alert>
          ) : (
            <>
              {attendanceResponse?.context && (
                <div className="grid gap-3 border-b pb-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Curso</p>
                    <p className="text-sm font-medium">
                      {attendanceResponse.context.course}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Unidade Curricular
                    </p>
                    <p className="text-sm font-medium">
                      {attendanceResponse.context.curricularUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ano e período
                    </p>
                    <p className="text-sm font-medium">
                      {attendanceResponse.context.curricularYear} ·{" "}
                      {attendanceResponse.context.period}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horário</p>
                    <p className="text-sm font-medium">
                      {attendanceResponse.context.schedule}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="w-full max-w-md">
                  <label
                    className="mb-2 block text-sm font-medium"
                    htmlFor="post-graduation-attendance-search"
                  >
                    Pesquisar estudante
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="post-graduation-attendance-search"
                      className="pl-9"
                      placeholder="Matrícula ou nome"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSearch();
                      }}
                    />
                  </div>
                </div>
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Pesquisar
                </Button>
              </div>

              {isLoadingAttendance ? (
                <div className="flex min-h-48 items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : students.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  Nenhum estudante academicamente elegível foi encontrado.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">N.º</TableHead>
                          <TableHead>Matrícula</TableHead>
                          <TableHead>Nome completo</TableHead>
                          <TableHead>Estado académico</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.enrollmentId}>
                            <TableCell>{student.number}</TableCell>
                            <TableCell className="font-mono">
                              {student.enrollmentId}
                            </TableCell>
                            <TableCell>{student.fullName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {student.academicStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      A mostrar {students.length} de{" "}
                      {attendanceResponse?.total ?? 0} estudantes
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
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
