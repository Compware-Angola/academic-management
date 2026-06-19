import { useMemo } from "react";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions, {
  GenericExcelProps,
} from "@/components/views/excel/GenericExcelExport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Home, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryGuidanceResearchManagementStudent } from "@/hooks/post-graduation/useQueryGuidanceResearchManagementStudent";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
export default function GuidanceResearchManagementStudent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    estado: "",
    faculdade: "",
    periodo: "",
    tipoCandidatura: "",
    search: "",
  });
  const {
    data: estudanteFinalistaResponse,
    refetch,
    isFetching,
  } = useQueryGuidanceResearchManagementStudent({
    anoLectivo: parseFilter(filters.anoLectivo),
    curso: parseFilter(filters.curso),
    tipoCandidatura: parseFilter(filters.tipoCandidatura),
    page,
    limit,
    search: debounceSearch,
  });
  const pdfData = useMemo(() => {
    if (!estudanteFinalistaResponse?.data) return null;
    return {
      rows: estudanteFinalistaResponse.data.map((u) => ({
        matricula: u.matricula,
        nome: u.nome,
        bilhete: u.bilhete,
        curso: u.curso,
      })),
    };
  }, [estudanteFinalistaResponse]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Estudantes"
      mainTable={{
        headers: [
          { key: "matricula", label: "Nº Matrícula", width: "15%" },
          { key: "nome", label: "Nome", width: "35%" },
          { key: "bilhete", label: "Bilhete", width: "20%" },
          { key: "curso", label: "Curso", width: "30%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps: GenericExcelProps | null = pdfData
    ? {
      documentTitle: "Estudantes",
      mainTable: {
        headers: [
          { key: "matricula", label: "Nº Matrícula", width: 15 },
          { key: "nome", label: "Nome", width: 50 },
          { key: "bilhete", label: "Bilhete", width: 20 },
          { key: "curso", label: "Curso", width: 30 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;
  const handleRefetch = () => {
    setFilters({
      anoLectivo: "23",
      curso: "",
      estado: "",
      faculdade: "",
      periodo: "",
      tipoCandidatura: "",
      search: "",
    });
    setPage(1);
    refetch();
  };

  const tableData = estudanteFinalistaResponse?.data || [];
  const total = estudanteFinalistaResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const baseFileName = `estudantes_${new Date()
    .toISOString()
    .slice(0, 10)}`;
  return (
    <div className="p-6 space-y-6">
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
            <BreadcrumbLink> Gestão de Defesa e TFC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Estudantes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Estudantes</h1>
        <p className="text-muted-foreground">
          Consultar estudantes
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleRefetch}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          {pdfData && excelProps && (
            <>
              {pdfContent && (
                <PDFActions
                  document={pdfContent}
                  fileName={`${baseFileName}.pdf`}
                  showDownload
                  showPrint
                />
              )}

              <ExcelActions
                excelProps={excelProps}
                fileName={`${baseFileName}.xlsx`}
                showDownload
              />
            </>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
              enableDefaultActiveYear
              enableDefaultSelectItem
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) =>
                setFilters({ ...filters, faculdade: v, curso: "" })
              }
            />
            <TipoCandidaturaSelect
              isPostGraduation
              value={filters.tipoCandidatura}
              onChangeValue={(v) => setFilters({ ...filters, tipoCandidatura: v })}
            />
            <CourseSelect
              enableDefaultSelectItem
              disabled={!filters.faculdade || !filters.tipoCandidatura}
              params={{
                faculdadeId: parseFilter(filters.faculdade),
                tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />

            <div className="flex items-end">
              <Button onClick={handleRefetch}>
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          {/* Exportações */}

          <CardTitle>Estudantes</CardTitle>
          <Input
            placeholder="Pesquisar por nome de estudante, número de matrícula, Bilhete de Identidade"
            className="w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Estudantes...</p>
            </div>
          ) : tableData.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum estudante encontrado.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Bilhete</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Genero</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">
                        {item.matricula}
                      </TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.bilhete}</TableCell>
                      <TableCell>{item.curso}</TableCell>
                      <TableCell>{item.genero}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              A mostrar {tableData.length} de {total} registos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1 || isFetching || tableData.length === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span>
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={
                  page === totalPages || isFetching || tableData.length === 0
                }
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
