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
  Loader2,
  Eye,
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

import { useQueryHorariosEliminados } from "@/hooks/horario/use-query-horarios-existentes-eliminados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

export default function ScheduleListEliminated() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    anoCurricular: "",
    search: "",
    curso: "",
    semestre: "",
    periodo: "",
  });
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Queries dos filtros
  const { data: anosAcademicos, isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos, isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: loadingCursos } = useCursos();

  const { data: anosCurriculares = [], isLoading: loadingAnosCurriculares } =
    useQueryClassFilterByCurso({ curso: filters.curso });

  const { data, isLoading, error, refetch } = useQueryHorariosEliminados({
    anoLectivo: Number(filters.anoLectivo),
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    page,
    limit,
  });

  const horarios = data?.data ?? [];

  // Filtro local por texto
  const filteredHorarios = horarios.filter(
    (h) =>
      filters.search === "" ||
      h.designacao.toLowerCase().includes(filters.search.toLowerCase()) ||
      h.unidadecurricular
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      h.curso.toLowerCase().includes(filters.search.toLowerCase())
  );

  React.useEffect(() => {
    setPage(1);
  }, [filters.anoLectivo, filters.anoCurricular]);

  // Resetar página ao mudar filtros
  const resetPageOnFilterChange = () => {
    setPage(1);
  };
  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };
  // Monitora mudanças nos filtros para resetar a página
  React.useEffect(() => {
    resetPageOnFilterChange();
  }, [filters]);

  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="flex-1 space-y-6 p-8">
      <h1 className="text-3xl font-bold">Horários Eliminados</h1>

      {/* ---------- Filtros ---------- */}
      <div className="rounded-lg border bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ano Letivo */}
          <Select
            value={filters.anoLectivo}
            onValueChange={(v) =>
              setFilters({ ...filters, anoLectivo: v, anoCurricular: "" })
            }
            disabled={loadingAnos}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ano Letivo" />
            </SelectTrigger>
            <SelectContent>
              {anosAcademicos?.map((ano) => (
                <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                  {ano.designacao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ano Curricular */}
          <Select
            value={filters.anoCurricular || "todos"}
            onValueChange={(v) =>
              setFilters({ ...filters, anoCurricular: v === "todos" ? "" : v })
            }
            disabled={loadingAnosCurriculares}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ano Curricular" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {anosCurriculares.map((ac) => (
                <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                  {ac.designacao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Pesquisa */}
          <Input
            placeholder="Pesquisar..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* ---------- Ações ---------- */}

      {/* ---------- Tabela ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : horarios.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Horários encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Designação</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Disponibilidade</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {horarios.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.unidadecurricular}</TableCell>
                        <TableCell>{item.designacao}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.ano}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.estado.toLowerCase().includes("pendente") ||
                              item.estado.toLowerCase().includes("distribuição")
                                ? "secondary"
                                : "default"
                            }
                          >
                            {item.estado}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetails(item.codigo)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Ver Horário
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {horarios.length} de {total} registos
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
      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
    </div>
  );
}
