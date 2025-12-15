// src/pages/horarios/ScheduleList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, MoreVertical, RotateCcw } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";

import { useQueryHorariosEliminados } from "@/hooks/horario/use-query-horarios-existentes-eliminados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

import { useRestaurarHorario } from "@/hooks/horario/use-restaurar-horario";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
export default function ScheduleListEliminated() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    classes: "",
    unidadeCurricular: "",
    search: "",
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
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: anosCurriculares = [], isLoading: loadingAnosCurriculares } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.classes,
      curso: filters.curso,
      semestre: filters.semestre,
    });
  const { data, isLoading, error, refetch } = useQueryHorariosEliminados({
    anoLectivo: Number(filters.anoLectivo),

    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    periodo: filters.periodo ? Number(filters.periodo) : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    unidadeCurricular: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : undefined,
    classe: filters.classes ? Number(filters.classes) : undefined,

    search: filters.search || undefined,

    page,
    limit,
  });

  const { mutate: restaurarHorario } = useRestaurarHorario();
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
          <FormSelect
            label="Ano Letivo"
            value={filters.anoLectivo}
            loading={loadingAnos}
            onChange={(v) =>
              setFilters({
                anoLectivo: v,
                semestre: "",
                curso: "",
                anoCurricular: "",
                classes: "",
                unidadeCurricular: "",
                search: "",
                periodo: "",
              })
            }
            options={anosAcademicos}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            label="Semestre"
            value={filters.semestre}
            disabled={!filters.anoLectivo}
            loading={loadingSemestres}
            onChange={(v) =>
              setFilters({
                ...filters,
                semestre: v,
                classes: "",
                unidadeCurricular: "",
              })
            }
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <FormSelect
            label="Curso"
            value={filters.curso}
            disabled={!filters.anoLectivo}
            loading={loadingCursos}
            onChange={(v) =>
              setFilters({
                ...filters,
                curso: v,
                anoCurricular: "",
                classes: "",
                unidadeCurricular: "",
              })
            }
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />

          <FormSelect
            label="Ano Curricular"
            value={filters.anoCurricular}
            disabled={!filters.curso}
            loading={loadingAnosCurriculares}
            onChange={(v) =>
              setFilters({
                ...filters,
                anoCurricular: v,
                classes: "",
                unidadeCurricular: "",
              })
            }
            options={anosCurriculares}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />
          <FormSelect
            label="Classe"
            value={filters.classes}
            disabled={!filters.curso || !filters.anoCurricular}
            loading={isLoadingClasses}
            onChange={(v) =>
              setFilters({
                ...filters,
                classes: v,
                unidadeCurricular: "",
              })
            }
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />
          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={!filters.curso || !filters.semestre || !filters.classes}
            loading={isLoadingUC}
            onChange={(v) =>
              setFilters({
                ...filters,
                unidadeCurricular: v,
              })
            }
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.pk,
              label: u.descricao,
              value: u.pk,
            })}
          />

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
                            className="cursor-pointer"
                            title="Ver detalhes"
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(item.codigo)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            className="cursor-pointer"
                            title="Restaurar"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              restaurarHorario({
                                codigo: item.codigo,
                              })
                            }
                          >
                            <RotateCcw className="h-4 w-4" />
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
