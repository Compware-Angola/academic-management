import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, Home, ChevronLeft, ChevronRight, CalendarDays, Users, X } from "lucide-react";
import { Link } from "react-router-dom";

import { ChartLineInteractive } from "./components/chart-line-interactive";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

const mockResponse = {
  data: [
    { data: "30/08/2021", subtotal: 2 },
    { data: "18/08/2025", subtotal: 176 },
    { data: "19/08/2025", subtotal: 118 },
    { data: "20/08/2025", subtotal: 112 },
    { data: "21/08/2025", subtotal: 81 },
    { data: "22/08/2025", subtotal: 86 },
    { data: "23/08/2025", subtotal: 12 },
    { data: "24/08/2025", subtotal: 14 },
    { data: "25/08/2025", subtotal: 74 },
    { data: "26/08/2025", subtotal: 85 },
  ],
  total: 75,
  totalgeralcandidatos: 3181,
  page: 1,
  limit: 10,
  totalpages: 8,
};

export default function EstatisticasDiaria() {
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

  });

  const [currentPage, setCurrentPage] = useState(mockResponse.page);

  const subtotalPagina = mockResponse.data.reduce((a, b) => a + b.subtotal, 0);
  const maxSubtotal = Math.max(...mockResponse.data.map((d) => d.subtotal));



  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Estatísticas Diária</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estatísticas Diárias
          </h1>
          <p className="text-muted-foreground mt-1">
            Número de candidatos por dia de inscrição no exame de acesso.
          </p>
        </div>


      </div>
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({

                codigoAnoLetivo: "23",
                codigoCurso: undefined,
                codigoTurno: undefined,
                codigoFaculdade: undefined,

                page: 1,
                limit: filters.limit,
              })
            }
          >
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <FormSelect
            label="Ano Letivo"
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            value={filters.codigoAnoLetivo?.toString() ?? "all"}
            onChange={(v) =>
              setFilters({ ...filters, codigoAnoLetivo: v, page: 1 })
            }
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
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
            options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
            map={(p) => ({
              key: p.codigo.toString(),
              label: p.designacao,
              value: p.codigo.toString(),
            })}
          />


        </div>
      </div>


      {/* Table */}
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
                {mockResponse.data.map((item, index) => {
                  const pct = maxSubtotal > 0 ? (item.subtotal / maxSubtotal) * 100 : 0;
                  return (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground">{(currentPage - 1) * mockResponse.limit + index + 1}</TableCell>
                      <TableCell className="font-mono font-medium">{item.data}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(pct)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                          {item.subtotal}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>Total na Página</TableCell>
                  <TableCell className="text-right text-primary">{subtotalPagina}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {mockResponse.totalpages} — {mockResponse.totalgeralcandidatos.toLocaleString()} candidatos no total
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage === mockResponse.totalpages} onClick={() => setCurrentPage((p) => p + 1)}>
                Próxima<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
     <ChartLineInteractive/>
    </div>
  );
}
