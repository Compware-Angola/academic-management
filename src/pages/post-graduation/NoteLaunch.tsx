import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpenCheck,
  Lock,
  Loader2,
  LockOpen,
  Search,
  Users,
} from "lucide-react";
import type { AxiosError } from "axios";

import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import {
  NoteLaunchFilters,
  NoteLaunchFilterState,
} from "./components/NoteLaunchFilters";
import { NoteLaunchSummary } from "./components/NoteLaunchSummary";
import { NoteLaunchTable } from "./components/NoteLaunchTable";
import { NoteLaunchPagination } from "./components/NoteLaunchPagination";
import { useMutationPostGraduationNoteLaunch } from "@/hooks/post-graduation/use-mutation-note-launch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/auth/permission.helper";
import { useQueryGradesCreationPrompt } from "@/hooks/academiccalendar/use-query-grades-creation-prompt";
import { useQueryPromptGetPermissionLaunch } from "@/hooks/avaliacao/use-query-prompt-get-permission-launch";
import type { GetAssessmentNotasItem } from "@/services/avaliacao/prompt-get-permission-launch.service";
import { TipoLancamentoPrazoMap } from "@/constants/tipo-avalicao";
import type { UpsertPostGraduationNoteItem } from "@/services/post-graduation/upsert-note-launch.service";
import {
  NoteLaunchDeadlineStatus,
  type NoteLaunchDeadlineState,
} from "./components/NoteLaunchDeadlineStatus";

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

type NoteLaunchRoles = {
  docente?: boolean;
  Reitor?: boolean;
  Vice_Reitor?: boolean;
  Acessor_do_Reitor?: boolean;
  Coordenador?: boolean;
  Decano?: boolean;
};

