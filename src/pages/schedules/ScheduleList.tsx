// src/pages/SchedulesByUC.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Home, Search, BookOpen, Eye, Loader2, Plus } from "lucide-react";

import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { FormSelect } from "@/components/common/FormSelect";

export default function ScheduleList() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });

  // paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // === Dados base ===
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const { data: cursos } = useCursos();

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe:
        filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });

  const { data: ScheduleResponse, isLoading: isLoadingSchedule } =
    useScheduleQuery({
      anoLectivo: Number(filters.anoLetivo),
      semestre: Number(filters.semestre),
      periodo: Number(filters.periodo),
      curso: Number(filters.curso),
      unidadeCurricular: Number(filters.unidadeCurricular),
      page,
      limit,
    });

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const tableData = ScheduleResponse?.data || [];
  const total = ScheduleResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
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
            Horário Existentes
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os Horário criadas por ano letivo, semestre,
            período, curso e ano curricular.
          </p>
        </div>
        <Button onClick={() => navigate("/horarios/criar")}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Horário
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <FormSelect
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              label="Ano Letivo"
              value={filters.anoLetivo}
              onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              options={anosAcademicos}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />

            {/* Semestre */}
            <FormSelect
              disabled={isLoadingSemestres}
              loading={isLoadingSemestres}
              label="Semestre"
              value={filters.semestre}
              onChange={(v) => setFilters({ ...filters, semestre: v })}
              options={semestres}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
            />
            {/* Período */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) => setFilters({ ...filters, periodo: v })}
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
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "all",
                    unidadeCurricular: "",
                  })
                }
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
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    anoCurricular: v,
                    unidadeCurricular: "",
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filters.curso ? "Todos os anos" : "Selecione curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Unidade Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.curso
                        ? "Selecione curso"
                        : !filters.semestre
                        ? "Selecione semestre"
                        : isLoadingUC
                        ? "Carregando UCs..."
                        : "Selecionar UC"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {unidadesCurriculares.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : tableData.length === 0 ? (
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
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.unidadecurricular}</TableCell>
                        <TableCell>{item.designacao}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.ano}</TableCell>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
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
