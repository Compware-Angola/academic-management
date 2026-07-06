import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  RefreshCw,
  Download,
  Printer,
  Home,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { FormSelect } from "@/components/common/FormSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useInscricoesPorData } from "@/hooks/access_exam/use-estatitica-candidato";
import { parseFilter } from "@/util/parse-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function EstatisticasExame() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    codigoAnoLetivo: "23",
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,
    dataInicio: undefined as string | undefined,
    dataFim: undefined as string | undefined,
  });

  const {
    data: estatistica,
    isLoading: isLoadingEstatistica,
    refetch,
  } = useInscricoesPorData({
    codigoAnoLetivo: parseFilter(filters.codigoAnoLetivo),
    codigoCurso: parseFilter(filters.codigoCurso),
    codigoTurno: parseFilter(filters.codigoTurno),
    codigoFaculdade: parseFilter(filters.codigoFaculdade),
    dataInicio: filters.dataInicio,
    dataFim: filters.dataFim,
    page: filters.page,
    limit: filters.limit,
  });

  // ==================== EXPORTAÇÕES ====================

  const exportRows = useMemo(() => {
    return (estatistica?.data ?? []).map((item) => ({
      data: item.data,
      laboral: item.qt_diurno,
      posLaboral: item.qt_noturno,
      totalDia: item.total_dia,
    }));
  }, [estatistica]);

  const pdfData = exportRows.length
    ? {
        filtros: [
          filters.codigoAnoLetivo
            ? `Ano Letivo: ${filters.codigoAnoLetivo}`
            : null,
          filters.codigoFaculdade
            ? `Faculdade: ${filters.codigoFaculdade}`
            : null,
          filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
          filters.codigoTurno ? `Período: ${filters.codigoTurno}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        total: estatistica?.total ?? 0,
        rows: exportRows,
      }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Estatísticas do Exame de Acesso"
      subtitle="Inscrições por data, turno e curso"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
        { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "data", label: "Data", width: "20%" },
          { key: "laboral", label: "Laboral (Diurno)", width: "25%" },
          { key: "posLaboral", label: "Pós-Laboral", width: "25%" },
          { key: "totalDia", label: "Total por Dia", width: "30%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Estatísticas do Exame de Acesso",
        subtitle: "Inscrições por data, turno e curso",
        infoSections: [
          {
            title: "Filtros Aplicados",
            content: pdfData.filtros || "Sem filtros",
          },
          { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "data", label: "Data", width: 20 },
            { key: "laboral", label: "Laboral (Diurno)", width: 25 },
            { key: "posLaboral", label: "Pós-Laboral", width: 25 },
            { key: "totalDia", label: "Total por Dia", width: 25 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Estatisticas_Exame_Acesso_${new Date().toISOString().slice(0, 10)}`;

  // ==================== HANDLERS ====================

  const handleClearFilters = () => {
    setFilters({
      codigoAnoLetivo: "23",
      codigoCurso: undefined,
      codigoTurno: undefined,
      codigoFaculdade: undefined,
      dataInicio: undefined,
      dataFim: undefined,
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <div className="space-y-6">
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
            <BreadcrumbLink>Exame de Acesso</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Estatísticas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estatísticas do Exame de Acesso
          </h1>
          <p className="text-muted-foreground mt-1">
            Candidatos inscritos por data, turno e curso no exame de acesso.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>

          {pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`${baseFileName}.pdf`}
              showDownload
              showPrint
            />
          )}

          {excelProps && (
            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormSelect
            label="Ano Letivo"
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            value={filters.codigoAnoLetivo?.toString() ?? "all"}
            onChange={(v) =>
              setFilters({ ...filters, codigoAnoLetivo: v, page: 1 })
            }
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FacultySelect
            allOption
            value={filters.codigoFaculdade}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                codigoFaculdade: v,
                codigoCurso: undefined,
                page: 1,
              })
            }
          />

          <CourseSelect
            value={filters.codigoCurso}
            onChangeValue={(v) =>
              setFilters({ ...filters, codigoCurso: v, page: 1 })
            }
          />

          <FormSelect
            disabled={isLoadingPeriodos}
            loading={isLoadingPeriodos}
            label="Período"
            value={filters.codigoTurno?.toString() ?? "all"}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                codigoTurno: v === "all" ? undefined : Number(v),
                page: 1,
              }))
            }
            options={[
              { codigo: "all", designacao: "Todos" },
              ...(periodos ?? []),
            ]}
            map={(p) => ({
              key: p.codigo.toString(),
              label: p.designacao,
              value: p.codigo.toString(),
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Data Início</label>
            <Input
              type="date"
              value={filters.dataInicio ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  dataInicio: e.target.value || undefined,
                  page: 1,
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Data Fim</label>
            <Input
              type="date"
              min={filters.dataInicio} // impede escolher "fim" antes do "início"
              value={filters.dataFim ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  dataFim: e.target.value || undefined,
                  page: 1,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <ChartAreaInteractive
        data={estatistica?.data}
        isLoading={isLoadingEstatistica}
      />

      {/* Tabela + Exportações já incluídas acima */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Inscrições por Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="text-center font-semibold">
                    Laboral
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Pós-Laboral
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Total/Dia
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEstatistica
                  ? Array.from({ length: filters.limit }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : estatistica?.data.map((item, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-medium">
                          {item.data}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary">
                          {item.qt_diurno}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.qt_noturno}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                            {item.total_dia}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell>Totais</TableCell>
                  <TableCell className="text-center text-primary">
                    {isLoadingEstatistica ? (
                      <Skeleton className="h-4 w-12 mx-auto" />
                    ) : (
                      estatistica?.data.reduce((a, b) => a + b.qt_diurno, 0)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isLoadingEstatistica ? (
                      <Skeleton className="h-4 w-12 mx-auto" />
                    ) : (
                      estatistica?.data.reduce((a, b) => a + b.qt_noturno, 0)
                    )}
                  </TableCell>
                  <TableCell className="text-center text-primary">
                    {isLoadingEstatistica ? (
                      <Skeleton className="h-4 w-12 mx-auto" />
                    ) : (
                      estatistica?.data.reduce((a, b) => a + b.total_dia, 0)
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {filters.page} de {estatistica?.totalpages} —{" "}
              {estatistica?.total} registos
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === estatistica?.totalpages}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              >
                Próxima <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
