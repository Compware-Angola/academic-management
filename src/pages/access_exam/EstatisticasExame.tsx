import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, Home, ChevronLeft, ChevronRight, BarChart3, X } from "lucide-react";
import { Link } from "react-router-dom";

import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { FormSelect } from "@/components/common/FormSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";

const mockResponse = {
  data: [
    { data: "01/09/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 9, qt_noturno: 2, total_dia: 11 },
    { data: "01/09/2025", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 0, qt_noturno: 1, total_dia: 1 },
    { data: "01/10/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 43, qt_noturno: 3, total_dia: 46 },
    { data: "01/10/2025", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 1, qt_noturno: 0, total_dia: 1 },
    { data: "02/08/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 3, qt_noturno: 1, total_dia: 4 },
    { data: "02/09/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 98, qt_noturno: 22, total_dia: 120 },
    { data: "02/09/2025", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 1, qt_noturno: 0, total_dia: 1 },
    { data: "02/10/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 56, qt_noturno: 2, total_dia: 58 },
    { data: "02/10/2025", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 2, qt_noturno: 0, total_dia: 2 },
    { data: "02/12/2024", qt_manha: 0, qt_tarde: 0, qt_noite: 0, qt_diurno: 0, qt_noturno: 1, total_dia: 1 },
  ],
  total: 161,
  page: 1,
  limit: 10,
  totalpages: 17,
};

export default function EstatisticasExame() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [currentPage, setCurrentPage] = useState(mockResponse.page);
  const [filters, setFilters] = useState({

    page: 1,
    limit: 10,
    codigoAnoLetivo: "23",
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,

  });


  const totalGeral = mockResponse.data.reduce((a, b) => a + b.total_dia, 0);



  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Estatísticas</BreadcrumbPage></BreadcrumbItem>
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


      </div>

      {/* Summary Cards */}
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
            <BarChart3 className="h-5 w-5 text-primary" />
            Inscrições por Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="text-center font-semibold">Laboral</TableHead>
                  <TableHead className="text-center font-semibold">Pós-Laboral</TableHead>
                  <TableHead className="text-center font-semibold">Total/Dia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResponse.data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">{item.data}</TableCell>
                    <TableCell className="text-center font-semibold text-primary">{item.qt_diurno}</TableCell>
                    <TableCell className="text-center font-semibold">{item.qt_noturno}</TableCell>
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
                    {mockResponse.data.reduce((a, b) => a + b.qt_diurno, 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {mockResponse.data.reduce((a, b) => a + b.qt_noturno, 0)}
                  </TableCell>
                  <TableCell className="text-center text-primary">
                    {totalGeral}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {mockResponse.totalpages} — {mockResponse.total} registos
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

      <ChartAreaInteractive />
    </div>
  );
}
