import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  PlayCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { useMutationCorrectPostGraduationFinalResults } from "@/hooks/post-graduation/use-mutation-correct-final-results";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryPostGraduationFinalResults } from "@/hooks/post-graduation/use-query-final-results";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import {
  PostGraduationDegree,
} from "@/services/post-graduation/fetch-degrees.service";
import {
  PostGraduationFinalResultStatus,
} from "@/services/post-graduation/fetch-final-results.service";
import { formatDateOnlyPt } from "@/util/date-formate";
import { BarraDeProgresso } from "../access_exam/components/BarraDeProgresso";

type FilterState = {
  academicYearId: string;
  degreeId: string;
  facultyId: string;
  courseId: string;
  periodId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  search: string;
  page: number;
  limit: number;
};

type DegreeOption = PostGraduationDegree & { id: number };

const MASTERS_DEGREE_ID = 2;
const ALL_VALUE = "all";

const initialFilters: FilterState = {
  academicYearId: "",
  degreeId: "",
  facultyId: ALL_VALUE,
  courseId: ALL_VALUE,
  periodId: ALL_VALUE,
  roomId: ALL_VALUE,
  startDate: "",
  endDate: "",
  search: "",
  page: 1,
  limit: 10,
};

const resultLabels: Record<PostGraduationFinalResultStatus, string> = {
  ADMITTED: "Admitido",
  FAILED: "Reprovado",
  PENDING: "Pendente",
};

