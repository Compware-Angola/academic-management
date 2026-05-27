import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryScheduleDetails } from "@/hooks/horario/use-query-schedule-details";
import { useUpdateSchedule } from "@/hooks/horario/use-update-schedule";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
import { useQueryTemposDisponiveis } from "@/hooks/tempos/use-query-tempos-disponiveis";
import ScheduleGridEdit from "./components/ScheduleGridEdit";
import { AulaPayload } from "@/services/horario/save-horario.service";
import { useNextScheduleDesignation } from "@/hooks/horario/use-next-schedule-designation";
import { useQueryTeacherByUC } from "@/hooks/teacher/use-query-teacher-uc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryTipoDeSalas } from "@/hooks/salas/use-query-tipo-de-sala";
import { useAvailableRooms } from "@/hooks/salas/use-rooms-avaliable";
import { useQueryAulasOcupadas } from "@/hooks/horario/use-query-aulas-ocupadas";
import { isBlank } from "@/util/is-blank";
import { useQueryScheduleCreationPrompt } from "@/hooks/academiccalendar/use-query-schedule-creation-prompt";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Lottie from "lottie-react";
import BlockDocument from "@/assets/blockdocument.json";
import { CourseSelectTestIsaac } from "@/components/common/global-selects/isaac-teste";
import { FormSelect } from "@/components/common/FormSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { parseFilter } from "@/util/parse-filter";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/auth/permission.helper";
import { useQueryAdditionalInformation } from "@/hooks/teacher/use-query-teacher-profile";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Roles {
  Reitor: boolean;
  Vice_Reitor: boolean;
  Acessor_do_Reitor: boolean;
  Director: boolean;
  Coordenador: boolean;
  Decano: boolean;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const requiredFields = [
  { key: "designacao", label: "Designação do Horário" },
  { key: "anoLetivo", label: "Ano Letivo" },
  { key: "semestre", label: "Semestre" },
  { key: "periodo", label: "Período" },
  { key: "curso", label: "Curso" },
  { key: "tipoAula", label: "Tipo de Aula" },
  { key: "sala", label: "Sala" },
  { key: "unidadeCurricular", label: "Unidade Curricular" },
  { key: "modalidade", label: "Modalidade" },
];

const onlyFirstYear = [
  { value: 0, label: "Sim" },
  { value: 1, label: "Não" },
];

const STOP_WORDS = ["e", "de", "do", "da", "dos", "das"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function gerarSiglaCurso(nome: string) {
  return nome
    .split(" ")
    .filter((p) => !STOP_WORDS.includes(p.toLowerCase()))
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function extrairAnoCurricular(texto: string) {
  const match = texto.match(/^(\d+)/);
  return match ? match[1] : "";
}

function mapScheduleToFormData(schedule: any) {
  const primeiraAula = schedule.aulas?.[0];
  return {
    anoLetivo: String(schedule.fk_ano_lectivo || ""),
    semestre: String(schedule.semestre || ""),
    periodo: String(schedule.periodo || ""),
    curso: String(schedule.cursoId || ""),
    classes: extrairAnoCurricular(schedule.ano || ""),
    unidadeCurricular: String(schedule.unidadeCurricularId || ""),
    modalidade: String(primeiraAula?.modalidadeId || ""),
    docente: String(primeiraAula?.docenteId || ""),
    tipoAula: String(primeiraAula?.tipoAulaId || ""),
    sala: String(primeiraAula?.salaid || ""),
    apenasPrimeiroAno: schedule.ano?.startsWith("1") ? "0" : "1",
    designacao: schedule.designacao || "",
    capacidade: String(schedule.capacidade || ""),
  };
}

function mapBackendAulasToGrid(aulasBackend: any[]): AulaPayload[] {
  if (!aulasBackend) return [];
  return aulasBackend
    .filter((a) => a.ativo)
    .map((a) => ({
      diaSemana: a.diaSemanaId,
      ordemTempo: a.ordem,
      hora_inicio: a.horaInicio,
      hora_fim: a.horaTermino,
      obs: a.observacoes ?? "",
    }));
}

function mapOcupacaoPorChave(aulas: any[]) {
  const ocupadas = new Set<string>();
  aulas.forEach((dia) => {
    dia.tempos.forEach((tempo: any) => {
      const key = `${dia.diaSemana.pkDiaDaSemana}-${tempo.ordem_tempo}`;
      ocupadas.add(key);
    });
  });
  return ocupadas;
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scheduleId = Number(id);

  const updateSchedule = useUpdateSchedule();

  // ─── Auth & Roles ─────────────────────────────────────────────────────────
  const { user: userData } = useAuth();
  const { haveFullAccess } = usePermission();
  const roles = userData?.roles as Roles | undefined;

  const isDirector: boolean = roles?.Director === true;
  const isPrivilegedUser: boolean =
    haveFullAccess() ||
    roles?.Reitor === true ||
    roles?.Vice_Reitor === true ||
    roles?.Acessor_do_Reitor === true ||
    roles?.Coordenador === true ||
    roles?.Decano === true;

  const canOperateInPage: boolean = isPrivilegedUser || isDirector;

  // ─── Form State ───────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    modalidade: "",
    apenasPrimeiroAno: "1",
    designacao: "",
    capacidade: "",
    docente: "",
    tipoAula: "",
    sala: "",
  });

  const [aulas, setAulas] = useState<AulaPayload[]>([]);
  const [pendingSelects, setPendingSelects] = useState<{
    classes?: string;
    unidadeCurricular?: string;
  }>({});

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } = useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
    curso: formData.curso,
    classe: formData.classes,
    semestre: formData.semestre,
  });

  const { data: rawInfo, isPending: loadingInfo } = useQueryAdditionalInformation(isDirector, formData.anoLetivo);
  const info = useMemo(() => rawInfo, [JSON.stringify(rawInfo)]);

  const { filteredCursos, filteredClasses, allowedCursoIds } = useMemo(() => {
    if (!isDirector || !info || loadingInfo) {
      return { filteredCursos: cursos, filteredClasses: classes, allowedCursoIds: undefined };
    }

    const allowedCursoIds = Array.from(new Set(info.map((item: any) => item?.codigo_curso?.toString()).filter(Boolean)));
    const allowedClassIds = Array.from(new Set(info.map((item: any) => item?.codigo_classe?.toString()).filter(Boolean)));

    return {
      filteredCursos: allowedCursoIds.length ? cursos.filter((c) => allowedCursoIds.includes(c.codigo?.toString())) : cursos,
      filteredClasses: allowedClassIds.length ? classes.filter((c) => allowedClassIds.includes(c?.codigo?.toString())) : classes,
      allowedCursoIds,
    };
  }, [isDirector, info, cursos, classes]);

  const { data: initialDataSchedule, isLoading, isError } = useQueryScheduleDetails(scheduleId);

  const canEditThisSchedule = useMemo(() => {
    if (!isDirector) return true;
    if (!initialDataSchedule || !allowedCursoIds?.length) return false;
    return allowedCursoIds.includes(initialDataSchedule.cursoId?.toString());
  }, [isDirector, initialDataSchedule, allowedCursoIds]);

  const canOperate = canOperateInPage && canEditThisSchedule;

  const { data: academicYear } = useQueryAnoAcademico();
  const activeAcademicYear = academicYear?.find((year) => year.estado.toLowerCase() === "activo");
  const activeAcademicYearId = activeAcademicYear?.codigo;

  const { data: scheduleCreationPrompt } = useQueryScheduleCreationPrompt(
    activeAcademicYearId!,
    Number(formData.semestre)
  );

  const { data: semestres = [] } = useQuerySemestres();
  const { data: periodos = [] } = useQueryPeriod();
  const { data: modalidade = [] } = useQueryModalidade();
  const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
  const { data: teachers = [], isLoading: isLoadingTeacher } = useQueryTeacherByUC(formData.unidadeCurricular);
  const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
    anoLectivo: Number(formData.anoLetivo),
    tipoAula: Number(formData?.tipoAula),
    periodo: Number(formData?.periodo),
  });
  const { data: temposDisponiveis = [] } = useQueryTemposDisponiveis({
    anoLectivo: Number(formData.anoLetivo),
    periodo: Number(formData.periodo),
  });
  const { data: aulasOcupadas = [] } = useQueryAulasOcupadas({
    salaId: formData.sala,
    anoLectivo: formData.anoLetivo,
    periodo: formData.periodo,
    semestre: formData.semestre,
    horarioId: scheduleId,
  });

  const ocupadasSet = useMemo(() => mapOcupacaoPorChave(aulasOcupadas), [aulasOcupadas]);

  const { data: designacao } = useNextScheduleDesignation(
    {
      cursoSigla: formData.curso ? gerarSiglaCurso(cursos.find((c) => c.codigo.toString() === formData.curso)?.designacao || "") : undefined,
      ano: formData.classes,
      anoLectivo: Number(formData.anoLetivo),
      codigoUC: formData.unidadeCurricular ? unidadesCurriculares.find((c) => c.pk.toString() === formData.unidadeCurricular)?.codigo || "" : "",
      periodo: Number(formData.periodo),
    },
    initialDataSchedule ?
      initialDataSchedule.cursoId.toString() !== formData.curso ||
      initialDataSchedule.unidadeCurricularId.toFixed() !== formData.unidadeCurricular ||
      initialDataSchedule.semestre.toString() !== formData.semestre ||
      initialDataSchedule.periodo.toString() !== formData.periodo
      : false
  );

  // ─── Efeitos ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setFormData((prev) => ({ ...prev, designacao: designacao || "" }));
  }, [designacao]);

  useEffect(() => {
    if (!initialDataSchedule) return;
    const mapped = mapScheduleToFormData(initialDataSchedule);
    setFormData((prev) => ({ ...prev, ...mapped, docente: mapped.docente || "" }));
    setPendingSelects({ classes: mapped.classes, unidadeCurricular: mapped.unidadeCurricular });
    setAulas(mapBackendAulasToGrid(initialDataSchedule.aulas));
  }, [initialDataSchedule]);

  useEffect(() => {
    if (!pendingSelects.classes || isLoadingClasses) return;
    if (classes.some((c) => String(c.codigo) === pendingSelects.classes)) {
      setFormData((prev) => ({ ...prev, classes: pendingSelects.classes! }));
      setPendingSelects((p) => ({ ...p, classes: undefined }));
    }
  }, [classes, isLoadingClasses, pendingSelects.classes]);

  useEffect(() => {
    if (!pendingSelects.unidadeCurricular || isLoadingUC) return;
    if (unidadesCurriculares.some((u) => String(u.pk) === pendingSelects.unidadeCurricular)) {
      setFormData((prev) => ({ ...prev, unidadeCurricular: pendingSelects.unidadeCurricular! }));
      setPendingSelects((p) => ({ ...p, unidadeCurricular: undefined }));
    }
  }, [unidadesCurriculares, isLoadingUC, pendingSelects.unidadeCurricular]);

  // ─── Validação ────────────────────────────────────────────────────────────
  const isFormComplete = requiredFields.every((f) => !isBlank(formData[f.key as keyof typeof formData]));

  const validateForm = () => {
    for (const field of requiredFields) {
      if (isBlank(formData[field.key as keyof typeof formData])) {
        toast({ variant: "destructive", title: "Campo obrigatório", description: `Preencha: ${field.label}` });
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await updateSchedule.mutateAsync({
      id: scheduleId,
      payload: {
        anoLectivo: Number(formData.anoLetivo),
        semestre: Number(formData.semestre),
        periodo: Number(formData.periodo),
        curso: Number(formData.curso),
        unidadeCurricular: Number(formData.unidadeCurricular),
        modalidade: Number(formData.modalidade),
        designacao: formData.designacao,
        capacidade: Number(formData.capacidade),
        turma: Number(formData.classes),
        estadoHorario: 2,
        apenasPrimeiroAno: Number(formData.apenasPrimeiroAno),
        tipoAula: Number(formData.tipoAula),
        sala: Number(formData.sala),
        docente: parseFilter(formData.docente),
        aulas: aulas,
      },
    });

    toast({ title: "Horário atualizado com sucesso" });
    navigate("/horarios/listar");
  };

  const shouldCheckDeadline = !!formData.anoLetivo && !!formData.semestre;
  const isWithinPeriod = isPrivilegedUser || (scheduleCreationPrompt?.is_in_prazo ?? false);
  const isBlockedByDeadline = !isPrivilegedUser && shouldCheckDeadline && !isWithinPeriod;

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">Erro ao carregar horário</div>;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 space-y-6 p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar Horário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 1. Bloqueio por Permissão */}
      {!canOperate && loadingInfo && (
        <div className="text-center py-12 bg-card border rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">A carregar informações...</p>
          </div>
        </div>
      )}

      {!canOperate && !loadingInfo && !canEditThisSchedule && (
        <div className="text-center py-12 bg-card border rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Lottie animationData={BlockDocument} loop style={{ width: 300, height: 300 }} />
            <p className="text-sm text-muted-foreground">
              {isDirector && !canEditThisSchedule
                ? "Este horário pertence a um curso ao qual você não tem acesso."
                : "Você não tem permissão para editar horários."}
            </p>
          </div>
        </div>
      )}

      {/* 2. Bloqueio por Prazo */}
      {canOperate && isBlockedByDeadline && !loadingInfo && (
        <div className="text-center py-12 bg-card border rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Lottie animationData={BlockDocument} loop style={{ width: 300, height: 300 }} />
            <p className="text-sm text-muted-foreground">A edição de horários está bloqueada fora do prazo definido.</p>
          </div>
        </div>
      )}

      {/* 3. Formulário - Só aparece se não estiver bloqueado */}
      {canOperate && !isBlockedByDeadline && (
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Banner de Prazo */}
          {!isPrivilegedUser && (
            <>
              {!shouldCheckDeadline ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
                  Selecione o <strong>Ano Letivo</strong> e o <strong>Semestre</strong> para verificar o prazo.
                </div>
              ) : isWithinPeriod ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                  Dentro do prazo para edição de horários ✔
                </div>
              ) : null}
            </>
          )}

          <div className="grid md:grid-cols-4 gap-4">
            <FormSelect
              label="Ano Letivo"
              value={formData.anoLetivo}
              options={academicYear}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: String(a.codigo) })}
              onChange={(v) => setFormData((p) => ({ ...p, anoLetivo: v }))}
            />

            <FormSelect
              label="Semestre"
              value={formData.semestre}
              options={semestres}
              map={(s) => ({ key: s.codigo, label: s.designacao, value: String(s.codigo) })}
              onChange={(v) => setFormData((p) => ({ ...p, semestre: v }))}
            />

            <FormSelect
              label="Período"
              value={formData.periodo}
              options={periodos}
              map={(p) => ({ key: p.codigo, label: p.designacao, value: String(p.codigo) })}
              onChange={(v) => setFormData((p) => ({ ...p, periodo: v }))}
            />

            <CourseSelectTestIsaac
              value={formData.curso}
              disabled={formData.anoLetivo === "" || formData.semestre === ""}
              onChangeValue={(v) => setFormData((p) => ({ ...p, curso: v, classes: "", unidadeCurricular: "" }))}
              allowedIds={allowedCursoIds}
              cursos={filteredCursos}
              isLoading={loadingCursos}
            />

            <FormSelect
              label="Ano Curricular"
              value={formData.classes}
              options={filteredClasses}
              loading={isLoadingClasses}
              map={(c) => ({ key: c.codigo, label: c.designacao, value: String(c.codigo) })}
              onChange={(v) => setFormData((p) => ({ ...p, classes: v, unidadeCurricular: "" }))}
            />

            <FormSelect
              label="Unidade Curricular"
              value={formData.unidadeCurricular}
              options={unidadesCurriculares}
              loading={isLoadingUC}
              map={(u) => ({ key: u.pk, label: u.descricao, value: String(u.pk) })}
              onChange={(v) => setFormData((p) => ({ ...p, unidadeCurricular: v }))}
            />

            <FormSelect
              label="Modalidade"
              value={formData.modalidade}
              options={modalidade}
              map={(m) => ({ key: m.pkModalidade, label: m.designacao, value: String(m.pkModalidade) })}
              onChange={(v) => setFormData((p) => ({ ...p, modalidade: v }))}
            />

            <FormSelect
              label="Reservada para novos estudantes"
              value={formData.apenasPrimeiroAno}
              options={onlyFirstYear}
              map={(o) => ({ key: o.value, label: o.label, value: o.value })}
              onChange={(v) => setFormData((p) => ({ ...p, apenasPrimeiroAno: v }))}
            />

            <div className="space-y-1 md:col-span-2">
              <Label>Designação</Label>
              <Input value={formData.designacao} readOnly />
            </div>

            <div className="space-y-1">
              <Label>Capacidade</Label>
              <Input
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData((p) => ({ ...p, capacidade: e.target.value }))}
              />
            </div>

            <FormSelect
              label="Docente"
              value={formData.docente}
              options={teachers}
              map={(t) => ({ key: t.pk, label: t.nomeCompleto, value: t.pk })}
              onChange={(v) => setFormData((p) => ({ ...p, docente: v }))}
              loading={isLoadingTeacher}
            />

            <div>
              <Label>Tipo de Aula</Label>
              <Select value={formData.tipoAula} onValueChange={(v) => setFormData((p) => ({ ...p, tipoAula: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipoDeSalas.map((tipo) => (
                    <SelectItem key={tipo.pkTipoAula} value={tipo.pkTipoAula.toString()}>
                      {tipo.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormCommandSelect
                label="Sala"
                width="full"
                value={formData.sala}
                disabled={!formData.tipoAula}
                isLoading={isLoadingSala}
                placeholder="Selecione Sala"
                options={salas ?? []}
                map={(sala) => ({
                  key: sala.salaid,
                  value: sala.salaid.toString(),
                  label: sala.sala,
                })}
                onChange={(v) => setFormData((p) => ({ ...p, sala: v }))}
              />
            </div>
          </div>

          {temposDisponiveis.length > 0 && (
            <ScheduleGridEdit
              ocupadas={ocupadasSet}
              scheduleData={temposDisponiveis}
              aulasExistentes={aulas}
              onChange={setAulas}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button type="submit" disabled={!isFormComplete || updateSchedule.isPending}>
              {updateSchedule.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A guardar...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}