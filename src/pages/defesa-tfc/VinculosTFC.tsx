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
import { Home, Search, Loader2, RefreshCcw, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryOrientadoresTFC } from "@/hooks/defesa-tfc/use-query-orientadores-tfc";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { OrientadorModal } from "./components/orientador-modal";
import { useQueryVinculos } from "@/hooks/defesa-tfc/use-query-vinculos";
import { FormSelect } from "@/components/common/FormSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { VinculosModal } from "./components/vinculos-modal";
const statusConfig = {
  activo: {
    label: "Activo",
    variant: "default" as const,
    className: "bg-primary hover:bg-primary/80",
  },
  inactivo: {
    label: "Inactivo",
    variant: "destructive" as const,
    className: "bg-slate-500 hover:bg-slate-600",
  },
  pendente: {
    label: "Pendente",
    variant: "outline" as const,
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
};
export default function VinculosTFC() {
  //Options
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];
  // paginação
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    faculdade: "",
    orientador: "",
    estado: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const { data: orientadoresResponse } = useQueryOrientadoresTFC({
    anoLectivoId: parseFilter(filters.anoLectivo),
    cursoId: parseFilter(filters.curso),
    estado: "activo",
    page,
    limit,
  });
  const {
    data: vinculosResponse,
    refetch,
    isFetching,
  } = useQueryVinculos({
    anoLectivoId:
      filters.anoLectivo === "all"
        ? undefined
        : parseFilter(filters.anoLectivo),
    cursoId: parseFilter(filters.curso),
    search: searchTerm || undefined,
    page,
    limit,
  });
  const tableData = vinculosResponse?.data || [];
  const total = vinculosResponse?.total || 0;
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
            <BreadcrumbLink>Vínculos de TFC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vínculos de TFC</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Orientador"
              value={filters.orientador}
              onChange={(v) => setFilters({ ...filters, orientador: v })}
              options={orientadoresResponse?.data || []}
              loading={isFetching}
              disabled={isFetching}
              map={(u) => ({
                key: u.codigo,
                label: u.nome_orientador,
                value: u.codigo.toString(),
              })}
            />

            <div className="flex items-end">
              <Button
                aria-label="Limpar filtros"
                title="Limpar filtros"
                className="cursor-pointer"
                onClick={() => {
                  setFilters({
                    anoLectivo: "23",
                    curso: "",
                    orientador: "",
                    estado: "",
                    faculdade: "",
                  });
                  setPage(1);
                  setLimit(25);
                  refetch();
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2">
          {/* Exportações */}

          <CardTitle>Lista de Finalistas</CardTitle>
        </CardHeader>

        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Carregando Orientadores...
              </p>
            </div>
          ) : tableData.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Lista de Finalistas encontrada.
            </div>
          ) : (
            <>
              {/* 1. Envolva em uma div com scroll lateral */}
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="whitespace-nowrap">
                        Matrícula
                      </TableHead>
                      <TableHead className="min-w-[250px] whitespace-nowrap text-left">
                        Aluno
                      </TableHead>
                      <TableHead className="min-w-[200px] whitespace-nowrap text-left">
                        Curso
                      </TableHead>
                      <TableHead className="min-w-[300px] whitespace-nowrap text-left">
                        Tema
                      </TableHead>
                      <TableHead className="min-w-[200px] whitespace-nowrap text-left">
                        Orientador
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Data Vínculo
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs whitespace-nowrap text-left">
                          {item.matricula}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap text-left">
                          {item.nome_aluno}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap text-left">
                          {item.curso}
                        </TableCell>
                        <TableCell className="italic text-sm whitespace-nowrap text-left">
                          "{item.tema}"
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap text-left">
                          {item.nome_orientador}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-left">
                          {item.data_cadastro}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
      <VinculosModal open={open} setOpen={setOpen} />
    </div>
  );
}