const resultClasses: Record<PostGraduationFinalResultStatus, string> = {
  ADMITTED: "border-green-500/20 bg-green-500/10 text-green-600",
  FAILED: "border-red-500/20 bg-red-500/10 text-red-600",
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

export default function PostGraduationFinalResults() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isProcessing, setIsProcessing] = useState(false);

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
    data: periods = [],
    isLoading: isLoadingPeriods,
    isError: isPeriodsError,
  } = useQueryPeriod();
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useQuerySalas();

  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree): degree is DegreeOption =>
          degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
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

  const hasRequiredFilters =
    Number(filters.academicYearId) > 0 &&
    [2, 3].includes(Number(filters.degreeId));

  const queryParams = {
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
    facultyId:
      filters.facultyId === ALL_VALUE
        ? undefined
        : Number(filters.facultyId),
    courseId:
      filters.courseId === ALL_VALUE
        ? undefined
        : Number(filters.courseId),
    periodId:
      filters.periodId === ALL_VALUE
        ? undefined
        : Number(filters.periodId),
    roomId:
      filters.roomId === ALL_VALUE ? undefined : Number(filters.roomId),
    search: filters.search.trim() || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    page: filters.page,
    limit: filters.limit,
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQueryPostGraduationFinalResults(queryParams, {
    enabled: hasRequiredFilters,
  });
  const correctFinalResults =
    useMutationCorrectPostGraduationFinalResults(setIsProcessing);

  const records = useMemo(() => data?.data ?? [], [data?.data]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const offset = (filters.page - 1) * filters.limit;

  useEffect(() => {
    if (filters.page > totalPages) {
      setFilters((current) => ({ ...current, page: totalPages }));
    }
  }, [filters.page, totalPages]);

  const exportRows = useMemo(
    () =>
      records.map((record) => ({
        registrationNumber: record.candidateId,
        name: record.candidateName,
        identityDocument: record.identityDocument ?? "-",
        degree: record.degree,
        course: record.course,
        faculty: record.faculty,
        room: record.room ?? "-",
        examDate: record.examDate
          ? formatDateOnlyPt(record.examDate)
          : "-",
        score: record.examScore ?? "-",
        result: resultLabels[record.resultStatus],
      })),
    [records],
  );

  const exportData = exportRows.length
    ? {
        filters: [
          `Ano lectivo: ${filters.academicYearId}`,
          `Grau: ${
            degrees.find(
              (degree) => String(degree.id) === filters.degreeId,
            )?.designation ?? filters.degreeId
          }`,
          filters.courseId !== ALL_VALUE
            ? `Curso: ${filters.courseId}`
            : null,
          filters.periodId !== ALL_VALUE
            ? `Período: ${filters.periodId}`
            : null,
          filters.startDate ? `Data inicial: ${filters.startDate}` : null,
          filters.endDate ? `Data final: ${filters.endDate}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        rows: exportRows,
      }
    : null;

  const pdfContent = exportData ? (
    <GenericPDFDocument
      documentTitle="Resultados Finais - Pós-Graduação"
      subtitle="Classificação dos candidatos ao Exame de Acesso"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: exportData.filters,
        },
        {
          title: "Resumo",
          content: [`Total de registos: ${total}`],
        },
      ]}
      mainTable={{
        headers: [
          { key: "registrationNumber", label: "Nº Inscrição", width: "12%" },
          { key: "name", label: "Nome", width: "22%" },
          { key: "identityDocument", label: "BI", width: "14%" },
          { key: "course", label: "Curso", width: "18%" },
          { key: "room", label: "Sala", width: "9%" },
          { key: "examDate", label: "Data", width: "11%" },
          { key: "score", label: "Nota", width: "7%" },
          { key: "result", label: "Resultado", width: "10%" },
        ],
        rows: exportData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = exportData
    ? {
        documentTitle: "Resultados Finais - Pós-Graduação",
        subtitle: "Classificação dos candidatos ao Exame de Acesso",
        infoSections: [
          { title: "Filtros Aplicados", content: exportData.filters },
          { title: "Resumo", content: [`Total de registos: ${total}`] },
        ],
        mainTable: {
          headers: [
            { key: "registrationNumber", label: "Nº Inscrição", width: 18 },
            { key: "name", label: "Nome", width: 35 },
            { key: "identityDocument", label: "BI", width: 20 },
            { key: "degree", label: "Grau", width: 18 },
            { key: "course", label: "Curso", width: 30 },
            { key: "faculty", label: "Faculdade", width: 30 },
            { key: "room", label: "Sala", width: 15 },
            { key: "examDate", label: "Data Realização", width: 18 },
            { key: "score", label: "Nota", width: 10 },
            { key: "result", label: "Resultado", width: 15 },
          ],
          rows: exportData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const fileName = `Resultados_Finais_Pos_Graduacao_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  function updateFilter<K extends keyof FilterState>(
    field: K,
    value: FilterState[K],
  ) {
    setFilters((current) => {
      if (field === "degreeId") {
        return {
          ...current,
          degreeId: value as string,
          courseId: ALL_VALUE,
          page: 1,
        };
      }

      if (field === "facultyId") {
        return {
          ...current,
          facultyId: value as string,
          courseId: ALL_VALUE,
          page: 1,
        };
      }

      return {
        ...current,
        [field]: value,
        page: field === "page" ? (value as number) : 1,
      };
    });
  }

  function clearFilters() {
    setFilters((current) => ({
      ...initialFilters,
      academicYearId: current.academicYearId,
      degreeId: current.degreeId,
      limit: current.limit,
    }));
  }

  const filterLoadError =
    isAcademicYearsError ||
    isDegreesError ||
    isPeriodsError ||
    isRoomsError;

  return (
    <div className="space-y-6">
      {isProcessing && <BarraDeProgresso />}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Pós-Graduação</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Exame de Acesso</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resultados Finais</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resultados Finais
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pauta geral dos candidatos ao Exame de Acesso da Pós-Graduação.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasRequiredFilters || isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Atualizar
          </Button>

          {records.length > 0 && (
            <Button
              size="sm"
              className="gap-2"
              disabled={correctFinalResults.isPending || isProcessing}
              onClick={() => correctFinalResults.mutate()}
            >
              {correctFinalResults.isPending || isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              {correctFinalResults.isPending
                ? "Corrigindo provas..."
                : "Corrigir Provas Agora"}
            </Button>
          )}

          {pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`${fileName}.pdf`}
              showDownload
              showPrint
            />
          )}

          {excelProps && (
            <ExcelActions
              excelProps={excelProps}
              fileName={`${fileName}.xlsx`}
              showDownload
            />
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormSelect
            label="Ano Lectivo"
            value={filters.academicYearId}
            onChange={(value) => updateFilter("academicYearId", value)}
            options={academicYears}
            loading={isLoadingAcademicYears}
            map={(year) => ({
              key: year.codigo,
              value: year.codigo,
              label: year.designacao,
            })}
          />

          <FormSelect
            label="Grau"
            value={filters.degreeId}
            onChange={(value) => updateFilter("degreeId", value)}
            options={degrees}
            loading={isLoadingDegrees}
            map={(degree) => ({
              key: degree.id,
              value: degree.id,
              label: degree.designation,
            })}
          />

          <FacultySelect
            allOption
            value={filters.facultyId}
            onChangeValue={(value) => updateFilter("facultyId", value)}
          />

          <CourseSelect
            label="Curso"
            value={filters.courseId}
            onChangeValue={(value) => updateFilter("courseId", value)}
            enableDefaultSelectItem
            disabled={!filters.degreeId}
            params={{
              faculdadeId:
                filters.facultyId === ALL_VALUE
                  ? undefined
                  : Number(filters.facultyId),
              tipoCandidaturaId: Number(filters.degreeId),
            }}
          />

          <FormSelect
            label="Período"
            value={filters.periodId}
            onChange={(value) => updateFilter("periodId", value)}
            options={periods}
            loading={isLoadingPeriods}
            defaultSelectItem={[{ value: ALL_VALUE, label: "Todos" }]}
            map={(period) => ({
              key: period.codigo,
              value: period.codigo,
              label: period.designacao,
            })}
          />

          <FormCommandSelect
            label="Sala"
            value={filters.roomId}
            onChange={(value) => updateFilter("roomId", value)}
            options={rooms}
            isLoading={isLoadingRooms}
            width="full"
            defaultSelectItem={[
              { key: "all-rooms", value: ALL_VALUE, label: "Todos" },
            ]}
            map={(room) => ({
              key: room.pk,
              value: room.pk,
              label: room.descricao,
            })}
          />

          <div className="space-y-2">
            <Label htmlFor="post-graduation-final-results-start-date">
              Data Início
            </Label>
            <Input
              id="post-graduation-final-results-start-date"
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              onChange={(event) =>
                updateFilter("startDate", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-graduation-final-results-end-date">
              Data Fim
            </Label>
            <Input
              id="post-graduation-final-results-end-date"
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              onChange={(event) =>
                updateFilter("endDate", event.target.value)
              }
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="post-graduation-final-results-search">
              Pesquisar
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="post-graduation-final-results-search"
                className="pl-9"
                placeholder="Pesquisar por nome ou BI"
                value={filters.search}
                onChange={(event) =>
                  updateFilter("search", event.target.value)
                }
              />
            </div>
          </div>
        </div>

        {filterLoadError && (
          <p className="mt-4 text-sm text-destructive">
            Não foi possível carregar um ou mais filtros da página.
          </p>
        )}
      </div>

      {!hasRequiredFilters && (
        <Alert>
          <AlertTitle>Complete os filtros</AlertTitle>
          <AlertDescription>
            Selecione o ano lectivo e o grau para listar os resultados.
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não foi possível carregar os resultados</AlertTitle>
          <AlertDescription>
            {getErrorMessage(
              error,
              "Ocorreu um erro ao consultar os resultados finais.",
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Inscrição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>BI</TableHead>
                <TableHead>Grau</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Faculdade</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Data Realização</TableHead>
                <TableHead className="text-center">Nota</TableHead>
                <TableHead>Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                hasRequiredFilters &&
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: 11 }).map((__, cellIndex) => (
                      <TableCell
                        key={`skeleton-${rowIndex}-${cellIndex}`}
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && records.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {hasRequiredFilters
                      ? "Nenhum registo encontrado."
                      : "A listagem será apresentada depois de selecionar o ano lectivo e o grau."}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                records.map((record) => (
                  <TableRow key={record.candidateId}>
                    <TableCell className="font-mono font-semibold">
                      {record.candidateId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.candidateName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.identityDocument ?? "-"}
                    </TableCell>
                    <TableCell>{record.degree}</TableCell>
                    <TableCell className="text-sm">{record.course}</TableCell>
                    <TableCell className="text-sm">
                      {record.faculty}
                    </TableCell>
                    <TableCell>{record.period ?? "-"}</TableCell>
                    <TableCell>
                      {record.room ? (
                        <Badge variant="outline">{record.room}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.examDate
                        ? formatDateOnlyPt(record.examDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.examScore === null ? (
                        "-"
                      ) : (
                        <Badge
                          variant="outline"
                          className={
                            record.examScore >= 14
                              ? "border-green-500/20 bg-green-500/10 text-green-600"
                              : record.examScore >= 10
                                ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-600"
                                : "border-red-500/20 bg-red-500/10 text-red-600"
                          }
                        >
                          {record.examScore}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={resultClasses[record.resultStatus]}
                      >
                        {resultLabels[record.resultStatus]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select
            value={String(filters.limit)}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                limit: Number(value),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Mostrando {total === 0 ? 0 : offset + 1} a{" "}
            {Math.min(offset + records.length, total)} de {total} registos
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => updateFilter("page", filters.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">
            Página {filters.page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => updateFilter("page", filters.page + 1)}
          >
            Seguinte
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{
    message?: string | string[];
  }>;
  const responseMessage = axiosError.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(" ");
  }

  return responseMessage ?? axiosError.message ?? fallback;
}