export default function PostGraduationNoteLaunch() {
  const [filters, setFilters] = useState<NoteLaunchFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [editableNotes, setEditableNotes] = useState<
    Record<number, EditableNote>
  >({});
  const [savingStudents, setSavingStudents] = useState<number[]>([]);
  const [lockedStudents, setLockedStudents] = useState<Record<number, boolean>>(
    {},
  );

  const { toast } = useToast();
  const mutation = useMutationPostGraduationNoteLaunch();
  const { user: userData } = useAuth();
  const { haveFullAccess } = usePermission();
  const roles = userData?.roles as NoteLaunchRoles | undefined;
  const isDocente = roles?.docente === true;
  const isPrivilegedUser =
    haveFullAccess() ||
    roles?.Reitor === true ||
    roles?.Vice_Reitor === true ||
    roles?.Acessor_do_Reitor === true ||
    roles?.Coordenador === true ||
    roles?.Decano === true;
  const canOperateInPage = isPrivilegedUser || isDocente;

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
        (degree): degree is DegreeOption => degree.id === 2 || degree.id === 3,
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
      ["activo", "ativo"].includes(academicYear.estado?.trim().toLowerCase()),
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
        .filter((schedule) => schedule.periodId === Number(filters.periodId))
        .map((schedule) => schedule.courseId),
    );

    return options.courses.filter((course) => courseIds.has(course.id));
  }, [filters.periodId, options]);

  const curricularYears = useMemo(() => {
    if (!options || !filters.courseId) return [];

    return options.curricularYears.filter(
      (curricularYear) => curricularYear.courseId === Number(filters.courseId),
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
            schedule.curricularYearId === Number(filters.curricularYearId),
        )
        .map((schedule) => schedule.curricularGradeId),
    );

    return options.curricularUnits.filter(
      (unit) =>
        unit.courseId === Number(filters.courseId) &&
        unit.curricularYearId === Number(filters.curricularYearId) &&
        availableGradeIds.has(unit.curricularGradeId),
    );
  }, [filters.courseId, filters.curricularYearId, filters.periodId, options]);

  const schedules = useMemo(() => {
    if (!options || !filters.curricularGradeId) return [];

    return options.schedules.filter(
      (schedule) =>
        schedule.periodId === Number(filters.periodId) &&
        schedule.courseId === Number(filters.courseId) &&
        schedule.curricularYearId === Number(filters.curricularYearId) &&
        schedule.curricularGradeId === Number(filters.curricularGradeId),
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

  const { data: gradesPrompt, isLoading: isLoadingGradesPrompt } =
    useQueryGradesCreationPrompt({
      anoLectivo: queryParams.academicYearId || undefined,
      semestre: queryParams.semesterId || undefined,
      typeAvaliation:
        TipoLancamentoPrazoMap[queryParams.assessmentTypeId] || undefined,
    });

  const {
    data: promptPermissionLaunch,
    isLoading: isLoadingPromptPermissionLaunch,
  } = useQueryPromptGetPermissionLaunch({
    anoLectivo: queryParams.academicYearId || undefined,
    grade: queryParams.curricularGradeId || undefined,
    tipoAvaliacao: queryParams.assessmentTypeId || undefined,
    utilizadorId: userData?.user?.pk_utilizador,
  });

  const gradesPeriodStatus = useMemo<NoteLaunchDeadlineState>(() => {
    if (isPrivilegedUser) return "ALLOWED";
    if (!queryParams.academicYearId) return "NO_YEAR_SELECTED";
    if (isLoadingGradesPrompt || isLoadingPromptPermissionLaunch) {
      return "LOADING";
    }
    if (!gradesPrompt) return "NOT_DEFINED";

    const now = new Date();
    const start = new Date(gradesPrompt.data_inicio);
    const end = new Date(gradesPrompt.data_fim);

    return now >= start && now <= end ? "ALLOWED" : "OUT_OF_PERIOD";
  }, [
    gradesPrompt,
    isLoadingGradesPrompt,
    isLoadingPromptPermissionLaunch,
    isPrivilegedUser,
    queryParams.academicYearId,
  ]);

  const hasSpecialPermission =
    isPrivilegedUser ||
    teacherHasPermissionToLaunchNotes(promptPermissionLaunch?.data?.[0]);
  const shouldBlockGradesActions = !(
    hasSpecialPermission || gradesPeriodStatus === "ALLOWED"
  );
  const showDeadline =
    isPrivilegedUser || (hasCompleteFilters && canOperateInPage);

  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
    isError: isStudentsError,
    error: studentsError,
  } = useQueryNoteLaunchStudents(queryParams, {
    enabled:
      hasCompleteFilters && canOperateInPage && !shouldBlockGradesActions,
  });

  const students = useMemo(
    () => studentsResponse?.data ?? [],
    [studentsResponse?.data],
  );
  const summary = studentsResponse?.summary;
  const totalPages = Math.max(1, studentsResponse?.totalPages ?? 1);

  useEffect(() => {
    const noteEntries = students.map((student) => [
      student.studentCurricularGradeId,
      {
        studentCurricularGradeId: student.studentCurricularGradeId,
        grade: student.note.grade === null ? "" : String(student.note.grade),
        observation: student.note.observation ?? "",
        originalGrade: student.note.grade,
        originalObservation: student.note.observation,
      },
    ]);
    const lockEntries = students.map((student) => [
      student.studentCurricularGradeId,
      true,
    ]);

    setEditableNotes(
      Object.fromEntries(noteEntries) as Record<number, EditableNote>,
    );
    setLockedStudents(
      Object.fromEntries(lockEntries) as Record<number, boolean>,
    );
    setSavingStudents([]);
  }, [students]);

  const changedNotesCount = useMemo(
    () =>
      Object.values(editableNotes).filter((item) => {
        const parsedGrade =
          item.grade.trim() === "" ? null : Number(item.grade);

        return (
          parsedGrade !== item.originalGrade ||
          item.observation.trim() !== (item.originalObservation ?? "").trim()
        );
      }).length,
    [editableNotes],
  );
  const hasUnsavedChanges = changedNotesCount > 0;

  const allUnlocked =
    students.length > 0 &&
    students.every(
      (student) => lockedStudents[student.studentCurricularGradeId] === false,
    );

  function handleToggleLock(studentId: number) {
    setLockedStudents((current) => ({
      ...current,
      [studentId]: !(current[studentId] ?? true),
    }));
  }

  function handleUnlockAll() {
    setLockedStudents(
      Object.fromEntries(
        students.map((student) => [student.studentCurricularGradeId, false]),
      ),
    );
  }

  function handleLockAll() {
    setLockedStudents(
      Object.fromEntries(
        students.map((student) => [student.studentCurricularGradeId, true]),
      ),
    );
  }

  function isNoteChanged(studentId: number) {
    const item = editableNotes[studentId];
    if (!item) return false;

    const parsedGrade = item.grade.trim() === "" ? null : Number(item.grade);

    return (
      parsedGrade !== item.originalGrade ||
      item.observation.trim() !== (item.originalObservation ?? "").trim()
    );
  }

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

  function buildPayload(items: UpsertPostGraduationNoteItem[]) {
    return {
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
      items,
    };
  }

  async function handleSaveOne(studentId: number) {
    const editableNote = editableNotes[studentId];
    if (!editableNote) return;

    const parsedGrade = Number(editableNote.grade);

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

    setSavingStudents((current) => [...current, studentId]);

    try {
      await mutation.mutateAsync(
        buildPayload([
          {
            studentCurricularGradeId: studentId,
            grade: parsedGrade,
            observation: editableNote.observation.trim() || undefined,
          },
        ]),
      );
      setLockedStudents((current) => ({ ...current, [studentId]: true }));
      toast({ title: "Sucesso", description: "Nota guardada com sucesso." });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Erro ao guardar",
        description: getErrorMessage(error, "Erro ao guardar a nota."),
      });
    } finally {
      setSavingStudents((current) => current.filter((id) => id !== studentId));
    }
  }

  async function handleResetOne(studentId: number) {
    const editableNote = editableNotes[studentId];
    if (!editableNote) return;

    setSavingStudents((current) => [...current, studentId]);

    try {
      await mutation.mutateAsync(
        buildPayload([
          {
            studentCurricularGradeId: studentId,
            grade: null,
          },
        ]),
      );
      setLockedStudents((current) => ({ ...current, [studentId]: true }));
      toast({ title: "Sucesso", description: "Nota resetada com sucesso." });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Erro ao resetar",
        description: getErrorMessage(error, "Erro ao resetar a nota."),
      });
    } finally {
      setSavingStudents((current) => current.filter((id) => id !== studentId));
    }
  }

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

    setSavingStudents(
      changedItems.map((item) => item.studentCurricularGradeId),
    );

    try {
      await mutation.mutateAsync(
        buildPayload(
          changedItems.map((item) => ({
            studentCurricularGradeId: item.studentCurricularGradeId,
            grade: Number(item.grade),
            observation: item.observation.trim() || undefined,
          })),
        ),
      );
      handleLockAll();
      toast({ title: "Sucesso", description: "Notas guardadas com sucesso." });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Erro ao guardar",
        description: getErrorMessage(error, "Erro ao guardar as notas."),
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

      {showDeadline && (
        <NoteLaunchDeadlineStatus
          status={gradesPeriodStatus}
          prompt={gradesPrompt}
          hasSpecialPermission={hasSpecialPermission}
          isPrivilegedUser={isPrivilegedUser}
        />
      )}

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

      <div className="space-y-5">
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
                disabled={
                  !hasCompleteFilters ||
                  !canOperateInPage ||
                  shouldBlockGradesActions
                }
                placeholder="Pesquisar por nome ou matrícula"
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasCompleteFilters ||
                  !canOperateInPage ||
                  shouldBlockGradesActions
                }
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Pesquisar</span>
              </Button>
            </div>
          </div>

          <div className="w-full md:w-32">
            <label className="mb-2 block text-sm font-medium">Por página</label>
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

        {summary && students.length > 0 && (
          <div className="flex flex-col gap-4 rounded-lg border px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
            <NoteLaunchSummary summary={summary} />

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={
                  shouldBlockGradesActions ||
                  isFetchingStudents ||
                  mutation.isPending
                }
                onClick={allUnlocked ? handleLockAll : handleUnlockAll}
              >
                {allUnlocked ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Fechar Todos os Cadeados
                  </>
                ) : (
                  <>
                    <LockOpen className="mr-2 h-4 w-4" />
                    Abrir Todos os Cadeados
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                disabled={
                  !hasUnsavedChanges ||
                  shouldBlockGradesActions ||
                  mutation.isPending
                }
                onClick={handleSaveMany}
              >
                Lançar Todos ({changedNotesCount})
              </Button>
            </div>
          </div>
        )}

        {!canOperateInPage ? (
          <div className="py-14 text-center text-muted-foreground">
            <Lock className="mx-auto mb-3 h-10 w-10" />
            <p>Você não tem permissão para lançar notas.</p>
          </div>
        ) : !hasCompleteFilters ? (
          <div className="py-14 text-center text-muted-foreground">
            <BookOpenCheck className="mx-auto mb-3 h-10 w-10" />
            <p>
              Selecione todos os filtros para consultar os estudantes e as
              notas.
            </p>
          </div>
        ) : shouldBlockGradesActions ? (
          <div className="py-14 text-center text-muted-foreground">
            <Lock className="mx-auto mb-3 h-10 w-10" />
            <p>O lançamento de notas está bloqueado pelo prazo académico.</p>
          </div>
        ) : isLoadingStudents ? (
          <div className="flex items-center justify-center gap-2 py-14 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />A carregar estudantes e
            notas...
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
            <p>Nenhum estudante encontrado para o contexto selecionado.</p>
          </div>
        ) : (
          <>
            <NoteLaunchTable
              students={students}
              editableNotes={editableNotes}
              disabled={
                shouldBlockGradesActions ||
                isFetchingStudents ||
                mutation.isPending
              }
              savingStudents={savingStudents}
              lockedStudents={lockedStudents}
              onGradeChange={handleGradeChange}
              onObservationChange={handleObservationChange}
              onSaveOne={handleSaveOne}
              onResetOne={handleResetOne}
              onToggleLock={handleToggleLock}
              isChanged={isNoteChanged}
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
      </div>
    </div>
  );
}

function teacherHasPermissionToLaunchNotes(
  permission: GetAssessmentNotasItem | null | undefined,
) {
  if (!permission) return false;

  const now = new Date();
  const start = new Date(permission.DATAINICIAL);
  const end = new Date(permission.DATAFIM);

  return now >= start && now <= end;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{
    message?: string | string[];
  }>;
  const responseMessage = axiosError.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(" ");
  }

  return responseMessage ?? axiosError.message ?? fallback;
}
