import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Save,
  ChevronLeft,
  ChevronRight,
  Unlock,
  Lock,
  Search,
  LockOpen,
  SendHorizonal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryNoteReleases } from "@/hooks/avaliacao/use-query-note-release";
import { useUpsertNote } from "@/hooks/avaliacao/use-mutation-upsert-note";
import { NoteUpsertPayload } from "@/services/update-or-create-note-release";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useAuth } from "@/hooks/use-auth";
import { FormSelectIsaac } from "@/components/common/FormSelectIsaac";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { useQueryGradesCreationPrompt } from "@/hooks/academiccalendar/use-query-grades-creation-prompt";
import { parseFilter } from "@/util/parse-filter";
import { TipoLancamentoPrazoMap } from "@/constants/tipo-avalicao";
import { useQueryPromptGetPermissionLaunch } from "@/hooks/avaliacao/use-query-prompt-get-permission-launch";
import { GetAssessmentNotasItem } from "@/services/avaliacao/prompt-get-permission-launch.service";

export default function LaunchNotes() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    unidadeCurricular: "",
    horarioId: "",
    classes: "",
    tipoAvaliacao: "",
    tipoProva: "",
    search: "",
  });

  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

  const {
    data: students = [],
    isLoading: loadingNoteRelease,
    isRefetching,
    refetch,
  } = useQueryNoteReleases({
    anoLectivoId: Number(formData.anoLetivo),
    horarioId: Number(formData.horarioId),
    tipoProvaId: Number(formData.tipoProva),
    tipoAvaliacao: Number(formData.tipoAvaliacao),
    classe: Number(formData.classes),
    turno: Number(formData.periodo),
    search: formData.search,
  });

  const [localStudents, setLocalStudents] = useState(students);
  const [lockedStudents, setLockedStudents] = useState<{
    [key: number]: boolean;
  }>({});

  const { data: semestres, isLoading: isLoadingSemestres } = useQuerySemestres();
  const { user: userData } = useAuth();
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: cursos } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } = useQueryTipoProva();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  // Rota única — recebe sempre NoteUpsertPayload[]
  const upsertNoteMutation = useUpsertNote();

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: formData.classes,
      curso: formData.curso,
      semestre: formData.semestre,
    });

  const canLoadTurmas =
    !!formData.anoLetivo &&
    !!formData.semestre &&
    !!formData.periodo &&
    !!formData.curso &&
    !!formData.unidadeCurricular;

  const { data: scheduleResponse, isLoading: loadingschedule } =
    useQuerySchedulesByUc(
      {
        anoLectivo: Number(formData.anoLetivo),
        semestre: Number(formData.semestre),
        periodo: Number(formData.periodo),
        curso: Number(formData.curso),
        unidadeCurricular: Number(formData.unidadeCurricular),
      },
      { enabled: canLoadTurmas },
    );

  const { data: gradesPrompt, isLoading: isLoadingGradesPrompt } =
    useQueryGradesCreationPrompt({
      anoLectivo: parseFilter(formData.anoLetivo),
      semestre: parseFilter(formData.semestre),
      typeAvaliation: TipoLancamentoPrazoMap[parseFilter(formData.tipoAvaliacao)],
    });

  const { data: promptPermissionLaunch, isLoading: isLoadingPromptPermissionLaunch } =
    useQueryPromptGetPermissionLaunch({
      anoLectivo: parseFilter(formData.anoLetivo),
      grade: parseFilter(formData.unidadeCurricular),
      tipoAvaliacao: parseFilter(formData.tipoAvaliacao),
      utilizadorId: userData?.user?.pk_utilizador,
    });

  useEffect(() => {
    setLocalStudents(students);
    const initialLocks: { [key: number]: boolean } = {};
    students.forEach((s) => {
      initialLocks[s.codigo_grade_aluno] = true;
    });
    setLockedStudents(initialLocks);
  }, [students]);

  // ─── Helpers de lock ──────────────────────────────────────────────────────
  const handleUnlockAll = () => {
    const map: { [key: number]: boolean } = {};
    localStudents.forEach((s) => { map[s.codigo_grade_aluno] = false; });
    setLockedStudents(map);
  };

  const handleLockAll = () => {
    const map: { [key: number]: boolean } = {};
    localStudents.forEach((s) => { map[s.codigo_grade_aluno] = true; });
    setLockedStudents(map);
  };

  const toggleLock = (id: number) => {
    setLockedStudents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allUnlocked =
    localStudents.length > 0 &&
    localStudents.every((s) => lockedStudents[s.codigo_grade_aluno] === false);

  // ─── Monta um item do payload ─────────────────────────────────────────────
  const buildPayloadItem = (student: any): NoteUpsertPayload => ({
    gradeCurricularAluno: student.codigo_grade_aluno,
    utilizador: userData?.user?.pk_utilizador || 0,
    nota: Number(student.nota),
    tipoDeProva: Number(formData.tipoProva),
    epoca: 2,
    tipoAvaliacao: Number(formData.tipoAvaliacao),
    observacao: student.observacao || null,
    status: 2,
    notaAnterior: student.notaFinalAnterior || 0,
    codigo_grade_avaliacao_aluno: student.codigo_grade_avaliacao_aluno || undefined,
  });

  // ─── Lançar individual → array com 1 posição ─────────────────────────────
  const handleSaveIndividual = (student: any) => {
    if (student.nota === null || student.nota === undefined) {
      toast({ title: "Erro", description: "Insira uma nota primeiro", variant: "destructive" });
      return;
    }
    if (Number(student.nota) < 0 || Number(student.nota) > 20) {
      toast({ title: "Erro", description: "A nota deve estar entre 0 e 20", variant: "destructive" });
      return;
    }

    // Array com 1 posição — mesma rota do lançamento em massa
    const payloads: NoteUpsertPayload[] = [buildPayloadItem(student)];

    upsertNoteMutation.mutate(payloads as any, {
      onSuccess: () => {
        toggleLock(student.codigo_grade_aluno);
        toast({
          title: student.nota !== null ? "Nota atualizada" : "Nota lançada",
          description: `${student.nome_completo} → ${student.nota} valores`,
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Não foi possível lançar/atualizar a nota.",
          variant: "destructive",
        });
      },
    });
  };

  // ─── Lançar todos → array com N posições ─────────────────────────────────
  const handleSaveAllStudents = () => {
    const studentsWithNota = localStudents.filter(
      (s) =>
        s.nota !== null &&
        s.nota !== undefined &&
        Number(s.nota) >= 0 &&
        Number(s.nota) <= 20,
    );

    if (studentsWithNota.length === 0) {
      toast({
        title: "Nenhuma nota para lançar",
        description: "Insira notas válidas (0–20) antes de lançar em massa.",
        variant: "destructive",
      });
      return;
    }

    // Array com N posições — mesma rota do lançamento individual
    const payloads: NoteUpsertPayload[] = studentsWithNota.map(buildPayloadItem);

    setIsSavingAll(true);

    upsertNoteMutation.mutate(payloads as any, {
      onSuccess: () => {
        setIsSavingAll(false);
        handleLockAll();
        toast({
          title: "Lançamento em massa concluído",
          description: `${payloads.length} nota(s) lançada(s) com sucesso.`,
        });
      },
      onError: () => {
        setIsSavingAll(false);
        toast({
          title: "Erro no lançamento em massa",
          description: "Não foi possível lançar as notas. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  // ─── Period / permission logic ────────────────────────────────────────────
  const gradesPeriodStatus = useMemo(() => {
    if (!formData.anoLetivo) return "NO_YEAR_SELECTED";
    if (isLoadingGradesPrompt || isLoadingPromptPermissionLaunch) return "LOADING";
    if (!gradesPrompt) return "NOT_DEFINED";

    const now = new Date();
    const start = new Date(gradesPrompt.data_inicio);
    const end = new Date(gradesPrompt.data_fim);

    return now >= start && now <= end ? "ALLOWED" : "OUT_OF_PERIOD";
  }, [formData.anoLetivo, gradesPrompt, isLoadingGradesPrompt, isLoadingPromptPermissionLaunch]);

  const hasSpecialPermission = teacherHasPermissionToLaunchNotes(
    promptPermissionLaunch?.data?.[0],
  );
  const isGlobalPeriodActive = gradesPeriodStatus === "ALLOWED";
  const shouldBlockGradesActions = !(hasSpecialPermission || isGlobalPeriodActive);

  const showDeadline =
    parseFilter(formData.anoLetivo) &&
    parseFilter(formData.semestre) &&
    parseFilter(formData.tipoAvaliacao) &&
    parseFilter(formData.unidadeCurricular);

  // ─── PDF ──────────────────────────────────────────────────────────────────
  const pdfData = useMemo(() => {
    if (!localStudents.length) return null;

    const rows = localStudents.map((student) => ({
      matricula: student.numero_de_matricula,
      nome: student.nome_completo,
      nota: student.nota !== null && student.nota !== undefined ? student.nota : "—",
      observacao: student.observacao || "—",
    }));

    const totalAlunos = localStudents.length;
    const notasLancadas = localStudents.filter(
      (s) => s.nota !== null && s.nota !== undefined,
    ).length;
    const percentLancadas =
      totalAlunos > 0 ? ((notasLancadas / totalAlunos) * 100).toFixed(1) : "0.0";

    const filtroTexto = [
      `Ano Letivo: ${academicYear?.find((a) => a.codigo === Number(formData.anoLetivo))?.designacao || "—"}`,
      `Semestre: ${semestres?.find((s) => s.codigo === Number(formData.semestre))?.designacao || "—"}`,
      `Curso: ${cursos?.find((c) => c.codigo === Number(formData.curso))?.designacao || "—"}`,
      `UC: ${unidadesCurriculares?.find((u) => u.pk === Number(formData.unidadeCurricular))?.descricao || "—"}`,
      `Horário: ${scheduleResponse?.data?.find((h) => h.codigo === Number(formData.horarioId))?.designacao || "—"}`,
      `Tipo Prova: ${tipoProva?.find((t) => t.codigo === Number(formData.tipoProva))?.designacao || "—"}`,
      `Tipo Avaliação: ${tipoAvaliacao?.find((t) => t.codigo === Number(formData.tipoAvaliacao))?.designacao || "—"}`,
    ]
      .filter(Boolean)
      .join(" | ");

    return {
      rows,
      totais: [
        { label: "Total de Alunos", value: totalAlunos.toString() },
        { label: "Notas Lançadas", value: notasLancadas.toString() },
        { label: "Progresso", value: `${percentLancadas}%` },
      ],
      filtrosAplicados: filtroTexto || "Filtros não selecionados",
    };
  }, [localStudents, formData, academicYear, semestres, cursos, unidadesCurriculares, scheduleResponse, tipoProva, tipoAvaliacao]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Lançamento de Notas"
      subtitle="Controle de lançamento por disciplina e turma"
      infoSections={[
        { title: "Resumo", content: pdfData.filtrosAplicados },
        { title: "Resumo", content: pdfData.totais.map((t) => `${t.label}: ${t.value}`) },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Nº Matrícula", width: "15%", align: "center" },
          { key: "nome", label: "Nome do Estudante", width: "50%" },
          { key: "nota", label: "Nota (0-20)", width: "15%", align: "center" },
          { key: "observacao", label: "Observação", width: "20%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      totals={pdfData.totais}
      footerNotice="Documento gerado automaticamente. Notas pendentes devem ser lançadas conforme regulamento académico."
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

  const handleNotaChange = (
    id: number,
    field: "nota" | "observacao",
    value: string,
  ) => {
    let newValue: number | string | null = value === "" ? null : value;

    if (field === "nota") {
      const num = Number(value);
      newValue = !isNaN(num) ? Math.max(0, Math.min(20, num)) : null;
    }

    setLocalStudents((prev) =>
      prev.map((s) => (s.codigo_grade_aluno === id ? { ...s, [field]: newValue } : s)),
    );
  };

  const totalPages = Math.ceil(localStudents.length / itemsPerPage);

  const studentsWithValidNota = localStudents.filter(
    (s) =>
      s.nota !== null &&
      s.nota !== undefined &&
      Number(s.nota) >= 0 &&
      Number(s.nota) <= 20,
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Lançamento de notas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamento de notas</h1>
          <p className="text-muted-foreground mt-1">Lançar notas de avaliações por UC</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {localStudents.length > 0 && pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`Lancamento_Notas_${formData.unidadeCurricular || "UC"}_${new Date().toISOString().slice(0, 10)}.pdf`}
              showDownload={true}
              showPrint={true}
            />
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
          />

          <FormSelect
            disabled={isLoadingPeriodos || isLoadingAcademicYear || formData.anoLetivo === ""}
            loading={isLoadingPeriodos}
            label="Período"
            value={formData.periodo}
            onChange={(v) => setFormData({ ...formData, periodo: v })}
            options={periodos}
            map={(p) => ({ key: p.codigo, label: p.designacao, value: p.codigo })}
          />

          <FormSelect
            disabled={isLoadingSemestres}
            loading={isLoadingSemestres}
            label="Semestre"
            value={formData.semestre}
            onChange={(v) => setFormData({ ...formData, semestre: v })}
            options={semestres}
            map={(s) => ({ key: s.codigo, label: s.designacao, value: s.codigo })}
          />

          <CourseSelect
            value={formData.curso}
            onChangeValue={(v) => setFormData({ ...formData, curso: v })}
          />

          <FormSelect
            label="Ano Curricular"
            value={formData.classes}
            disabled={isLoadingClasses || !formData.curso}
            onChange={(v) => setFormData({ ...formData, classes: v })}
            options={classes}
            map={(c) => ({ key: c.codigo, label: c.designacao, value: c.codigo })}
            loading={isLoadingClasses}
          />

          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            disabled={isLoadingUC || !formData.semestre || !formData.curso || !formData.classes}
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            map={(u) => ({ key: u.codigo, label: u.descricao, value: u.pk })}
            loading={isLoadingUC}
          />

          <FormSelectIsaac
            label="Horário"
            value={formData.horarioId}
            disabled={loadingschedule || !formData.semestre || !formData.classes}
            onChange={(v) => setFormData({ ...formData, horarioId: v })}
            options={scheduleResponse?.data}
            map={(u, index) => ({ key: index, value: u.codigo, label: `${u.designacao}` })}
            loading={loadingschedule}
          />

          <FormSelect
            label="Tipo de Prova"
            value={formData.tipoProva}
            disabled={isLoadingTipoProva}
            onChange={(v) => setFormData({ ...formData, tipoProva: v })}
            options={tipoProva}
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo })}
            loading={isLoadingTipoProva}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={formData.tipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
            options={tipoAvaliacao}
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo })}
            loading={isLoadingTipoAvaliacao}
          />

          <div className="relative flex flex-col gap-1">
            <label className="text-sm font-medium">Pesquisar por nome Ou Nº Matrícula</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou número de matrícula..."
                value={formData.search}
                onChange={(e) => setFormData({ ...formData, search: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              disabled={
                loadingNoteRelease ||
                !formData.anoLetivo ||
                !formData.periodo ||
                !formData.semestre ||
                !formData.curso ||
                !formData.classes ||
                !formData.horarioId ||
                !formData.tipoProva ||
                !formData.tipoAvaliacao ||
                shouldBlockGradesActions
              }
              onClick={() => refetch({ cancelRefetch: false })}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Listar
            </Button>
          </div>
        </div>
      </div>

      {showDeadline && (
        <StatusBanner
          gradesPeriodStatus={gradesPeriodStatus}
          gradesPrompt={gradesPrompt}
          hasSpecialPermission={hasSpecialPermission}
        />
      )}

      {/* Tabela */}
      {loadingNoteRelease ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : localStudents.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground">
            Clique em "Listar" após selecionar os filtros
          </p>
        </div>
      ) : (
        <>
          {/* ── Barra de ações em massa ──────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-muted/40 border rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                <strong>{localStudents.length}</strong> aluno(s) listado(s) •{" "}
                <strong>{studentsWithValidNota.length}</strong> com nota preenchida
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle abrir / fechar todos os cadeados */}
              <Button
                variant="outline"
                size="sm"
                disabled={shouldBlockGradesActions || isRefetching || isSavingAll}
                onClick={allUnlocked ? handleLockAll : handleUnlockAll}
              >
                {allUnlocked ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Fechar Todos
                  </>
                ) : (
                  <>
                    <LockOpen className="h-4 w-4 mr-2" />
                    Abrir Todos os Cadeados
                  </>
                )}
              </Button>

              {/* Lançar todos em massa — array com N posições, rota única */}
              <Button
                size="sm"
                disabled={
                  shouldBlockGradesActions ||
                  isRefetching ||
                  isSavingAll ||
                  studentsWithValidNota.length === 0
                }
                onClick={handleSaveAllStudents}
              >
                {isSavingAll ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    A lançar...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Lançar Todos ({studentsWithValidNota.length})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ── Tabela ──────────────────────────────────────────────────── */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Nº Matrícula</TableHead>
                    <TableHead>Nome do Estudante</TableHead>
                    <TableHead className="w-[600px] text-center">Descrição</TableHead>
                    <TableHead className="w-[140px] text-center">Nota (0-20)</TableHead>
                    <TableHead className="w-[140px] text-center">Estado</TableHead>
                    <TableHead className="w-[120px] text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localStudents
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((student) => {
                      const hasNota =
                        student.nota !== null && student.nota !== undefined;
                      const isValid =
                        hasNota &&
                        Number(student.nota) >= 0 &&
                        Number(student.nota) <= 20;
                      const isLocked =
                        lockedStudents[student.codigo_grade_aluno] ?? true;

                      return (
                        <TableRow key={student.codigo_grade_aluno}>
                          <TableCell className="font-mono text-sm">
                            {student.numero_de_matricula}
                          </TableCell>

                          <TableCell className="font-medium">
                            {student.nome_completo}
                          </TableCell>

                          <TableCell className="text-center">
                            <Input
                              type="text"
                              value={student.observacao || ""}
                              onChange={(e) =>
                                handleNotaChange(
                                  student.codigo_grade_aluno,
                                  "observacao",
                                  e.target.value,
                                )
                              }
                              className="w-full mx-auto text-left"
                              placeholder="Pequena descrição..."
                              disabled={isLocked}
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.nota ?? ""}
                              onChange={(e) =>
                                handleNotaChange(
                                  student.codigo_grade_aluno,
                                  "nota",
                                  e.target.value,
                                )
                              }
                              className="w-24 mx-auto text-center"
                              placeholder="0-20"
                              disabled={isLocked || isRefetching}
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            {!hasNota ? (
                              <Badge variant="secondary">Pendente</Badge>
                            ) : isValid ? (
                              <Badge variant="default" className="bg-green-600">
                                Lançada
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Inválida</Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-center flex justify-center gap-2">
                            {/* Cadeado individual */}
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={shouldBlockGradesActions || isRefetching || isSavingAll}
                              onClick={() => toggleLock(student.codigo_grade_aluno)}
                            >
                              {isLocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </Button>

                            {/* Lançar individual → array[1], mesma rota */}
                            <Button
                              size="sm"
                              variant={hasNota ? "default" : "outline"}
                              disabled={shouldBlockGradesActions || isRefetching || isSavingAll}
                              onClick={() => handleSaveIndividual(student)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {hasNota ? "Atualizar" : "Lançar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ── Paginação ────────────────────────────────────────────────── */}
          {localStudents.length > 0 && (
            <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
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
                  {Math.min(currentPage * itemsPerPage, localStudents.length)} de{" "}
                  {localStudents.length} registos
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
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Seguinte
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function teacherHasPermissionToLaunchNotes(
  promptPermissionLaunch: GetAssessmentNotasItem | null | undefined,
) {
  if (!promptPermissionLaunch) return false;
  const now = new Date();
  const start = new Date(promptPermissionLaunch.DATAINICIAL);
  const end = new Date(promptPermissionLaunch.DATAFIM);
  return now >= start && now <= end;
}

interface StatusBannerProps {
  gradesPeriodStatus: string;
  gradesPrompt?: {
    tipo_avaliacao_nome?: string;
    data_inicio: string;
    data_fim: string;
  } | null;
  hasSpecialPermission: boolean;
}

const StatusBanner: React.FC<StatusBannerProps> = ({
  gradesPeriodStatus,
  gradesPrompt,
  hasSpecialPermission,
}) => {
  if (hasSpecialPermission) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-center gap-2">
        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        Possui permissão especial de lançamento ativa ✔
      </div>
    );
  }

  const configs: Record<
    string,
    { className: string; title?: string; content: React.ReactNode }
  > = {
    LOADING: {
      className: "bg-muted border text-muted-foreground text-sm",
      content: "A verificar prazo de lançamento de notas...",
    },
    NO_YEAR_SELECTED: {
      className: "bg-muted border text-muted-foreground text-sm",
      content: "Selecione o ano letivo para verificar o prazo de lançamento.",
    },
    NOT_DEFINED: {
      className: "bg-red-50 border border-red-200 text-red-700",
      title: "Nenhum prazo configurado",
      content: `Não existe período definido para ${
        gradesPrompt?.tipo_avaliacao_nome || "esta avaliação"
      }. Contacte a administração.`,
    },
    OUT_OF_PERIOD: {
      className: "bg-amber-50 border border-amber-300 text-amber-800",
      title: `Fora do prazo — ${gradesPrompt?.tipo_avaliacao_nome ?? "Lançamento de Notas"}`,
      content: gradesPrompt ? (
        <>
          O lançamento está permitido apenas de{" "}
          <strong>
            {new Date(gradesPrompt.data_inicio).toLocaleDateString("pt-AO")}
          </strong>{" "}
          até{" "}
          <strong>
            {new Date(gradesPrompt.data_fim).toLocaleDateString("pt-AO")}
          </strong>
          .
        </>
      ) : null,
    },
    ALLOWED: {
      className: "bg-green-50 border border-green-200 text-green-800 text-sm",
      content: "Dentro do prazo para lançamento de notas ✔",
    },
  };

  const config = configs[gradesPeriodStatus];
  if (!config) return null;

  return (
    <div className={`${config.className} rounded-lg p-4 transition-all duration-300`}>
      {config.title && <p className="font-semibold mb-1">{config.title}</p>}
      <div className={config.title ? "text-sm opacity-90" : ""}>{config.content}</div>
    </div>
  );
};