// src/pages/SchedulesByUC.tsx
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
import { Link } from "react-router-dom";
import { useState } from "react";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { useQueryRegistrationBySchedule } from "@/hooks/horario/use-query-schedule-inscription";
import { RegistrationScheduleItem } from "@/services/horario/fetch-schedule-inscription.service";

type TableScheduleItem = {
  id: number;
  uc: string;
  turma: string;
  curso: string;
  unidadeCurricularId: number;
};

export default function SchedulesInscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "", // "all" = todos os anos
    unidadeCurricular: "", // UC selecionada
  });

  // === Dados base ===
  const { data: anosAcademicos, isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos, isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: loadingCursos } = useCursos();

  // Anos curriculares do curso
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  // Disciplinas (UCs)
  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe:
        filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });

  // Turmas da UC selecionada
  const canLoadTurmas =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.periodo &&
    !!filters.curso &&
    !!filters.unidadeCurricular;

  const { data: turmasResponse, isLoading: loadingTurmas } =
    useQueryRegistrationBySchedule(
      {
        anoLectivo: Number(filters.anoLetivo),
        //semestre: Number(filters.semestre),
        //periodo: Number(filters.periodo),
        //curso: Number(filters.curso),
        //unidadeCurricular: Number(filters.unidadeCurricular),
      },
      { enabled: canLoadTurmas }
    );

  // Detalhes para o modal
  // const { data: detalhesUc } = useQuerySchedulesByUc({
  //   anoLectivo: Number(filters.anoLetivo),
  //   semestre: Number(filters.semestre),
  //   periodo: Number(filters.periodo),
  //   curso: Number(filters.curso),
  //   unidadeCurricular: Number(filters.anoCurricular),
  // });

  const openDetails = (ucId: number) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tableData = turmasResponse?.data || [];

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
          <BreadcrumbItem>Horários</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Por Unidade Curricular</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lista de Inscrições por Horários
          </h1>
          <p className="text-muted-foreground mt-1">
            Consulte todas as turmas e horários completos por disciplina.
          </p>
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
                  <SelectValue
                    placeholder={loadingAnos ? "Carregando..." : "Selecionar"}
                  />
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
                    <SelectItem key={uc.codigo} value={uc.codigo.toString()}>
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
          <CardTitle>Inscrições Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTurmas ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando turmas...</p>
            </div>
          ) : tableData.length < 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                {canLoadTurmas
                  ? "Nenhuma turma encontrada com os filtros selecionados."
                  : "Preencha todos os filtros e selecione uma UC para ver as turmas."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Unidade Curricular</TableHead>
                    <TableHead>Designação</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Criado Por</TableHead>
                    <TableHead>Quantidade de Alunos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow
                      key={item.codigo}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {item.curso}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.ano}
                      </TableCell>
                      <TableCell>{item.unidadecurricular}</TableCell>
                      <TableCell>{item.designacao}</TableCell>
                      <TableCell>{item.capacidade}</TableCell>
                      <TableCell>{item.semestre}</TableCell>
                      <TableCell>{item.estado}</TableCell>
                      <TableCell>{item.criadopor}</TableCell>
                      <TableCell>{item.total_alunos}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {}}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Horário
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal com calendário semanal */}
      {/*
      <ScheduleDetailsModal
        items={
          detalhesUc?.data.map((t) => ({
            id: t.codigo,
            uc: t.unidadecurricular,
            codigo: t.designacao,
            curso: t.curso,
            turma: t.designacao,
            docente: "",
            sala: "",
            dia: "Segunda",
            horario: "08:00–10:00",
            tipo: "Teórica",
          })) || []
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      /> */}
    </div>
  );
}
