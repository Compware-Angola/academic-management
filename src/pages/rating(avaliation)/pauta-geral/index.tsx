import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

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
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { usePautasGeral } from "@/hooks/avaliacao/use-quert-pautas-geral";
import { useTeamOldRules, useTeamOldRulesTurmas } from "@/hooks/team-Old-rules";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

type Filters = {
  anoLetivo: string;
  periodo: string;
  semestre: string;
  curso: string;
  classes: string;
  unidadeCurricular: string;
  horarioId: string;
  turma: string;
  gradeCurricularTurma: string;
};

export default function PautaGeral() {
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    anoLetivo: "",
    periodo: "",
    semestre: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    horarioId: "",
    turma: "",
    gradeCurricularTurma: "",
  });

  useEffect(() => {
    setShouldFetch(false);
    setCurrentPage(1); // 🔥 reset página ao mudar filtros
  }, [filters]);

  /** ================== QUERIES BASE ================== */
  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();
  const { data: periodos = [], isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: semestres = [], isLoading: loadingSemestres } =
    useQuerySemestres();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();

  const { data: classes = [], isLoading: loadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });

  const { data: unidadesCurriculares = [], isLoading: loadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.classes,
      curso: filters.curso,
      semestre: filters.semestre,
    });

  /** ================== REGRA DO ANO ================== */
  const academicYearInfo = useMemo(() => {
    return academicYear.find((a) => a.codigo.toString() === filters.anoLetivo);
  }, [academicYear, filters.anoLetivo]);

  const isNewAcademicFlow = useMemo(() => {
    if (!academicYearInfo) return false;
    const [startYear] = academicYearInfo.designacao.split("-");
    return Number(startYear) > 2021;
  }, [academicYearInfo]);

  /** ================== FLUXO NOVO (> 2021) ================== */
  const { data: schedules, isLoading: loadingSchedules } = useScheduleQuery({
    anoLectivo: Number(filters.anoLetivo),
    semestre: Number(filters.semestre),
    periodo: Number(filters.periodo),
    curso: Number(filters.curso),
    unidadeCurricular: Number(filters.unidadeCurricular),
  });

  /** ================== FLUXO ANTIGO (<= 2021) ================== */
  const { data: turmas = [], isLoading: loadingTurmas } =
    useTeamOldRulesTurmas({
      anoLectivo: filters.anoLetivo,
      classe: filters.classes,
      curso: filters.curso,
      periodo: filters.periodo,
    });

  const { data: ucByTurma = [], isLoading: loadingUcTurma } =
    useTeamOldRules({
      anoLectivo: filters.anoLetivo,
      semestre: filters.semestre,
      turma: filters.turma,
    });

  /** ================== BUSCA FINAL ================== */
  const { data: pautaResponse, isLoading: loadingPauta } = usePautasGeral(
    {
      gradeCurricular: filters.unidadeCurricular,
      horario: filters.horarioId,
      semestre: filters.semestre,
      anoLectivo: filters.anoLetivo,
      turma: filters.turma,
      gradeCurricularTurma: filters.gradeCurricularTurma,
      page: currentPage,          // 🔥 backend pagination
      limit: itemsPerPage,        // 🔥 backend pagination
    },
    shouldFetch
  );

  const pautaGeral = pautaResponse?.data ?? [];
  const totalPages = pautaResponse?.totalPages ?? 1;
  const total = pautaResponse?.total ?? 0;

  const pdfData = useMemo(() => {
  if (!pautaGeral.length) return null;

  const rows = pautaGeral.map((p) => ({
    matricula: p.num_matricula,
    nome: p.nome_completo,
    uc: p.unidadeCurricular,
    ano: p.ano,
    freq1: p.nota1f ?? "-",
    freq2: p.nota2f ?? "-",
    exame: p.notaEx ?? "-",
    recurso: p.notaRec ?? "-",
    media: p.media,
    resultado: p.resultado,
  }));

  const anoLetivoNome =
    academicYear.find((a) => a.codigo.toString() === filters.anoLetivo)
      ?.designacao || "—";

  const semestreNome =
    semestres.find((s) => s.codigo.toString() === filters.semestre)
      ?.designacao || "—";

  const cursoNome =
    cursos.find((c) => c.codigo.toString() === filters.curso)
      ?.designacao || "—";

  return {
    filtros: [
      `Ano Letivo: ${anoLetivoNome}`,
      `Semestre: ${semestreNome}`,
      `Curso: ${cursoNome}`,
    ].join("  |  "),
    total: pautaGeral.length,
    rows,
  };
}, [pautaGeral, filters, academicYear, semestres, cursos]);

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Pauta Geral"
    subtitle="Resultados finais de avaliação académica"
    infoSections={[
      {
        title: "Filtros Aplicados",
        content: pdfData.filtros,
      },
      {
        title: "Resumo",
        content: [`Total de estudantes: ${pdfData.total}`],
      },
    ]}
    mainTable={{
      headers: [
        { key: "matricula", label: "Matrícula", width: "10%" },
        { key: "nome", label: "Nome", width: "20%" },
        { key: "uc", label: "UC", width: "18%" },
        { key: "ano", label: "Ano", width: "6%", align: "center" },
        { key: "freq1", label: "1ª Freq", width: "6%", align: "center" },
        { key: "freq2", label: "2ª Freq", width: "6%", align: "center" },
        { key: "exame", label: "Exame", width: "6%", align: "center" },
        { key: "recurso", label: "Recurso", width: "7%", align: "center" },
        { key: "media", label: "Média", width: "6%", align: "center" },
        { key: "resultado", label: "Resultado", width: "15%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento oficial para consulta académica."
    customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
  />
) : null;


  const handleSearch = () => {
    if (!filters.anoLetivo || !filters.semestre) {
      toast({
        title: "Campos obrigatórios",
        description: "Ano lectivo e semestre são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (
      isNewAcademicFlow &&
      (!filters.unidadeCurricular || !filters.horarioId)
    ) {
      toast({
        title: "Filtros incompletos",
        description: "Selecione unidade curricular e horário.",
        variant: "destructive",
      });
      return;
    }

    if (
      !isNewAcademicFlow &&
      (!filters.turma || !filters.gradeCurricularTurma)
    ) {
      toast({
        title: "Filtros incompletos",
        description: "Selecione turma e unidade curricular.",
        variant: "destructive",
      });
      return;
    }

    setShouldFetch(true);
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

                   {/* 👉 AQUI FICAM OS BOTÕES DE EXPORTAR / IMPRIMIR */}
          {pautaGeral.length > 0 && pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`Pauta_Geral_${filters.anoLetivo}_${filters.semestre}_${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`}
              showDownload
              showPrint
            />
          )}

      </div>

      {/* Filtros */}
     {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            disabled={loadingYear}
            loading={loadingYear}
            label="Ano Letivo"
            value={filters.anoLetivo}
            onChange={(v) =>
              setFilters({ ...filters, anoLetivo: v, horarioId: "" })
            }
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            disabled={
              loadingPeriodos || loadingYear || filters.anoLetivo === ""
            }
            loading={loadingPeriodos}
            label="Período"
            value={filters.periodo}
            onChange={(v) =>
              setFilters({ ...filters, periodo: v, horarioId: "" })
            }
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
              value: p.codigo,
            })}
          />

          <FormSelect
            disabled={loadingSemestres}
            loading={loadingSemestres}
            label="Semestre"
            value={filters.semestre}
            onChange={(v) =>
              setFilters({ ...filters, semestre: v, horarioId: "" })
            }
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />


            <CourseSelect
              value={filters.curso}
              onChangeValue={(v) =>
                setFilters({
                  ...filters,
                  curso: v,
                  horarioId: "",
                })
              }
            />

          <FormSelect
            label="Ano Curricular"
            value={filters.classes}
            disabled={loadingClasses || !filters.curso}
            onChange={(v) => setFilters({ ...filters, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={loadingClasses}
          />
          {isNewAcademicFlow && (
            <FormSelect
              label="Unidade Curricular"
              value={filters.unidadeCurricular}
              disabled={
                loadingUC ||
                !filters.semestre ||
                !filters.curso ||
                !filters.classes
              }
              onChange={(v) =>
                setFilters({ ...filters, unidadeCurricular: v, horarioId: "" })
              }
              options={unidadesCurriculares}
              map={(u) => ({
                key: u.codigo,
                label: u.descricao,
                value: u.pk,
              })}
              loading={loadingUC}
            />
          )}

          {isNewAcademicFlow && (
            <FormSelect
              label="Horario"
              value={filters.horarioId}
              disabled={loadingSchedules}
              onChange={(v) => setFilters({ ...filters, horarioId: v })}
              options={schedules?.data}
              map={(u) => ({
                key: u.codigo,
                value: u.codigo,
                label: `${u.designacao}`,
              })}
              loading={loadingSchedules}
            />
          )}
          {!isNewAcademicFlow && (
            <FormSelect
              label="Turma"
              value={filters.turma}
              disabled={loadingTurmas || !filters.semestre || !filters.classes}
              onChange={(v) =>
                setFilters({ ...filters, turma: v, gradeCurricularTurma: "" })
              }
              options={turmas}
              map={(u) => ({
                key: u.codigo.toString(),
                value: u.codigo.toString(),
                label: `${u.designacao}`,
              })}
              loading={loadingUcTurma}
            />
          )}

          {!isNewAcademicFlow && (
            <FormSelect
              label=" Unidade curricular"
              value={filters.gradeCurricularTurma}
              disabled={loadingUcTurma || !filters.semestre || !filters.classes}
              onChange={(v) =>
                setFilters({ ...filters, gradeCurricularTurma: v })
              }
              options={ucByTurma}
              map={(u) => ({
                key: u.grade_curricular,
                value: u.grade_curricular.toString(),
                label: `${u.unidade_curricular}`,
              })}
              loading={loadingUcTurma}
            />
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSearch} disabled={loadingPauta}>
            {loadingPauta ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {loadingPauta ? (
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
                  {pautaGeral.map((pauta) => (
                    <TableRow key={pauta.codigoGradeAluno}>
                      {/* 👇 mantém teu row igual */}
                      <TableCell className="font-medium">
                        {pauta.num_matricula}
                      </TableCell>
                      <TableCell>{pauta.nome_completo}</TableCell>
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

            {/* Paginação (backend) */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, total)} de {total} registos
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
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
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
