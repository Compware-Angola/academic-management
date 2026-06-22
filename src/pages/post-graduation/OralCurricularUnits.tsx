import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Info,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useMutationUpdateOralCurricularUnitStatus } from "@/hooks/post-graduation/use-mutation-update-oral-curricular-unit-status";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryOralCurricularUnits } from "@/hooks/post-graduation/use-query-oral-curricular-units";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { formatDateTimePt } from "@/util/date-formate";

type FiltersState = {
  academicYearId: string;
  degreeId: string;
  courseId: string;
  curricularYearId: string;
  semesterId: string;
};

type DegreeOption = PostGraduationDegree & {
  id: number;
};

const initialFilters: FiltersState = {
  academicYearId: "",
  degreeId: "",
  courseId: "",
  curricularYearId: "",
  semesterId: "",
};

const ITEMS_PER_PAGE = 10;
const MASTERS_DEGREE_ID = 2;

export default function PostGraduationOralCurricularUnits() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
  const {
    data: curricularYears = [],
    isLoading: isLoadingCurricularYears,
    isError: isCurricularYearsError,
  } = useQueryClassFilterByCurso({ curso: filters.courseId });

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

  const queryParams = useMemo(
    () => ({
      academicYearId: Number(filters.academicYearId),
      degreeId: Number(filters.degreeId),
      courseId: Number(filters.courseId),
      curricularYearId: Number(filters.curricularYearId),
      semesterId: Number(filters.semesterId),
    }),
    [filters],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQueryOralCurricularUnits(queryParams);
  const updateStatus = useMutationUpdateOralCurricularUnitStatus();

  const curricularUnits = useMemo(() => data?.data ?? [], [data]);
  const filteredCurricularUnits = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt");
    if (!normalizedSearch) return curricularUnits;

    return curricularUnits.filter((item) =>
      item.curricularUnit
        .toLocaleLowerCase("pt")
        .includes(normalizedSearch),
    );
  }, [curricularUnits, search]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCurricularUnits.length / ITEMS_PER_PAGE),
  );
  const paginatedCurricularUnits = useMemo(
    () =>
      filteredCurricularUnits.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [currentPage, filteredCurricularUnits],
  );
  const hasValidFilters =
    queryParams.academicYearId > 0 &&
    [2, 3].includes(queryParams.degreeId) &&
    queryParams.courseId > 0 &&
    queryParams.curricularYearId > 0 &&
    [1, 2].includes(queryParams.semesterId);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleFilterChange(
    field: keyof FiltersState,
    value: string,
  ) {
    setFilters((current) => {
      if (field === "degreeId") {
        return {
          ...current,
          degreeId: value,
          courseId: "",
          curricularYearId: "",
        };
      }

      if (field === "courseId") {
        return {
          ...current,
          courseId: value,
          curricularYearId: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setSearch("");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formula de Definicao das UCs Oral"
        subtitle="Avaliacoes da Pos-Graduacao"
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={!hasValidFilters || isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Atualizar
          </Button>
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
              placeholder="Selecione o ano lectivo"
              map={(academicYear) => ({
                key: academicYear.codigo,
                value: academicYear.codigo,
                label: academicYear.designacao,
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
              placeholder="Selecione o grau"
              map={(degree) => ({
                key: degree.id,
                value: degree.id,
                label: degree.designation,
              })}
              onChange={(value) => handleFilterChange("degreeId", value)}
            />

            <CourseSelect
              label="Curso"
              value={filters.courseId}
              disabled={!filters.degreeId}
              placeholder="Selecione o curso"
              params={{
                tipoCandidaturaId: filters.degreeId
                  ? Number(filters.degreeId)
                  : undefined,
              }}
              onChangeValue={(value) =>
                handleFilterChange("courseId", value)
              }
            />

            <FormSelect
              label="Ano Curricular"
              value={filters.curricularYearId}
              options={curricularYears}
              loading={isLoadingCurricularYears}
              disabled={
                !filters.courseId ||
                isLoadingCurricularYears ||
                isCurricularYearsError
              }
              placeholder="Selecione o ano curricular"
              map={(curricularYear) => ({
                key: curricularYear.codigo,
                value: curricularYear.codigo,
                label: curricularYear.designacao,
              })}
              onChange={(value) =>
                handleFilterChange("curricularYearId", value)
              }
            />

            <FormSelect
              label="Semestre"
              value={filters.semesterId}
              options={semesters}
              loading={isLoadingSemesters}
              disabled={isLoadingSemesters || isSemestersError}
              placeholder="Selecione o semestre"
              map={(semester) => ({
                key: semester.codigo,
                value: semester.codigo,
                label: semester.designacao,
              })}
              onChange={(value) =>
                handleFilterChange("semesterId", value)
              }
            />
          </div>

          {(isAcademicYearsError ||
            isDegreesError ||
            isSemestersError ||
            isCurricularYearsError) && (
            <p className="mt-4 text-sm text-destructive">
              Nao foi possivel carregar um ou mais filtros da pagina.
            </p>
          )}
        </CardContent>
      </Card>

      {!hasValidFilters && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Complete os filtros</AlertTitle>
          <AlertDescription>
            Selecione o grau, curso, ano curricular e semestre para listar as
            unidades curriculares.
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nao foi possivel carregar as unidades curriculares</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Ocorreu um erro durante a consulta das unidades curriculares."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-semibold text-primary">
          Total de UCs: {filteredCurricularUnits.length}
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            disabled={!hasValidFilters || curricularUnits.length === 0}
            className="pl-9"
            placeholder="Pesquisar unidade curricular"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-72">Unidade Curricular</TableHead>
              <TableHead className="min-w-44">Ultima alteracao</TableHead>
              <TableHead className="min-w-44">Alterado por</TableHead>
              <TableHead className="w-32 text-center">Avaliacao oral</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando unidades curriculares...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedCurricularUnits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  {hasValidFilters
                    ? "Nenhuma UC encontrada para os filtros selecionados."
                    : "Aguardando a selecao dos filtros."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCurricularUnits.map((item) => {
                const isUpdating =
                  updateStatus.isPending &&
                  updateStatus.variables?.curricularGradeId ===
                    item.curricularGradeId;

                return (
                  <TableRow key={item.curricularGradeId}>
                    <TableCell className="font-medium">
                      {item.curricularUnit}
                    </TableCell>
                    <TableCell>
                      {item.updatedAt
                        ? formatDateTimePt(item.updatedAt)
                        : "Sem alteracao"}
                    </TableCell>
                    <TableCell>{item.updatedBy ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {isUpdating && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        <Switch
                          aria-label={`Configurar avaliacao oral de ${item.curricularUnit}`}
                          checked={item.oralEnabled}
                          disabled={updateStatus.isPending}
                          onCheckedChange={(enabled) =>
                            updateStatus.mutate({
                              curricularGradeId: item.curricularGradeId,
                              enabled,
                            })
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isFetching}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || isFetching}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Proxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
