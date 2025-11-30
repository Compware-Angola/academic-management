import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  Search,
  File,
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
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";

export default function ScheduleList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    search: "",
  });

  // Queries dos filtros
  const { data: anosAcademicos, isLoading: loadingAnos } = useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos, isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: loadingCursos } = useCursos();

  // Query principal - lista de turmas criadas
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
  });

  // Filtro local por texto (turma, UC, curso...)
  const filteredHorarios = horarios.filter((h) =>
    filters.search === "" ||
    h.designacao.toLowerCase().includes(filters.search.toLowerCase()) ||
    h.unidadeCurricular.toLowerCase().includes(filters.search.toLowerCase()) ||
    h.curso.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
    toast({ description: "Lista atualizada com sucesso." });
  };

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
                <BreadcrumbPage>Listar Horários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Turmas Criadas
          </h1>
          <p className="text-muted-foreground">
            Visualize todas as turmas já criadas para o ano, semestre, período e curso selecionados.
          </p>
        </div>
        <Button onClick={() => navigate("/horarios/criar")}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Nova Turma
        </Button>
      </div>

      {/* Filtros */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ano Letivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano Letivo</label>
            <Select
              value={filters.anoLetivo}
              onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
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
              onValueChange={(v) => setFilters({ ...filters, curso: v })}
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
        </div>

        {/* Pesquisa geral */}
        <div className="mt-6">
          <Input
            placeholder="Pesquisar por turma, UC ou curso..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Botão Atualizar */}
      <div className="flex gap-3">
        <Button onClick={handleRefresh} variant="outline" disabled={isLoadingHorarios}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingHorarios ? "animate-spin" : ""}`} />
          Atualizar Lista
        </Button>
      </div>

      {/* Tabela de Resultados */}
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
              Erro ao carregar turmas. Tente novamente.
            </AlertDescription>
          </Alert>
        ) : filteredHorarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <File className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma turma encontrada</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {filters.anoLetivo && filters.semestre && filters.periodo && filters.curso
                ? "Não existem turmas criadas com os filtros aplicados."
                : "Selecione todos os filtros para ver as turmas criadas."}
            </p>
            <Button onClick={() => navigate("/horarios/criar")}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Turma
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Turma</TableHead>
                  <TableHead>Unidade Curricular</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Disponibilidade</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHorarios.map((h) => (
                  <TableRow key={h.codigo} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-primary">
                      {h.designacao}
                    </TableCell>
                    <TableCell>{h.unidadeCurricular}</TableCell>
                    <TableCell>{h.curso}</TableCell>
                    <TableCell>{h.ano}</TableCell>
                    <TableCell>{h.capacidade}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          h.estado.includes("Pendente") || h.estado.includes("Distri")
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
        )}
      </div>
    </div>
  );
}