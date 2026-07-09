import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import { useQueryUCDocenteSemAfectacao } from "@/hooks/gestao_docente/use-query-fetch-uc-docente-sem-afectacao";
import { useDebounce } from "@/hooks/use-debounce";
import { parseFilter } from "@/util/parse-filter";
import { Loader2, RefreshCcw } from "lucide-react";

import { useId, useState, useEffect } from "react";

const CURSO_ALL_VALUES = ["all", "0"];
const isCursoAll = (value: string) => CURSO_ALL_VALUES.includes(value);

function parseCursoFilter(value: string): number | undefined {
  // era "all" no retorno
  return isCursoAll(value) ? undefined : Number(value); // era return "all"
}

const ListarUCDocenteSemAfetacao = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    docente: "",
    curso: "0",
    anoCurricular: "",
  });

  const {
    data,
    isLoading: isLoadingUCDocenteSemAfectacao,
    refetch,
  } = useQueryUCDocenteSemAfectacao({
    anoLectivoId: parseFilter(filters.anoLectivo),
    cursoId: parseCursoFilter(filters.curso),
    semestreId: parseFilter(filters.semestre),
    classeId: parseFilter(filters.anoCurricular),
    search: debouncedSearch,
    limit,
    page,
  });

  const handleCleanFilters = () => {
    setFilters({
      anoLectivo: "",
      semestre: "",
      docente: "",
      curso: "0",
      anoCurricular: "",
    });
    setSearch("");
    setPage(1);
    refetch();
  };

  const tableData = data?.data || [];
  const total = data?.meta.total || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Gestão de Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lista de UC sem docentes afetados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Lista de UC sem docentes afetados
        </h1>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader className="justify-between flex-row items-center">
          <CardTitle>Filtros de Pesquisa</CardTitle>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleCleanFilters}
          >
            Limpar Filtros <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-4">
            <AcademicYearSelect
              enableDefaultSelectItem
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <CourseSelect
              value={filters.curso}
              // enableDefaultSelectItem
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />

            <AnoCurricularSelect
              enableDefaultSelectItem
              value={filters.anoCurricular}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoCurricular: v })
              }
              curso={filters.curso}
            />
            <SemestreSelect
              enableDefaultSelectItem
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela e Search */}
      <Card className="py-6">
        <div className="p-4 flex justify-end">
          <Input
            placeholder="Pesquisar por curso ou unidade curricular"
            className="w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CardContent>
          {isLoadingUCDocenteSemAfectacao ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Carregando Unidades Curriculares...
              </p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">
                Nenhuma Unidade Curricular encontrada
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Semestre</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigo_disciplina}>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell>{item.semestre}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando{" "}
                  {Math.min((page - 1) * limit + tableData.length, total)} de{" "}
                  {total} registros
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm font-medium">
                    Página {page} de {data?.meta.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= data?.meta.totalPages}
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
                    <SelectTrigger className="w-20 h-9">
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
    </div>
  );
};

export default ListarUCDocenteSemAfetacao;
