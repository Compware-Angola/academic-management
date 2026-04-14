import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, Home, ChevronLeft, ChevronRight, CalendarDays, Users, X } from "lucide-react";
import { Link } from "react-router-dom";

import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { ChartLineInteractive } from "./components/chart-line-interactive";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { parseFilter } from "@/util/parse-filter";
import { useInscricoesPorDia } from "@/hooks/access_exam/use-estatistica-por-dia";

export default function EstatisticasDiaria() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    codigoAnoLetivo: "23",
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,
  });

  const { data: estatisticaDiaria, isLoading: isLoadingEstatisticaDiaria, refetch } = useInscricoesPorDia({
    codigoAnoLetivo: parseFilter(filters.codigoAnoLetivo),
    codigoCurso: parseFilter(filters.codigoCurso),
    codigoTurno: parseFilter(filters.codigoTurno),
    codigoFaculdade: parseFilter(filters.codigoFaculdade),
    page: filters.page,
    limit: filters.limit,
  });

  const totalPages = estatisticaDiaria?.totalpages || 1;
  const currentPage = filters.page;

  // ==================== PREPARAÇÃO PARA EXPORTAÇÃO ====================

  const exportRows = useMemo(() => {
    return (estatisticaDiaria?.data ?? []).map((item, index) => ({
      numero: (currentPage - 1) * filters.limit + index + 1,
      data: item.data,
      subtotal: item.subtotal,
      percentagem: estatisticaDiaria?.data?.length 
        ? Math.round((item.subtotal / Math.max(...estatisticaDiaria.data.map(d => d.subtotal || 0))) * 100) 
        : 0,
    }));
  }, [estatisticaDiaria, currentPage, filters.limit]);

  const pdfData = exportRows.length
    ? {
        filtros: [
          filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
          filters.codigoFaculdade ? `Faculdade: ${filters.codigoFaculdade}` : null,
          filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
          filters.codigoTurno ? `Período: ${filters.codigoTurno}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        total: estatisticaDiaria?.totalgeralcandidatos ?? 0,
        rows: exportRows,
      }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Estatísticas Diárias - Exame de Acesso"
      subtitle="Número de candidatos por dia de inscrição"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de candidatos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "numero", label: "#", width: "8%" },
          { key: "data", label: "Data", width: "25%" },
          { key: "subtotal", label: "Subtotal", width: "25%" },
          { key: "percentagem", label: "Percentagem", width: "25%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Estatísticas Diárias - Exame de Acesso",
        subtitle: "Número de candidatos por dia de inscrição",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
          { title: "Resumo", content: [`Total de candidatos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "numero", label: "#", width: 10 },
            { key: "data", label: "Data", width: 25 },
            { key: "subtotal", label: "Subtotal", width: 20 },
            { key: "percentagem", label: "Percentagem (%)", width: 20 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Estatisticas_Diarias_Exame_${new Date().toISOString().slice(0, 10)}`;

  // ==================== HANDLERS ====================

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit,
      codigoAnoLetivo: "23",
      codigoCurso: undefined,
      codigoTurno: undefined,
      codigoFaculdade: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Estatísticas Diária</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estatísticas Diárias</h1>
          <p className="text-muted-foreground mt-1">
            Número de candidatos por dia de inscrição no exame de acesso.
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
          <Button variant="ghost" size="sm" onClick={resetFilters}>
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
            onChange={(v) => setFilters({ ...filters, codigoAnoLetivo: v, page: 1 })}
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
          />

          <FacultySelect
            allOption
            value={filters.codigoFaculdade}
            onChangeValue={(v) =>
              setFilters({ ...filters, codigoFaculdade: v, codigoCurso: undefined, page: 1 })
            }
          />

          <CourseSelect
            value={filters.codigoCurso}
            onChangeValue={(v) => setFilters({ ...filters, codigoCurso: v, page: 1 })}
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
            options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
            map={(p) => ({
              key: p.codigo.toString(),
              label: p.designacao,
              value: p.codigo.toString(),
            })}
          />
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Candidatos por Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold w-16">#</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Distribuição</TableHead>
                  <TableHead className="text-right font-semibold">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEstatisticaDiaria ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">Carregando...</TableCell>
                  </TableRow>
                ) : estatisticaDiaria?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Nenhum resultado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  estatisticaDiaria?.data?.map((item, index) => {
                    const maxSubtotal = Math.max(...(estatisticaDiaria.data?.map((d) => d.subtotal) || [0]));
                    const pct = maxSubtotal > 0 ? (item.subtotal / maxSubtotal) * 100 : 0;

                    return (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="text-muted-foreground">
                          {(currentPage - 1) * filters.limit + index + 1}
                        </TableCell>
                        <TableCell className="font-mono font-medium">{item.data}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-10 text-right">
                              {Math.round(pct)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                            {item.subtotal}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>Total na Página</TableCell>
                  <TableCell className="text-right text-primary">
                    {estatisticaDiaria?.total?.toLocaleString() || 0}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span> •{" "}
              {estatisticaDiaria?.totalgeralcandidatos?.toLocaleString() || 0} candidatos no total
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <ChartLineInteractive 
        data={estatisticaDiaria?.data} 
        isLoading={isLoadingEstatisticaDiaria} 
      />
    </div>
  );
}