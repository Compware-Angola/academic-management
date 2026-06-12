import { useMemo, useState } from "react";
import { AlertCircle, List, RefreshCw } from "lucide-react";

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
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryAtividades } from "@/hooks/queries/use-query-atividades";
import { Atividade } from "@/services/fetch-atividade";
import { formatarData } from "@/util/date-formate";

type FiltersState = {
  academicYearId: string;
  degreeId: string;
};

const initialFilters: FiltersState = {
  academicYearId: "",
  degreeId: "",
};

const ITEMS_PER_PAGE = 10;

export default function PostGraduationAcademicActivities() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [filterError, setFilterError] = useState("");

  const { data: academicYears = [], isLoading: isLoadingAcademicYears } =
    useQueryAnoAcademico();
  const {
    data: degreesResponse,
    isLoading: isLoadingDegrees,
    isError: isDegreesError,
  } = useQueryPostGraduationDegrees();

  const {
    data: activities = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQueryAtividades({
    anoLetivoId: shouldFetch ? appliedFilters.academicYearId : "",
    tipoCandidaturaId: shouldFetch ? appliedFilters.degreeId : "",
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

  const columns = useMemo(
    () => [
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
    ],
    [],
  );

  function handleFilterChange(key: keyof FiltersState, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
    setFilterError("");
  }

  function handleList() {
    if (!filters.academicYearId || !filters.degreeId) {
      setFilterError("Selecione o ano lectivo e o grau antes de listar.");
      return;
    }

    setFilterError("");
    setCurrentPage(1);
    setAppliedFilters(filters);
    setShouldFetch(true);
  }

  function handleRefresh() {
    if (shouldFetch) {
      refetch();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atividades Letivas de Pós-Graduação"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={!shouldFetch || isFetching}
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

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleList}
              disabled={isLoadingAcademicYears || isLoadingDegrees}
            >
              <List className="mr-2 h-4 w-4" />
              Listar
            </Button>
          </div>
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

      {shouldFetch ? (
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
          <List className="h-4 w-4" />
          <AlertTitle>Consulta de atividades letivas</AlertTitle>
          <AlertDescription>
            Selecione o ano lectivo e o grau para listar as atividades.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
