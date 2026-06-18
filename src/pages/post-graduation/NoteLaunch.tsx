import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpenCheck,
  Loader2,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryNoteLaunchOptions } from "@/hooks/post-graduation/use-query-note-launch-options";
import { useQueryNoteLaunchStudents } from "@/hooks/post-graduation/use-query-note-launch-students";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import type { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { NoteLaunchFilters, NoteLaunchFilterState } from "./components/NoteLaunchFilters";
import { NoteLaunchSummary } from "./components/NoteLaunchSummary";
import { NoteLaunchTable } from "./components/NoteLaunchTable";
import { NoteLaunchPagination } from "./components/NoteLaunchPagination";
import { useMutationPostGraduationNoteLaunch } from "@/hooks/post-graduation/use-mutation-note-launch";
import { useToast } from "@/components/ui/use-toast";


type DegreeOption = PostGraduationDegree & { id: number };

const MASTERS_DEGREE_ID = 2;

const initialFilters: NoteLaunchFilterState = {
  academicYearId: "",
  degreeId: "",
  semesterId: "",
  periodId: "",
  courseId: "",
  curricularYearId: "",
  curricularGradeId: "",
  scheduleId: "",
  examTypeId: "",
  assessmentTypeId: "",
};

export type EditableNote = {
      studentCurricularGradeId: number;
      grade: string;
      observation: string;
      originalGrade: number | null;
      originalObservation: string | null;
    };

export default function PostGraduationNoteLaunch() {
  const [filters, setFilters] =
    useState<NoteLaunchFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  /**
   * Estrutura local para armazenar notas editáveis. A chave é o
   * `studentCurricularGradeId` e o valor contém a nota/observação em
   * edição e os valores originais para comparar alterações.
   */
  

  // Estado de notas editáveis por estudante
  const [editableNotes, setEditableNotes] = useState<Record<number, EditableNote>>({});

  // Estado para controlar quais linhas estão a ser guardadas no momento
  const [savingStudents, setSavingStudents] = useState<number[]>([]);

  // Instância de toast para mensagens de sucesso/erro
  const { toast } = useToast();

  // Hook de mutação para gravar notas
  const mutation = useMutationPostGraduationNoteLaunch();

  const {
    data: academicYears = [],
    isLoading: isLoadingAcademicYears,
    isError: isAcademicYearsError,
  } = useQueryAnoAcademico();
  const {
    data: degreesResponse,
    isLoading: isLoadingDegrees,
    isError: isDegreesError,
  } = useQueryPostGraduationDegrees();
  const {
    data: semestersResponse = [],
    isLoading: isLoadingSemesters,
    isError: isSemestersError,
  } = useQuerySemestres();

  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree): degree is DegreeOption =>
          degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  const semesters = useMemo(
    () =>
      semestersResponse.filter((semester) =>
        [1, 2].includes(Number(semester.codigo)),
      ),
    [semestersResponse],
  );

  useEffect(() => {
    if (filters.academicYearId || academicYears.length === 0) return;

    const activeAcademicYear = academicYears.find((academicYear) =>
      ["activo", "ativo"].includes(
        academicYear.estado?.trim().toLowerCase(),
      ),
    );

    if (activeAcademicYear) {
      setFilters((current) => ({
        ...current,
        academicYearId: String(activeAcademicYear.codigo),
      }));
    }
  }, [academicYears, filters.academicYearId]);

  useEffect(() => {
    if (filters.degreeId || degrees.length === 0) return;

    const mastersDegree = degrees.find(
      (degree) => degree.id === MASTERS_DEGREE_ID,
    );

    setFilters((current) => ({
      ...current,
      degreeId: String(mastersDegree?.id ?? degrees[0].id),
    }));
  }, [degrees, filters.degreeId]);

  const baseParams = {
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
    semesterId: Number(filters.semesterId),
  };

  const hasBaseFilters =
    baseParams.academicYearId > 0 &&
    [2, 3].includes(baseParams.degreeId) &&
    [1, 2].includes(baseParams.semesterId);

  const {
    data: optionsResponse,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
  } = useQueryNoteLaunchOptions(baseParams);

  const options = optionsResponse?.data;

  const courses = useMemo(() => {
    if (!options || !filters.periodId) return [];

    const courseIds = new Set(
      options.schedules
        .filter(
          (schedule) =>
            schedule.periodId === Number(filters.periodId),
        )
        .map((schedule) => schedule.courseId),
    );

    return options.courses.filter((course) => courseIds.has(course.id));
  }, [filters.periodId, options]);

  const curricularYears = useMemo(() => {
    if (!options || !filters.courseId) return [];

    return options.curricularYears.filter(
      (curricularYear) =>
        curricularYear.courseId === Number(filters.courseId),
    );
  }, [filters.courseId, options]);

  const curricularUnits = useMemo(() => {
    if (
      !options ||
      !filters.periodId ||
      !filters.courseId ||
      !filters.curricularYearId
    ) {
      return [];
    }

    const availableGradeIds = new Set(
      options.schedules
        .filter(
          (schedule) =>
            schedule.periodId === Number(filters.periodId) &&
            schedule.courseId === Number(filters.courseId) &&
            schedule.curricularYearId ===
              Number(filters.curricularYearId),
        )
        .map((schedule) => schedule.curricularGradeId),
    );

    return options.curricularUnits.filter(
      (unit) =>
        unit.courseId === Number(filters.courseId) &&
        unit.curricularYearId === Number(filters.curricularYearId) &&
        availableGradeIds.has(unit.curricularGradeId),
    );
  }, [
    filters.courseId,
    filters.curricularYearId,
    filters.periodId,
    options,
  ]);

  const schedules = useMemo(() => {
    if (!options || !filters.curricularGradeId) return [];

    return options.schedules.filter(
      (schedule) =>
        schedule.periodId === Number(filters.periodId) &&
        schedule.courseId === Number(filters.courseId) &&
        schedule.curricularYearId ===
          Number(filters.curricularYearId) &&
        schedule.curricularGradeId ===
          Number(filters.curricularGradeId),
    );
  }, [
    filters.courseId,
    filters.curricularGradeId,
    filters.curricularYearId,
    filters.periodId,
    options,
  ]);

  const queryParams = {
    academicYearId: Number(filters.academicYearId),
    degreeId: Number(filters.degreeId),
    semesterId: Number(filters.semesterId),
    periodId: Number(filters.periodId),
    courseId: Number(filters.courseId),
    curricularYearId: Number(filters.curricularYearId),
    curricularGradeId: Number(filters.curricularGradeId),
    scheduleId: Number(filters.scheduleId),
    examTypeId: Number(filters.examTypeId),
    assessmentTypeId: Number(filters.assessmentTypeId),
    search: appliedSearch || undefined,
    page,
    limit,
  };

  const hasCompleteFilters =
    hasBaseFilters &&
    queryParams.periodId > 0 &&
    queryParams.courseId > 0 &&
    queryParams.curricularYearId > 0 &&
    queryParams.curricularGradeId > 0 &&
    queryParams.scheduleId > 0 &&
    queryParams.examTypeId > 0 &&
    queryParams.assessmentTypeId > 0;

  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useQueryNoteLaunchStudents(queryParams);

  const students = studentsResponse?.data ?? [];
  const summary = studentsResponse?.summary;
  const totalPages = Math.max(1, studentsResponse?.totalPages ?? 1);

  // Sempre que a lista de estudantes muda, inicializar o estado editável
  useEffect(() => {
    setEditableNotes(() => {
      const entries = students.map((student) => [
        student.studentCurricularGradeId,
        {
          studentCurricularGradeId: student.studentCurricularGradeId,
          grade:
            student.note.grade === null
              ? ""
              : String(student.note.grade),
          observation: student.note.observation ?? "",
          originalGrade: student.note.grade,
          originalObservation: student.note.observation,
        },
      ]);
      return Object.fromEntries(entries);
    });
    // Reset estado de salvamento quando a lista muda
    setSavingStudents([]);
  }, [students]);

  // Verificar se existem alterações não guardadas para mostrar botão de guardar em lote
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(editableNotes).some((item) => {
      const parsedGrade = item.grade.trim() === "" ? null : Number(item.grade);
      return (
        parsedGrade !== item.originalGrade ||
        item.observation.trim() !== (item.originalObservation ?? "").trim()
      );
    });
  }, [editableNotes]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function resetResultState() {
    setPage(1);
    setSearch("");
    setAppliedSearch("");
  }

  function handleFilterChange(
    field: keyof NoteLaunchFilterState,
    value: string,
  ) {
    setFilters((current) => {
      const next = { ...current, [field]: value };

      if (field === "academicYearId" || field === "degreeId") {
        next.semesterId = "";
        next.periodId = "";
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
        next.examTypeId = "";
        next.assessmentTypeId = "";
      } else if (field === "semesterId") {
        next.periodId = "";
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
        next.examTypeId = "";
        next.assessmentTypeId = "";
      } else if (field === "periodId") {
        next.courseId = "";
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "courseId") {
        next.curricularYearId = "";
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "curricularYearId") {
        next.curricularGradeId = "";
        next.scheduleId = "";
      } else if (field === "curricularGradeId") {
        next.scheduleId = "";
      }

      return next;
    });

    resetResultState();
  }

  function handleSearch() {
    setAppliedSearch(search.trim());
    setPage(1);
  }

  /**
   * Actualiza a nota (string) de um estudante específico no estado local.
   */
  function handleGradeChange(studentId: number, value: string) {
    setEditableNotes((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        grade: value,
      },
    }));
  }

  /**
   * Actualiza a observação de um estudante específico no estado local.
   */
  function handleObservationChange(studentId: number, value: string) {
    setEditableNotes((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        observation: value,
      },
    }));
  }

  /**
   * Grava uma única nota individualmente. Aplica validação e mostra
   * feedback. Utiliza os filtros actuais como contexto no payload.
   */
  async function handleSaveOne(studentId: number) {
    const editableNote = editableNotes[studentId];
    if (!editableNote) return;

    const parsedGrade = Number(editableNote.grade);

    // Validar nota antes de enviar
    if (
      editableNote.grade.trim() === "" ||
      Number.isNaN(parsedGrade) ||
      parsedGrade < 0 ||
      parsedGrade > 20
    ) {
      toast({
        variant: "destructive",
        title: "Nota inválida",
        description: "A nota deve ser um número entre 0 e 20.",
      });
      return;
    }

    // Construir payload com o contexto e um único item
    const payload = {
      academicYearId: Number(filters.academicYearId),
      degreeId: Number(filters.degreeId),
      semesterId: Number(filters.semesterId),
      periodId: Number(filters.periodId),
      courseId: Number(filters.courseId),
      curricularYearId: Number(filters.curricularYearId),
      curricularGradeId: Number(filters.curricularGradeId),
      scheduleId: Number(filters.scheduleId),
      examTypeId: Number(filters.examTypeId),
      assessmentTypeId: Number(filters.assessmentTypeId),
      // Como a interface não expõe época, usamos a época padrão da Licenciatura (2).
      termId: 2,
      items: [
        {
          studentCurricularGradeId: editableNote.studentCurricularGradeId,
          grade: parsedGrade,
          observation: editableNote.observation.trim() || undefined,
        },
      ],
    };

    // Marcar a linha como em salvamento
    setSavingStudents((current) => [...current, studentId]);

    try {
      await mutation.mutateAsync(payload);
      toast({ title: "Sucesso", description: "Nota guardada com sucesso." });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao guardar a nota.";
      toast({
        variant: "destructive",
        title: "Erro ao guardar",
        description: String(message),
      });
    } finally {
      setSavingStudents((current) => current.filter((id) => id !== studentId));
    }
  }

  /**
   * Grava todas as notas alteradas. Valida cada nota e mostra mensagens
   * adequadas. O backend recebe apenas as linhas que sofreram mudança.
   */
  async function handleSaveMany() {
    const changedItems = Object.values(editableNotes).filter((item) => {
      const parsedGrade = item.grade.trim() === "" ? null : Number(item.grade);
      return (
        parsedGrade !== item.originalGrade ||
        item.observation.trim() !== (item.originalObservation ?? "").trim()
      );
    });

    if (changedItems.length === 0) {
      toast({
        title: "Nenhuma alteração",
        description: "Não há notas alteradas para guardar.",
      });
      return;
    }

    // Validar individualmente antes de prosseguir
    for (const item of changedItems) {
      const parsedGrade = Number(item.grade);
      if (
        item.grade.trim() === "" ||
        Number.isNaN(parsedGrade) ||
        parsedGrade < 0 ||
        parsedGrade > 20
      ) {
        toast({
          variant: "destructive",
          title: "Nota inválida",
          description:
            "Uma ou mais notas são inválidas. Verifique os valores entre 0 e 20.",
        });
        return;
      }
    }

    // Marcar todas as linhas como em salvamento
    setSavingStudents(changedItems.map((item) => item.studentCurricularGradeId));

    const payload = {
      academicYearId: Number(filters.academicYearId),
      degreeId: Number(filters.degreeId),
      semesterId: Number(filters.semesterId),
      periodId: Number(filters.periodId),
      courseId: Number(filters.courseId),
      curricularYearId: Number(filters.curricularYearId),
      curricularGradeId: Number(filters.curricularGradeId),
      scheduleId: Number(filters.scheduleId),
      examTypeId: Number(filters.examTypeId),
      assessmentTypeId: Number(filters.assessmentTypeId),
      termId: 2,
      items: changedItems.map((item) => ({
        studentCurricularGradeId: item.studentCurricularGradeId,
        grade: Number(item.grade),
        observation: item.observation.trim() || undefined,
      })),
    };

    try {
      await mutation.mutateAsync(payload);
      toast({ title: "Sucesso", description: "Notas guardadas com sucesso." });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao guardar as notas.";
      toast({
        variant: "destructive",
        title: "Erro ao guardar",
        description: String(message),
      });
    } finally {
      setSavingStudents([]);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lançamento de Notas"
        subtitle="Consulta e lançamento de notas da Pós-Graduação"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Botão de actualizar estudantes */}
            <Button
              variant="outline"
              size="sm"
              disabled={!hasCompleteFilters || isFetchingStudents}
              onClick={() => refetchStudents()}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isFetchingStudents ? "animate-spin" : ""
                }`}
              />
              Actualizar
            </Button>
            {/* Botão para guardar alterações em lote, aparece sempre mas pode estar desactivado */}
            <Button
              variant="default"
              size="sm"
              disabled={!hasUnsavedChanges || mutation.isPending}
              onClick={handleSaveMany}
            >
              Guardar alterações
            </Button>
          </div>
        }
      />

      <NoteLaunchFilters
        filters={filters}
        academicYears={academicYears}
        degrees={degrees}
        semesters={semesters}
        options={options}
        courses={courses}
        curricularYears={curricularYears}
        curricularUnits={curricularUnits}
        schedules={schedules}
        isLoadingAcademicYears={isLoadingAcademicYears}
        isLoadingDegrees={isLoadingDegrees}
        isLoadingSemesters={isLoadingSemesters}
        isLoadingOptions={isLoadingOptions}
        isAcademicYearsError={isAcademicYearsError}
        isDegreesError={isDegreesError}
        isSemestersError={isSemestersError}
        isOptionsError={isOptionsError}
        hasBaseFilters={hasBaseFilters}
        onChange={handleFilterChange}
      />

      {studentsResponse?.context && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y py-3 text-sm">
          <span>
            <strong>Curso:</strong> {studentsResponse.context.course}
          </span>
          <span>
            <strong>UC:</strong> {studentsResponse.context.curricularUnit}
          </span>
          <span>
            <strong>Horário:</strong> {studentsResponse.context.schedule}
          </span>
          <span>
            <strong>Prova:</strong> {studentsResponse.context.examType}
          </span>
          <span>
            <strong>Avaliação:</strong>{" "}
            {studentsResponse.context.assessmentType}
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estudantes e notas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label
                htmlFor="note-launch-search"
                className="mb-2 block text-sm font-medium"
              >
                Pesquisa
              </label>
              <div className="flex gap-2">
                <Input
                  id="note-launch-search"
                  value={search}
                  disabled={!hasCompleteFilters}
                  placeholder="Pesquisar por nome ou matrícula"
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!hasCompleteFilters}
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Pesquisar</span>
                </Button>
              </div>
            </div>

            <div className="w-full md:w-32">
              <label className="mb-2 block text-sm font-medium">
                Por página
              </label>
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {summary && <NoteLaunchSummary summary={summary} />}

          {!hasCompleteFilters ? (
            <div className="py-14 text-center text-muted-foreground">
              <BookOpenCheck className="mx-auto mb-3 h-10 w-10" />
              <p>
                Selecione todos os filtros para consultar os estudantes e as
                notas.
              </p>
            </div>
          ) : isLoadingStudents ? (
            <div className="flex items-center justify-center gap-2 py-14 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              A carregar estudantes e notas...
            </div>
          ) : isStudentsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                Não foi possível carregar os estudantes e as notas.
              </AlertTitle>
              <AlertDescription>
                {studentsError instanceof Error
                  ? studentsError.message
                  : "Tente novamente."}
              </AlertDescription>
            </Alert>
          ) : students.length === 0 ? (
            <div className="py-14 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 h-10 w-10" />
              <p>
                Nenhum estudante encontrado para o contexto selecionado.
              </p>
            </div>
          ) : (
            <>
              <NoteLaunchTable
                students={students}
                editableNotes={editableNotes}
                disabled={isFetchingStudents || mutation.isPending}
                savingStudents={savingStudents}
                onGradeChange={handleGradeChange}
                onObservationChange={handleObservationChange}
                onSaveOne={handleSaveOne}
              />
              <NoteLaunchPagination
                page={page}
                totalPages={totalPages}
                total={studentsResponse?.total ?? 0}
                isFetching={isFetchingStudents}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}