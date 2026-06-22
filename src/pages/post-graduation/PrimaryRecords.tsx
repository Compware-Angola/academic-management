import { useMemo, useState } from "react";
import { AlertCircle, List, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryPrimaryRecords } from "@/hooks/post-graduation/use-query-primary-records";
import { PostGraduationPrimaryRecord } from "@/services/post-graduation/fetch-primary-records.service";
import { formatDisplayPt } from "@/util/date-formate";

type FiltersState = {
  academicYearId: string;
  degreeId: string;
  search: string;
};

const ALL_DEGREES_VALUE = "all";

const initialFilters: FiltersState = {
  academicYearId: "",
  degreeId: ALL_DEGREES_VALUE,
  search: "",
};

function displayValue(value: string | number | null) {
  return value ?? "-";
}

export default function PostGraduationPrimaryRecords() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [filterError, setFilterError] = useState("");

  const { data: academicYears = [] } = useQueryAnoAcademico();
  const {
    data: degreesResponse,
    isLoading: isLoadingDegrees,
    isError: isDegreesError,
  } = useQueryPostGraduationDegrees();

  const queryParams = useMemo(
    () => ({
      academicYearId: Number(appliedFilters.academicYearId),
      applicationTypeId:
        appliedFilters.degreeId === ALL_DEGREES_VALUE
          ? undefined
          : Number(appliedFilters.degreeId),
      search: appliedFilters.search.trim() || undefined,
      page: currentPage,
      limit: 10,
    }),
    [appliedFilters, currentPage]
  );

  const {
    data,
    isLoading,
    isFetching,
    isError: isRecordsError,
  } = useQueryPrimaryRecords(queryParams, {
    enabled: shouldFetch,
  });

  const records = Array.isArray(data?.data) ? data.data : [];
  const degrees = degreesResponse?.data ?? [];

  const columns = [
    { header: "Nome", accessor: "fullName" },
    {
      header: "Número do Bilhete",
      accessor: "identityDocument",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.identityDocument),
    },
    {
      header: "Género",
      accessor: "gender",
      cell: (row: PostGraduationPrimaryRecord) => displayValue(row.gender),
    },
    {
      header: "Idade",
      accessor: "age",
      cell: (row: PostGraduationPrimaryRecord) => displayValue(row.age),
    },
    {
      header: "Data de Nascimento",
      accessor: "birthDate",
      cell: (row: PostGraduationPrimaryRecord) =>
        row.birthDate ? formatDisplayPt(row.birthDate) : "-",
    },
    {
      header: "Província",
      accessor: "residenceProvince",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.residenceProvince),
    },
    {
      header: "Município de residência",
      accessor: "residenceMunicipality",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.residenceMunicipality),
    },
    {
      header: "País de origem",
      accessor: "countryOfOrigin",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.countryOfOrigin),
    },
    {
      header: "Período de estudo",
      accessor: "studyPeriod",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.studyPeriod),
    },
    { header: "Unidade orgânica", accessor: "faculty" },
    { header: "Curso", accessor: "course" },
    {
      header: "Ano de frequência",
      accessor: "curricularYear",
      cell: (row: PostGraduationPrimaryRecord) =>
        displayValue(row.curricularYear),
    },
    { header: "Situação académica", accessor: "enrollmentStatus" },
  ];

  function handleFilterChange<K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    if (key === "academicYearId") {
      setFilterError("");
    }
  }

  function handleList() {
    if (!filters.academicYearId) {
      setFilterError("Selecione o ano lectivo antes de listar.");
      return;
    }

    setFilterError("");
    setCurrentPage(1);
    setAppliedFilters(filters);
    setShouldFetch(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Registos Primários de Pós-Graduação" />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo</label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) =>
                  handleFilterChange("academicYearId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano lectivo" />
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
              {filterError && (
                <p className="text-sm text-destructive">{filterError}</p>
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
                      key={degree.id ?? ALL_DEGREES_VALUE}
                      value={
                        degree.id === null
                          ? ALL_DEGREES_VALUE
                          : String(degree.id)
                      }
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

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(event) =>
                    handleFilterChange("search", event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleList();
                    }
                  }}
                  placeholder="Pesquisar por nome, documento, matrícula ou curso"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleList} disabled={isLoadingDegrees}>
              <List className="mr-2 h-4 w-4" />
              Listar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isRecordsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar os registos</AlertTitle>
          <AlertDescription>
            Não foi possível consultar os registos primários de
            Pós-Graduação.
          </AlertDescription>
        </Alert>
      )}

      <div className="font-semibold text-primary">
        Total de registos: {data?.total ?? 0}
      </div>

      <DataTable
        columns={columns}
        data={records}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
