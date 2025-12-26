// src/pages/SchedulesByUC.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Home, Search, BookOpen, Eye, Loader2 } from "lucide-react";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import ScheduleDetailsModal from "@/pages/schedules/components/ScheduleDetailsModal";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryMarkingAssessment } from "@/hooks/avaliacao/use-query-marking-assessment";
import { formatarData } from "@/util/date-formate";
import { formatMillisecondsToHoursMinutes } from "@/util/format-hour";
import { parseFilter } from "@/util/parse-filter";
import { convertGuards } from "./convertGuards";
import MarkingDetailsGuardModal from "../components/MarkingDetailsGuardModal";

export default function MarkingAssessment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guards, setGuards] = useState<string[]>([]);

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "all",
    curso: "",
    anoCurricular: "all",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    tipoHorario: "",
  });

  // paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // === Dados base ===
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const { data: cursos } = useCursos();

  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const canLoadTurmas =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.curso &&
    !!filters.tipoAvaliacao &&
    !!filters.tipoHorario;

  const { data: markingResponse, isLoading: loadingTurmas } =
    useQueryMarkingAssessment(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: parseFilter(filters.periodo),
        curso: Number(filters.curso),
        tipoAvaliacao: Number(filters.tipoAvaliacao),
        tipoHorario: Number(filters.tipoHorario),
        anoCurricular: parseFilter(filters.anoCurricular),
        page,
        limit,
      },
      { enabled: canLoadTurmas }
    );

  const openDetails = (item: string | null) => {
    setGuards(convertGuards(item));
    setIsModalOpen(true);
  };

  const tableData = markingResponse?.data || [];
  const total = markingResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
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
          <BreadcrumbItem>Marcação</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Controle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Marcação de Prova</h1>
          <p className="text-muted-foreground">Controle de Nota</p>
        </div>
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
            {/* Ano Letivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select
                value={filters.anoLetivo}
                onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos?.map((a) => (
                    <SelectItem key={a.codigo} value={a.codigo.toString()}>
                      {a.designacao}
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
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    semestre: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os Períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Períodos</SelectItem>
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
            <FormSelect
              label="Tipo de Avaliação"
              value={filters.tipoAvaliacao}
              onChange={(v) => setFilters({ ...filters, tipoAvaliacao: v })}
              options={tipoAvaliacao}
              loading={isLoadingTipoAvaliacao}
              disabled={isLoadingTipoAvaliacao}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Situação das Provas</label>
              <Select
                value={filters.tipoHorario}
                onValueChange={(v) =>
                  setFilters({ ...filters, tipoHorario: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Com Provas Marcadas</SelectItem>
                  <SelectItem value="2">Sem Provas Marcadas</SelectItem>
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
          {loadingTurmas ? (
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
                      <TableHead>Curso</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Data da Prova</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Hora da Prova</TableHead>
                      <TableHead>Hora de Término</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigoprova}>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.anolectivo}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell>{item.horario}</TableCell>
                        <TableCell>{item.periodo}</TableCell>
                        <TableCell>{item.tb_salas_designacao}</TableCell>
                        <TableCell>
                          {formatarData(item.tcp_data_prova)}
                        </TableCell>
                        <TableCell>{item.duracaoprova}</TableCell>
                        <TableCell>{item.tcp_hora_prova}</TableCell>
                        <TableCell>{item.horatermino}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetails(item.vigilantes)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> Ver Vigentes
                            </Button>
                          </div>
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
      <MarkingDetailsGuardModal
        item={guards}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
    </div>
  );
}
