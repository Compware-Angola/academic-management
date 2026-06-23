import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Home, GraduationCap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySchedulesByDocente } from "@/hooks/horario/use-query-schedules-by-docente-service";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { formatReadableTimeInterval } from "@/util/format-readable-time-interval";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

// Converte ticks .NET → HH:mm
const formatTime = (ticks: string): string => {
  const totalSeconds = Number(ticks) / 10_000_000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default function TeacherSchedules() {
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    docenteId: "",
  });

  // Paginação (igual ao SchedulesByUC)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDocente, setOpenDocente] = useState(false);
  // Dados base
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const {
    data: teachersData = [],

    refetch,
    error,
  } = useQueryTeacther();
  // Chama a API real com paginação
  const { data: response, isLoading } = useQuerySchedulesByDocente(
    {
      docenteId: Number(filters.docenteId) || 0,
      anoLectivo: Number(filters.anoLetivo) || 0,
      semestre: Number(filters.semestre) || 0,
      periodo: Number(filters.periodo) || 0,
      page,
      limit,
    },
    {
      enabled:
        !!filters.docenteId &&
        !!filters.anoLetivo &&
        !!filters.semestre &&
        !!filters.periodo,
    }
  );

  const aulas = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const docenteNome = aulas.length > 0 ? aulas[0].docente_nome : "";

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
            <BreadcrumbPage>Por Docente</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <GraduationCap className="h-9 w-9 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Horários por Docente
          </h1>
          <p className="text-muted-foreground mt-1">
            Consulte todas as aulas de um professor com paginação.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select
                value={filters.anoLetivo}
                onValueChange={(v) => {
                  setFilters({ ...filters, anoLetivo: v });
                  setPage(1);
                }}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select
                value={filters.semestre}
                onValueChange={(v) => {
                  setFilters({ ...filters, semestre: v });
                  setPage(1);
                }}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) => {
                  setFilters({ ...filters, periodo: v });
                  setPage(1);
                }}
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
            <FormCommandSelect
              label="Docente"
              value={filters.docenteId}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => {
                setFilters({ ...filters, docenteId: codigo });
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Aulas do Docente
            {docenteNome && (
              <span className="text-lg font-normal text-muted-foreground ml-3">
                — {docenteNome}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando aulas...</p>
            </div>
          ) : aulas.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl">
                {!filters.docenteId
                  ? "Selecione um docente para ver as aulas."
                  : "Nenhuma aula encontrada com os filtros aplicados."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Desigação</TableHead>
                      <TableHead>Curso / Ano</TableHead>
                      <TableHead>Dia</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Modalidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aulas.map((aula) => (
                      <TableRow key={aula.codigo} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {aula.disciplina}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {aula.horario_nome}
                        </TableCell>
                        <TableCell>
                          {aula.curso} • {aula.ano}
                        </TableCell>
                        <TableCell>
                          {aula.dia_semana.replace("-Feira", "")}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatReadableTimeInterval(
                            aula.hora_inicio,
                            aula.hora_termino
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {aula.sala}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              aula.tipo_aula.includes("Teórica") ||
                              aula.tipo_aula.includes("Teorica")
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : aula.tipo_aula.includes("Prática")
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}
                          >
                            {aula.tipo_aula.replace("Teorica", "Teórica")}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {aula.modalidade}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação — EXATAMENTE como no SchedulesByUC */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {aulas.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
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
    </div>
  );
}
