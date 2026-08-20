import { useState } from "react";

import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { parseFilter } from "@/util/parse-filter";
import { Download, FileText, Printer } from "lucide-react";
import { Loader2, X } from "lucide-react";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { useQueryListEstudantesMatriculados } from "@/hooks/registrations/use-query-estudantes-matriculados";
import { useQueryEstatisticaEstudantesMatriculados } from "@/hooks/registrations/use-estatistica-estudantes-matriculados";
import { formatarData } from "@/util/date-formate";
import { FormSelect } from "@/components/common/FormSelect";
import {
  exportEstudantesMatriculadosPdfService,
  exportEstudantesMatriculadosExcelService,
} from "@/services/registrations/export-estudantes-matriculados.service";
import { toast } from "sonner";
import { ChartEstudantesMatriculados } from "./components/chart-estudantes-matriculados";

type ExportAction = "pdf" | "print" | "excel";

const EstudantesMatriculado = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    periodo: "all",
    curso: "0",
    tipoEstudante: "all",
    anoCurricular: "all",
  });
  const [exportingAction, setExportingAction] = useState<ExportAction | null>(
    null,
  );

  const tipoEstudantes = [
    { key: "all", label: "Todos" },
    { key: "1", label: "Estudante Novo" },
    { key: "0", label: "Estudante Antigo" },
  ];

  const { data: studentsResponse, isLoading } =
    useQueryListEstudantesMatriculados({
      codigoAnoLectivo: parseFilter(filters.anoLectivo),
      codigoCurso: parseFilter(filters.curso),
      periodo: parseFilter(filters.periodo),
      anoCurricular: parseFilter(filters.anoCurricular),
      tipoEstudante: parseFilter(filters.tipoEstudante),
      limit,
      page,
    });

  const statisticsFilters = {
    codigoAnoLectivo: parseFilter(filters.anoLectivo),
    codigoCurso: parseFilter(filters.curso),
    periodo: parseFilter(filters.periodo),
    anoCurricular: parseFilter(filters.anoCurricular),
    tipoEstudante: parseFilter(filters.tipoEstudante),
  };

  const { data: statisticsResponse, isLoading: isLoadingStatistics } =
    useQueryEstatisticaEstudantesMatriculados(statisticsFilters);

  const students = studentsResponse?.data ?? [];
  const total = studentsResponse?.total;
  const totalPages = studentsResponse?.totalPages;

  const getExportParams = () => ({
    codigoAnoLectivo: parseFilter(filters.anoLectivo),
    codigoCurso: parseFilter(filters.curso),
    periodo: parseFilter(filters.periodo),
    anoCurricular: parseFilter(filters.anoCurricular),
    tipoEstudante: parseFilter(filters.tipoEstudante),
  });

  const handleExport = async (action: ExportAction) => {
    if (exportingAction || !total) return;

    const printWindow = action === "print" ? window.open("", "_blank") : null;

    if (action === "print" && !printWindow) {
      toast.error("O navegador bloqueou a janela de impressão.");
      return;
    }

    setExportingAction(action);

    try {
      const params = getExportParams();

      const { blob, fileName } =
        action === "excel"
          ? await exportEstudantesMatriculadosExcelService(params)
          : await exportEstudantesMatriculadosPdfService(params);

      const downloadUrl = URL.createObjectURL(blob);

      if (action === "print") {
        printWindow!.location.href = downloadUrl;
        setTimeout(() => {
          printWindow!.print();
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success("Exportação concluída com sucesso.");
    } catch {
      printWindow?.close();
      toast.error("Não foi possível exportar os estudantes matriculados.");
    } finally {
      setExportingAction(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      anoLectivo: "23",
      periodo: "all",
      curso: "0",
      tipoEstudante: "all",
      anoCurricular: "all",
    });
    setPage(1);
  };

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Inscrições e Matrículas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> Estudantes Matriculados </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Estudantes Matriculados e Confirmação de Matrícula
        </h1>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Filtros de Pesquisa</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-3">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <CourseSelect
              value={filters.curso}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />
            <PeriodoSelect
              enabledDefaultSelectItem
              value={filters.periodo}
              onChangeValue={(v) => setFilters({ ...filters, periodo: v })}
            />
            <AnoCurricularSelect
              enableDefaultSelectItem
              value={filters.anoCurricular}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoCurricular: v })
              }
              curso={filters.curso}
            />
            <FormSelect
              label="Estados"
              value={filters.tipoEstudante}
              onChange={(v) => setFilters({ ...filters, tipoEstudante: v })}
              options={tipoEstudantes}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
          </div>
        </CardContent>
      </Card>
      <ChartEstudantesMatriculados
        data={statisticsResponse?.data}
        isLoading={isLoadingStatistics}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Estudantes Matriculados</CardTitle>
            {total !== undefined && total > 0 && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  disabled={!!exportingAction}
                >
                  {exportingAction === "pdf" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  {exportingAction === "pdf" ? "A exportar..." : "Exportar PDF"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("print")}
                  disabled={!!exportingAction}
                >
                  {exportingAction === "print" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Printer className="mr-2 h-4 w-4" />
                  )}
                  {exportingAction === "print" ? "A imprimir..." : "Imprimir"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("excel")}
                  disabled={!!exportingAction}
                >
                  {exportingAction === "excel" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {exportingAction === "excel"
                    ? "A exportar..."
                    : "Exportar Excel"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Estudantes...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Estudante encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matricula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Gênero</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data da Matricula</TableHead>
                      <TableHead>Ano Lectivo de Ingresso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((item) => (
                      <TableRow key={item.codigomatricula}>
                        <TableCell>{item?.codigomatricula}</TableCell>
                        <TableCell>{item?.nome}</TableCell>
                        <TableCell>{item?.classe}</TableCell>
                        <TableCell>{item?.telefone}</TableCell>
                        <TableCell>{item?.genero}</TableCell>
                        <TableCell>{item?.curso}</TableCell>
                        <TableCell>{item?.tipo}</TableCell>
                        <TableCell>
                          {formatarData(item?.datamatricula)}
                        </TableCell>
                        <TableCell>{item?.anolectivo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {students.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>

                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
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
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export { EstudantesMatriculado };
