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
  Download,
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
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useQueryListSchedules } from "@/hooks/horario/use-query-horarios-by-teacher";
import { FormSelectIsaac } from "@/components/common/FormSelectIsaac";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";

export default function LaunchNotes() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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
    verHoario: "",
    filtro: "",
  });

  const {
    data: students = [],
    isLoading: loadingNoteRelease,
    refetch,
  } = useQueryNoteReleases({
    anoLectivoId: Number(formData.anoLetivo),
    horarioId: Number(formData.horarioId),
    tipoProvaId: Number(formData.tipoProva),
    tipoAvaliacao: Number(formData.tipoAvaliacao),
    classe: Number(formData.classes),
    turno: Number(formData.periodo),
  });

  const [localStudents, setLocalStudents] = useState(students);
  const [lockedStudents, setLockedStudents] = useState<{
    [key: number]: boolean;
  }>({});

  const { data: semestres, isLoading: isLoadingSemestres } = useQuerySemestres();
  const { user: userData } = useAuth();
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: teacherInfoData, isLoading: teacherInfoDataLoading } = useQueryTeacherProfile(userData?.user?.pk_utilizador);
  const { data: turmDataHorario, isLoading: isLoadingTurmaDataHorario } = useQueryListSchedules({
    teacherId: teacherInfoData?.codigo_docente,
    anoLectivo: Number(formData.anoLetivo),
    semestre: Number(formData.semestre),
  });

  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } = useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } = useQueryTipoAvaliacao();
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } = useQueryTipoProva();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const upsertNoteMutation = useUpsertNote();

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
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

  const { data: scheduleResponse, isLoading: loadingschedule } = useQuerySchedulesByUc(
    {
      anoLectivo: Number(formData.anoLetivo),
      semestre: Number(formData.semestre),
      periodo: Number(formData.periodo),
      curso: Number(formData.curso),
      unidadeCurricular: Number(formData.unidadeCurricular),
    },
    { enabled: canLoadTurmas }
  );

  useEffect(() => {
    setLocalStudents(students);
    const initialLocks: { [key: number]: boolean } = {};
    students.forEach((s) => {
      initialLocks[s.codigo_grade_aluno] = true;
    });
    setLockedStudents(initialLocks);
  }, [students]);

  // Preparação dos dados para PDF
  const pdfData = useMemo(() => {
    if (!localStudents.length) return null;

    const rows = localStudents.map((student) => ({
      matricula: student.numero_de_matricula,
      nome: student.nome_completo,
      nota: student.nota !== null && student.nota !== undefined ? student.nota : "—",
      observacao: student.observacao || "—",
    }));

    const totalAlunos = localStudents.length;
    const notasLancadas = localStudents.filter(s => s.nota !== null && s.nota !== undefined).length;
    const percentLancadas = totalAlunos > 0 ? ((notasLancadas / totalAlunos) * 100).toFixed(1) : "0.0";

    const filtroTexto = [
      `Ano Letivo: ${academicYear?.find(a => a.codigo === Number(formData.anoLetivo))?.designacao || "—"}`,
      `Semestre: ${semestres?.find(s => s.codigo === Number(formData.semestre))?.designacao || "—"}`,
      `Curso: ${cursos?.find(c => c.codigo === Number(formData.curso))?.designacao || "—"}`,
      `UC: ${unidadesCurriculares?.find(u => u.pk === Number(formData.unidadeCurricular))?.descricao || "—"}`,
      `Horário: ${scheduleResponse?.data?.find(h => h.codigo === Number(formData.horarioId))?.designacao || "—"}`,
      `Tipo Prova: ${tipoProva?.find(t => t.codigo === Number(formData.tipoProva))?.designacao || "—"}`,
      `Tipo Avaliação: ${tipoAvaliacao?.find(t => t.codigo === Number(formData.tipoAvaliacao))?.designacao || "—"}`,
    ].filter(Boolean).join(" | ");

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
          {
          title: "Resumo",
          content: pdfData.filtrosAplicados,
        },
        {
          title: "Resumo",
          content: pdfData.totais.map(t => `${t.label}: ${t.value}`),
        },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Nº Matrícula", width: "15%", align: "center" },
          { key: "nome", label: "Nome do Estudante", width: "50%" },
          { key: "nota", label: "Nota (0-20)", width: "15%", align: "center" },
          { key: "observacao", label: "Observação", width: "20%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#1e40af", 
      }}
      totals={pdfData.totais}
      footerNotice="Documento gerado automaticamente. Notas pendentes devem ser lançadas conforme regulamento académico."
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

  const totalPages = Math.ceil(localStudents.length / itemsPerPage);

  const handleNotaChange = (
    id: number,
    field: "nota" | "observacao",
    value: string
  ) => {
    let newValue: number | string | null = value === "" ? null : value;

    if (field === "nota") {
      const num = Number(value);
      if (!isNaN(num)) {
        newValue = Math.max(0, Math.min(20, num));
      } else {
        newValue = null;
      }
    }

    setLocalStudents((prev) =>
      prev.map((s) =>
        s.codigo_grade_aluno === id ? { ...s, [field]: newValue } : s
      )
    );
  };

  const toggleLock = (id: number) => {
    setLockedStudents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveAll = (student: any) => {
    const payload: NoteUpsertPayload = {
      gradeCurricularAluno: student.codigo_grade_aluno,
      utilizador: userData?.user?.pk_utilizador || 0,
      nota: Number(student.nota),
      tipoDeProva: Number(formData.tipoProva),
      epoca: 2,
      tipoAvaliacao: Number(formData.tipoAvaliacao),
      observacao: student.observacao || null,
      status: 2,
      notaAnterior: student.notaFinalAnterior || 0,
     
      codigo_grade_avaliacao_aluno:
        student.codigo_grade_avaliacao_aluno || undefined,
    };

    upsertNoteMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Sucesso",
          description: "Nota lançada/atualizada com sucesso.",
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
        <span className="text-foreground">Lançamento de notas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lançamento de notas
          </h1>
          <p className="text-muted-foreground mt-1">
            Lançar notas de avaliações por UC
          </p>
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
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            disabled={isLoadingPeriodos || isLoadingAcademicYear || formData.anoLetivo === ""}
            loading={isLoadingPeriodos}
            label="Período"
            value={formData.periodo}
            onChange={(v) => setFormData({ ...formData, periodo: v })}
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
            value={formData.semestre}
            onChange={(v) => setFormData({ ...formData, semestre: v })}
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
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
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={isLoadingClasses}
          />

          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            disabled={
              isLoadingUC ||
              !formData.semestre ||
              !formData.curso ||
              !formData.classes
            }
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.codigo,
              label: u.descricao,
              value: u.pk,
            })}
            loading={isLoadingUC}
          />

          <FormSelectIsaac
            label="Horário"
            value={formData.horarioId}
            disabled={loadingschedule || !formData.semestre || !formData.classes}
            onChange={(v) => setFormData({ ...formData, horarioId: v })}
            options={scheduleResponse?.data}
            map={(u, index) => ({
              key: index,
              value: u.codigo,
              label: `${u.designacao}`,
            })}
            loading={loadingschedule}
          />

          <FormSelect
            label="Tipo de Prova"
            value={formData.tipoProva}
            disabled={isLoadingTipoProva}
            onChange={(v) => setFormData({ ...formData, tipoProva: v })}
            options={tipoProva}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
            loading={isLoadingTipoProva}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={formData.tipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
            options={tipoAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
            loading={isLoadingTipoAvaliacao}
          />

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
                !formData.tipoAvaliacao
              }
              onClick={() => refetch()}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Listar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      {loadingNoteRelease ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : localStudents.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum registo encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Clique em "Listar" após selecionar os filtros
          </p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Nº Matrícula</TableHead>
                    <TableHead>Nome do Estudante</TableHead>
                    <TableHead className="w-[600px] text-center">
                      Descrição
                    </TableHead>
                    <TableHead className="w-[140px] text-center">
                      Nota (0-20)
                    </TableHead>
                    <TableHead className="w-[140px] text-center">
                      Estado
                    </TableHead>
                    <TableHead className="w-[120px] text-center">
                      Ação
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localStudents
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
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
                                  e.target.value
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
                                  e.target.value
                                )
                              }
                              className="w-24 mx-auto text-center"
                              placeholder="0-20"
                              disabled={isLocked}
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toggleLock(student.codigo_grade_aluno)
                              }
                            >
                              {isLocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant={hasNota ? "default" : "outline"}
                              onClick={() => {
                                if (
                                  student.nota === null ||
                                  student.nota === undefined
                                ) {
                                  toast({
                                    title: "Erro",
                                    description: "Insira uma nota primeiro",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                if (
                                  Number(student.nota) < 0 ||
                                  Number(student.nota) > 20
                                ) {
                                  toast({
                                    title: "Erro",
                                    description:
                                      "A nota deve estar entre 0 e 20",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                handleSaveAll(student);
                                toggleLock(student.codigo_grade_aluno);
                                toast({
                                  title: hasNota
                                    ? "Nota atualizada"
                                    : "Nota lançada",
                                  description: `${student.nome_completo} → ${student.nota} valores`,
                                });
                              }}
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

          {/* Paginação */}
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