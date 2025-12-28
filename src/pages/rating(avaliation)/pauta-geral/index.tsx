import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import {
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { usePautasGeral } from "@/hooks/avaliacao/use-quert-pautas-geral";
import { useTeamOldRules, useTeamOldRulesTurmas } from "@/hooks/team-Old-rules";

export default function PautaGeral() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [filters, setFilters] = useState({
    curso: "",
    anoLetivo: "",
    semestre: "",
    classes: "",
    periodo: "",
    unidadeCurricular: "",
    horarioId: "",
    turma: "",
  });

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.classes,
      curso: filters.curso,
      semestre: filters.semestre,
    });
  const canLoadTurmas =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.periodo &&
    !!filters.curso &&
    !!filters.unidadeCurricular;

  const { data: scheduleResponse, isLoading: loadingschedule } =
    useQuerySchedulesByUc(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: Number(filters.periodo),
        curso: Number(filters.curso),
        unidadeCurricular: Number(filters.unidadeCurricular),
      },
      { enabled: canLoadTurmas }
    );

  const { data: turmas = [], isLoading: isLoadingTurma } =
    useTeamOldRulesTurmas({
      anoLectivo: filters.anoLetivo,
      classe: filters.classes,
      curso: filters.curso,
      periodo: filters.periodo,
    });
  const { data: ucBYTurma = [], isLoading: isLoadingUcBYTurma } =
    useTeamOldRules({
      anoLectivo: filters.anoLetivo,
      semestre: filters.semestre,
      turma: filters.turma,
    });
  console.log({ ucBYTurma });
  useEffect(() => {
    if (academicYear.length > 0) {
      const activeYear = academicYear.find((a) =>
        a.estado.toLowerCase().startsWith("activ")
      );
    }
  }, [academicYear]);
  const { data: pautaGeral = [], isLoading: isLoadingPautaGeral } =
    usePautasGeral(
      {
        gradeCurricular: filters.unidadeCurricular,
        horario: filters.horarioId,
        semestre: filters.semestre,
        anoLectivo: filters.anoLetivo,
      },
      shouldFetch
    );
  const isAcademicYearAfter2021 = useMemo(() => {
    if (!filters.anoLetivo || !academicYear?.length) return false;

    const year = academicYear.find(
      (a) => a.codigo.toString() === filters.anoLetivo
    );

    if (!year) return false;

    const [startYear] = year.designacao.split("-");
    return Number(startYear) > 2021;
  }, [academicYear, filters.anoLetivo]);
  const handleSearch = async () => {
    // Validar campos obrigatórios
    if (!filters.anoLetivo || !filters.semestre) {
      toast({
        title: "Campos obrigatórios",
        description:
          "Por favor, preencha ano lectivo, grade curricular e semestre.",
        variant: "destructive",
      });
      return;
    }

    setShouldFetch(true);

    // Simular chamada à API
    // Em produção: const response = await fetch(`/api/assessment/pautas-geral?anoLectivo=${filters.anoLectivo}&gradeCurricular=${filters.gradeCurricular}&horario=${filters.horario}&semestre=${filters.semestre}&turma=${filters.turma}&gradeCurricularTurma=${filters.gradeCurricularTurma}`);
  };

  const getResultadoBadge = (resultado: string) => {
    if (resultado === "Aprovado") {
      return (
        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
          Aprovado
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
        Reprovado
      </Badge>
    );
  };

  const totalPages = Math.ceil(pautaGeral.length / itemsPerPage);
  const paginatedPautas = pautaGeral.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Pauta Geral</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pauta Geral</h1>
          <p className="text-muted-foreground mt-1">
            Consulte as pautas de avaliação dos estudantes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={filters.anoLetivo}
            onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            disabled={
              isLoadingPeriodos ||
              isLoadingAcademicYear ||
              filters.anoLetivo === ""
            }
            loading={isLoadingPeriodos}
            label="Período"
            value={filters.periodo}
            onChange={(v) => setFilters({ ...filters, periodo: v })}
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
              value: p.codigo,
            })}
          />

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
          <FormSelect
            disabled={isLoadingCurso}
            loading={isLoadingCurso}
            label="Curso"
            value={filters.curso}
            onChange={(v) => setFilters({ ...filters, curso: v })}
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />
          <FormSelect
            label="Ano Curricular"
            value={filters.classes}
            disabled={isLoadingClasses || !filters.curso}
            onChange={(v) => setFilters({ ...filters, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={isLoadingClasses}
          />
          {isAcademicYearAfter2021 && (
            <FormSelect
              label="Unidade Curricular"
              value={filters.unidadeCurricular}
              disabled={
                isLoadingUC ||
                !filters.semestre ||
                !filters.curso ||
                !filters.classes
              }
              onChange={(v) => setFilters({ ...filters, unidadeCurricular: v })}
              options={unidadesCurriculares}
              map={(u) => ({
                key: u.codigo,
                label: u.descricao,
                value: u.pk,
              })}
              loading={isLoadingUC}
            />
          )}

          {isAcademicYearAfter2021 && (
            <FormSelect
              label="Horario"
              value={filters.horarioId}
              disabled={
                loadingschedule || !filters.semestre || !filters.classes
              }
              onChange={(v) => setFilters({ ...filters, horarioId: v })}
              options={scheduleResponse?.data}
              map={(u) => ({
                key: u.codigo,
                value: u.codigo,
                label: `${u.designacao}`,
              })}
              loading={loadingschedule}
            />
          )}
          {!isAcademicYearAfter2021 && (
            <FormSelect
              label="Turma"
              value={filters.turma}
              disabled={isLoadingTurma || !filters.semestre || !filters.classes}
              onChange={(v) => setFilters({ ...filters, turma: v })}
              options={turmas}
              map={(u) => ({
                key: u.codigo.toString(),
                value: u.codigo.toString(),
                label: `${u.designacao}`,
              })}
              loading={loadingschedule}
            />
          )}

          {!isAcademicYearAfter2021 && (
            <FormSelect
              label=" Unidade curricular"
              value={filters.unidadeCurricular}
              disabled={
                isLoadingUcBYTurma || !filters.semestre || !filters.classes
              }
              onChange={(v) => setFilters({ ...filters, unidadeCurricular: v })}
              options={ucBYTurma}
              map={(u) => ({
                key: u.grade_curricular,
                value: u.grade_curricular.toString(),
                label: `${u.unidade_curricular}`,
              })}
              loading={isLoadingUcBYTurma}
            />
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoadingPautaGeral ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Tabela de resultados */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {isLoadingPautaGeral ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : pautaGeral.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>UC</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead className="text-center">1ª Freq</TableHead>
                    <TableHead className="text-center">2ª Freq</TableHead>
                    <TableHead className="text-center">Exame</TableHead>
                    <TableHead className="text-center">Recurso</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead className="text-center">Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPautas.map((pauta) => (
                    <TableRow key={pauta.codigoGradeAluno}>
                      <TableCell className="font-medium">
                        {pauta.num_matricula}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={pauta.nome_completo}
                      >
                        {pauta.nome_completo}
                      </TableCell>
                      <TableCell>{pauta.unidadeCurricular}</TableCell>
                      <TableCell>{pauta.ano}</TableCell>
                      <TableCell className="text-center">
                        {pauta.nota1f || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {pauta.nota2f || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {pauta.notaEx || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {pauta.notaRec || "-"}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {pauta.media}
                      </TableCell>
                      <TableCell>
                        {getResultadoBadge(pauta.resultado)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {pauta.obs.length > 0 ? (
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Info className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>
                                Detalhes - {pauta.nome_completo}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-sm mb-2">
                                  Fórmula de Cálculo
                                </h4>
                                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                                  {pauta.formula.map((f, i) => (
                                    <p key={i} className="text-sm">
                                      {f}
                                    </p>
                                  ))}
                                </div>
                              </div>

                              {pauta.obs.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 text-amber-600">
                                    Observações
                                  </h4>
                                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 space-y-1">
                                    {pauta.obs.map((o, i) => (
                                      <p
                                        key={i}
                                        className="text-sm text-amber-800 dark:text-amber-200"
                                      >
                                        {o}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Semestre:
                                  </span>
                                  <span className="ml-2">{pauta.semestre}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Duração:
                                  </span>
                                  <span className="ml-2">{pauta.duracao}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Nota Prática:
                                  </span>
                                  <span className="ml-2">
                                    {pauta.notaPra || "-"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Nota Oral:
                                  </span>
                                  <span className="ml-2">
                                    {pauta.notaOr || "-"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Nota Melhoria:
                                  </span>
                                  <span className="ml-2">
                                    {pauta.notaMel || "-"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Nota EE:
                                  </span>
                                  <span className="ml-2">
                                    {pauta.notaEE || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm">
                  Itens por página:
                </Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger id="items-per-page" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground ml-4">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, pautaGeral.length)} de{" "}
                  {pautaGeral.length} registos
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
