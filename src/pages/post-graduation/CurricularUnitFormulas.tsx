import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Edit,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryCurricularUnitFormulas } from "@/hooks/post-graduation/use-query-curricular-unit-formulas";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { PostGraduationCurricularUnitFormula } from "@/services/post-graduation/fetch-curricular-unit-formulas.service";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { EditCurricularUnitFormulaModal } from "./components/EditCurricularUnitFormulaModal";

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

const legendItems = [
  { abbreviation: "NM P", description: "Nota minima da pratica" },
  { abbreviation: "NM 1F", description: "Nota minima da primeira frequencia" },
  { abbreviation: "NM 2F", description: "Nota minima da segunda frequencia" },
  { abbreviation: "P P", description: "Peso da pratica" },
  { abbreviation: "P 1F", description: "Peso da primeira frequencia" },
  { abbreviation: "P 2F", description: "Peso da segunda frequencia" },
];

function displayValue(value: number | string | null) {
  return value ?? "-";
}

export default function PostGraduationCurricularUnitFormulas() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFormula, setSelectedFormula] =
    useState<PostGraduationCurricularUnitFormula | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  } = useQueryCurricularUnitFormulas(queryParams);

  const formulas = useMemo(() => data?.data ?? [], [data]);
  const totalPages = Math.max(
    1,
    Math.ceil(formulas.length / ITEMS_PER_PAGE),
  );
  const paginatedFormulas = useMemo(
    () =>
      formulas.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [currentPage, formulas],
  );
  const hasValidFilters =
    queryParams.academicYearId > 0 &&
    [2, 3].includes(queryParams.degreeId) &&
    queryParams.courseId > 0 &&
    queryParams.curricularYearId > 0 &&
    [1, 2].includes(queryParams.semesterId);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function resetListState() {
    setCurrentPage(1);
    setSelectedFormula(null);
    setIsEditModalOpen(false);
  }

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

    resetListState();
  }

  function handleOpenEdit(formula: PostGraduationCurricularUnitFormula) {
    setSelectedFormula(formula);
    setIsEditModalOpen(true);
  }

  function handleEditModalChange(open: boolean) {
    setIsEditModalOpen(open);
    if (!open) {
      setSelectedFormula(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formula de Definicao das UCs"
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

      <div className="flex items-start gap-3 rounded-md border bg-muted/30 p-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {legendItems.map((item) => (
            <div key={item.abbreviation}>
              <span className="font-semibold">{item.abbreviation}</span>
              <span className="text-muted-foreground">
                {" "}
                - {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!hasValidFilters && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Complete os filtros</AlertTitle>
          <AlertDescription>
            Selecione o grau, curso, ano curricular e semestre para listar as
            formulas.
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nao foi possivel carregar as formulas</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Ocorreu um erro durante a consulta das formulas."}
          </AlertDescription>
        </Alert>
      )}

      <div className="font-semibold text-primary">
        Total de UCs: {formulas.length}
      </div>

      <div className="overflow-x-auto rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead className="min-w-64">Unidade Curricular</TableHead>
              <TableHead className="text-center">NM P</TableHead>
              <TableHead className="text-center">NM 1F</TableHead>
              <TableHead className="text-center">NM 2F</TableHead>
              <TableHead className="text-center">P P</TableHead>
              <TableHead className="text-center">P 1F</TableHead>
              <TableHead className="text-center">P 2F</TableHead>
              <TableHead className="min-w-40">Definido por</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando formulas...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedFormulas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  {hasValidFilters
                    ? "Nenhuma UC encontrada para os filtros selecionados."
                    : "Aguardando a selecao dos filtros."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedFormulas.map((formula) => (
                <TableRow key={formula.formulaId}>
                  <TableCell>{formula.formulaId}</TableCell>
                  <TableCell className="font-medium">
                    {formula.curricularUnit}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.minimumPracticalGrade)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.minimumFirstFrequencyGrade)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.minimumSecondFrequencyGrade)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.practicalWeight)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.firstFrequencyWeight)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(formula.secondFrequencyWeight)}
                  </TableCell>
                  <TableCell>{displayValue(formula.updatedBy)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar formula"
                      onClick={() => handleOpenEdit(formula)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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

      <EditCurricularUnitFormulaModal
        open={isEditModalOpen}
        formula={selectedFormula}
        onOpenChange={handleEditModalChange}
      />
    </div>
  );
}
