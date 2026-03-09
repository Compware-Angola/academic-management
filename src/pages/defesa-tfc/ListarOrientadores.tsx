import { useMemo } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import { Home, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { useQueryPagamentosTFC } from "@/hooks/defesa-tfc/use-query-pagamentos-tfc";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQueryEstudanteFinalista } from "@/hooks/defesa-tfc/use-query-estudante-finalista-tfc";

export default function ListarOrientadores() {
  //Options
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];
  // paginação
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(25);
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    estado: "",
    faculdade: "",
    periodo: "",
    tipoCandidatura: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);
  const { data: tipoCandidatura = [], isLoading: isLoadingTipoCandidatura } =
    useQueryTipoCandidatura();
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const {
    data: estudanteFinalistaResponse,
    refetch,
    isFetching,
  } = useQueryEstudanteFinalista({
    anoLectivo: parseFilter(filtersApplied.anoLectivo),
    curso: parseFilter(filtersApplied.curso),
    tipoCandidatura: parseFilter(filtersApplied.tipoCandidatura),

    page,
    limit,
  });
  const tableData = estudanteFinalistaResponse?.data || [];
  const total = estudanteFinalistaResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

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
            <BreadcrumbLink>Estudantes Finalistas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Estudantes Finalistas</h1>
      <p className="text-muted-foreground">Consultar estudantes finalistas.</p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
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
            <CourseSelect
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />
            <FormSelect
              label="Tipo Candidatura"
              value={filters.tipoCandidatura}
              onChange={(v) => setFilters({ ...filters, tipoCandidatura: v })}
              options={tipoCandidatura}
              loading={isLoadingTipoCandidatura}
              disabled={isLoadingTipoCandidatura}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo.toString(),
              })}
            />

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFiltersApplied(filters);
                  setSearchApplied(searchTerm);
                  refetch();
                }}
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2">
          {/* Exportações */}

          <CardTitle>Estudantes Finalistas</CardTitle>
        </CardHeader>

        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Pagamento...</p>
            </div>
          ) : tableData.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Pagamento encontrada.
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
        </CardContent>
      </Card>
    </div>
  );
}
