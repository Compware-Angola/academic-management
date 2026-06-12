import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryExamCalendars } from "@/hooks/post-graduation/use-query-exam-calendars";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { PostGraduationExamCalendar } from "@/services/post-graduation/fetch-exam-calendars.service";
import { formatDateOnlyPt } from "@/util/date-formate";

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

function displayValue(value: string | number | null) {
  return value ?? "-";
}

export default function ExamCalendarPos() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterError, setFilterError] = useState("");
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);

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

  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree) => degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError: isCalendarsError,
    refetch,
  } = useQueryExamCalendars({
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
  });

  const calendars = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(calendars.length / ITEMS_PER_PAGE),
  );
  const paginatedCalendars = useMemo(
    () =>
      calendars.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [calendars, currentPage],
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
    { header: "Código", accessor: "id" },
    { header: "Ano Lectivo", accessor: "academicYear" },
    { header: "Grau", accessor: "degree" },
    {
      header: "Semestre",
      accessor: "semester",
      cell: (calendar: PostGraduationExamCalendar) =>
        displayValue(calendar.semester),
    },
    {
      header: "Época de Avaliação",
      accessor: "assessmentPeriod",
      cell: (calendar: PostGraduationExamCalendar) =>
        displayValue(calendar.assessmentPeriod),
    },
    {
      header: "Data de Início",
      accessor: "startDate",
      cell: (calendar: PostGraduationExamCalendar) =>
        calendar.startDate ? formatDateOnlyPt(calendar.startDate) : "-",
    },
    {
      header: "Data de Término",
      accessor: "endDate",
      cell: (calendar: PostGraduationExamCalendar) =>
        calendar.endDate ? formatDateOnlyPt(calendar.endDate) : "-",
    },
    {
      header: "Observação",
      accessor: "observation",
      cell: (calendar: PostGraduationExamCalendar) =>
        displayValue(calendar.observation),
    },
    {
      header: "Criado por",
      accessor: "createdBy",
      cell: (calendar: PostGraduationExamCalendar) =>
        displayValue(calendar.createdBy),
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

  const isPreparingFilters =
    isLoadingAcademicYears || isLoadingDegrees || !hasInitializedFilters;
  const hasSelectedFilters =
    Boolean(filters.academicYearId) && Boolean(filters.degreeId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendário de Provas de Pós-Graduação"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={!hasSelectedFilters || isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
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
                disabled={isLoadingAcademicYears || isAcademicYearsError}
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
              {isAcademicYearsError && (
                <p className="text-sm text-destructive">
                  Não foi possível carregar os anos lectivos.
                </p>
              )}
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

      {isCalendarsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar o calendário</AlertTitle>
          <AlertDescription>
            Não foi possível consultar o calendário académico de provas da
            Pós-Graduação.
          </AlertDescription>
        </Alert>
      )}

      {hasSelectedFilters ? (
        <>
          <div className="font-semibold text-primary">
            Total de períodos: {calendars.length}
          </div>

          <DataTable
            columns={columns}
            data={paginatedCalendars}
            loading={isLoading || isFetching}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertTitle>Consulta do calendário de provas</AlertTitle>
          <AlertDescription>
            {isPreparingFilters
              ? "A preparar os filtros iniciais..."
              : "Não foi possível inicializar os filtros da consulta."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
