// src/pages/horarios/ScheduleList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  Search,
  File,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";

export default function ScheduleListEliminated() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    search: "",
  });

  // Paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // Queries dos filtros
  const { data: anosAcademicos, isLoading: loadingAnos } = useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos, isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: loadingCursos } = useCursos();

  const { data: anosCurriculares = [], isLoading: loadingAnosCurriculares } =
    useQueryClassFilterByCurso({ curso: filters.curso });

  const {
    data: horarios = [],
    isLoading: isLoadingHorarios,
    error,
    refetch,
  } = useQueryHorariosExistentes({
    p_ano_lectivo: filters.anoLetivo,
    p_semestre: filters.semestre,
    p_periodo: filters.periodo,
    p_curso: filters.curso,
    p_ano_curricular:
      filters.anoCurricular && filters.anoCurricular !== "todos"
        ? filters.anoCurricular
        : undefined,
  });

  // Filtro local por texto
  const filteredHorarios = horarios.filter((h) =>
    filters.search === "" ||
    h.designacao.toLowerCase().includes(filters.search.toLowerCase()) ||
    h.unidadeCurricular.toLowerCase().includes(filters.search.toLowerCase()) ||
    h.curso.toLowerCase().includes(filters.search.toLowerCase()) ||
    h.ano.toLowerCase().includes(filters.search.toLowerCase())
  );

  // Paginação lógica
  const totalItems = filteredHorarios.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHorarios.slice(startIndex, endIndex);

  const handleRefresh = () => {
    refetch();
    toast({ description: "Lista atualizada com sucesso." });
  };

  // Resetar página ao mudar filtros
  const resetPageOnFilterChange = () => {
    setPage(1);
  };

  // Monitora mudanças nos filtros para resetar a página
  React.useEffect(() => {
    resetPageOnFilterChange();
  }, [filters]);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Listar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Horário Eliminados
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os Horário criadas por ano letivo, semestre, período, curso e ano curricular.
          </p>
        </div>
    
      </div>

      {/* Filtros */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Ano Letivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano Letivo</label>
            <Select
              value={filters.anoLetivo}
              onValueChange={(v) =>
                setFilters({ ...filters, anoLetivo: v, anoCurricular: "" })
              }
              disabled={loadingAnos}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingAnos ? "A carregar..." : "Selecionar"} />
              </SelectTrigger>
              <SelectContent>
                {anosAcademicos?.map((ano) => (
                  <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                    {ano.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semestre */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Semestre</label>
            <Select
              value={filters.semestre}
              onValueChange={(v) => setFilters({ ...filters, semestre: v })}
              disabled={loadingSemestres}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {semestres?.map((s) => (
                  <SelectItem key={s.codigo} value={s.codigo.toString()}>
                    {s.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select
              value={filters.periodo}
              onValueChange={(v) => setFilters({ ...filters, periodo: v })}
              disabled={loadingPeriodos}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {periodos?.map((p) => (
                  <SelectItem key={p.codigo} value={p.codigo.toString()}>
                    {p.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Curso */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Curso</label>
            <Select
              value={filters.curso}
              onValueChange={(v) =>
                setFilters({ ...filters, curso: v, anoCurricular: "" })
              }
              disabled={loadingCursos}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {cursos?.map((c) => (
                  <SelectItem key={c.codigo} value={c.codigo.toString()}>
                    {c.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ano Curricular */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano Curricular</label>
            <Select
              value={filters.anoCurricular || "todos"}
              onValueChange={(v) =>
                setFilters({
                  ...filters,
                  anoCurricular: v === "todos" ? "" : v,
                })
              }
              disabled={loadingAnosCurriculares || !filters.curso}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingAnosCurriculares
                      ? "A carregar..."
                      : !filters.curso
                      ? "Selecione um curso"
                      : "Todos os anos"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os anos</SelectItem>
                {anosCurriculares?.map((ac) => (
                  <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                    {ac.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Input
            placeholder="Pesquisar por turma, UC, curso ou ano..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isLoadingHorarios}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoadingHorarios ? "animate-spin" : ""}`}
          />
          Atualizar Lista
        </Button>

        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} turmas
          </p>
        )}
      </div>

      {/* Tabela + Paginação */}
      <div className="rounded-lg border bg-card shadow-sm">
        {isLoadingHorarios ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-6">
            <AlertDescription>
              Erro ao carregar Horário. Tente novamente.
            </AlertDescription>
          </Alert>
        ) : filteredHorarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <File className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum Horário encontrado</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {filters.anoLetivo && filters.curso
                ? "Não existem Horários criadas com os filtros aplicados."
                : "Preencha os filtros para visualizar os Horários."}
            </p>
          
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Turma</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Unidade Curricular</TableHead>
                    <TableHead>Ano Curricular</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Disponibilidade</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((h) => (
                    <TableRow
                      key={h.codigo}
                      className="hover:bg-muted/50 cursor-pointer"
                     
                    >
                      <TableCell className="font-semibold text-primary">
                        {h.designacao}
                      </TableCell>
                      <TableCell>{h.curso}</TableCell>
                      <TableCell>{h.unidadeCurricular}</TableCell>
                      <TableCell className="font-medium">{h.ano}</TableCell>
                      <TableCell>{h.capacidade}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            h.estado.toLowerCase().includes("pendente") ||
                            h.estado.toLowerCase().includes("distribuição")
                              ? "secondary"
                              : "default"
                          }
                        >
                          {h.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={h.disponibilidade === "Fechado" ? "destructive" : "default"}
                        >
                          {h.disponibilidade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(h.dataCriacao).toLocaleDateString("pt-AO")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm text-muted-foreground px-4">
                    Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}