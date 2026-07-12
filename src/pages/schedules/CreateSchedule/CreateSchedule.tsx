import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  X,
  Loader2,
  List,
  AlertTriangle,
  LucideLoader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import ScheduleGrid from "./ScheduleGrid";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryTemposDisponiveis } from "@/hooks/tempos/use-query-tempos-disponiveis";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { FormSelect } from "../../../components/common/FormSelect";
import { useSaveHorario } from "@/hooks/horario/use-save-horario";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
import {
  AulaPayload,
  SaveHorarioPayload,
} from "@/services/horario/save-horario.service";
import { Input } from "@/components/ui/input";
import { useNextScheduleDesignation } from "@/hooks/horario/use-next-schedule-designation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryTeacherByUC } from "@/hooks/teacher/use-query-teacher-uc";
import { useQueryTipoDeSalas } from "@/hooks/salas/use-query-tipo-de-sala";
import { useAvailableRooms } from "@/hooks/salas/use-rooms-avaliable";
import { isBlank } from "@/util/is-blank";
import { useQueryAulasOcupadas } from "@/hooks/horario/use-query-aulas-ocupadas";
import { AulasOcupadasPorDia } from "@/services/horario/fetch-aulas-ocupadas.service";
import { useQueryScheduleCreationPrompt } from "@/hooks/academiccalendar/use-query-schedule-creation-prompt";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { parseFilter } from "@/util/parse-filter";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/auth/permission.helper";
import { useQueryAdditionalInformation } from "@/hooks/teacher/use-query-teacher-profile";
import Lottie from "lottie-react";
import BlockDocument from "@/assets/blockdocument.json";
import { CourseSelectTestIsaac } from "@/components/common/global-selects/isaac-teste";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";

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
  { value: 1, label: "Sim" },
  { value: 0, label: "Não" },
];

const STOP_WORDS = ["e", "de", "do", "da", "dos", "das"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gerarSiglaCurso(nome: string) {
  return nome
    .split(" ")
    .filter((p) => !STOP_WORDS.includes(p.toLowerCase()))
    .map((p) => p[0].toUpperCase())
    .join("");
}

export function mapOcupacaoPorChave(aulas: AulasOcupadasPorDia[]) {
  const ocupadas = new Set<string>();
  aulas.forEach((dia) => {
    dia.tempos.forEach((tempo) => {
      const key = `${dia.diaSemana.pkDiaDaSemana}-${tempo.ordem_tempo}`;
      ocupadas.add(key);
    });
  });
  return ocupadas;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CreateSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ─── Auth & roles ─────────────────────────────────────────────────────────
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
    unidadeCurricular: "",
    modalidade: "",
    classes: "",
    apenasPrimeiroAno: "",
    designacao: "",
    capacidade: "",
    docente: "",
    tipoAula: "",
    sala: "",
    tipoCandidatura: "1",
  });

  const { data: rawInfo } = useQueryAdditionalInformation(
    isDirector,
    formData.anoLetivo,
  );

  const info = useMemo(() => rawInfo, [JSON.stringify(rawInfo)]);

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: cursos, isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: formData.classes,
      curso: formData.curso,
      semestre: formData.semestre,
    });

  const { filteredCursos, filteredClasses, allowedCursoIds } = useMemo(() => {
    if (!isDirector || !info) {
      return {
        filteredCursos: cursos ?? [],
        filteredClasses: classes,
        allowedCursoIds: undefined,
      };
    }

    const allowedCursoIds = Array.from(
      new Set(
        info
          .filter((item: any) => item?.codigo_curso != null)
          .map((item: any) => item?.codigo_curso?.toString()),
      ),
    );

    const allowedClassIds = Array.from(
      new Set(
        info
          .filter((item: any) => item?.codigo_classe != null)
          .map((item: any) => item?.codigo_classe?.toString()),
      ),
    );

    const filteredCursos = allowedCursoIds.length
      ? (cursos ?? []).filter((c) =>
        allowedCursoIds.includes(c.codigo?.toString()),
      )
      : (cursos ?? []);

    const filteredClasses = allowedClassIds.length
      ? classes.filter((c) =>
        allowedClassIds.includes(c?.codigo?.toString()),
      )
      : classes;

    return { filteredCursos, filteredClasses, allowedCursoIds };
  }, [isDirector, info, cursos, classes]);

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const activeAcademicYear = academicYear?.find(
    (year) => year.estado.toLowerCase() === "activo",
  );
  const activeAcademicYearId = activeAcademicYear?.codigo;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      anoLetivo: activeAcademicYearId?.toString() || "",
    }));
  }, [activeAcademicYearId]);

  const {
    data: scheduleCreationPrompt,
    isLoading: isLoadingScheduleCreationPrompt,
  } = useQueryScheduleCreationPrompt(
    activeAcademicYearId!,
    Number(formData.semestre),
    {
      enabled: !!activeAcademicYearId && !!formData.semestre,
    }
  );

  const shouldCheckDeadline = !!formData.anoLetivo && !!formData.semestre;
  const isWithinPeriod: boolean =
    isPrivilegedUser || scheduleCreationPrompt?.is_in_prazo;

  // ─── Outras Queries ───────────────────────────────────────────────────────
  const { data: teachers = [], isLoading: isLoadingTeacher } =
    useQueryTeacherByUC(formData.unidadeCurricular);
  const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
    anoLectivo: Number(formData.anoLetivo),
    tipoAula: Number(formData?.tipoAula),
    periodo: Number(formData?.periodo),
  });
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const { data: temposDisponiveis = [] } = useQueryTemposDisponiveis({
    anoLectivo: Number(formData.anoLetivo),
    periodo: Number(formData.periodo),
  });
  const { data: modalidade = [], isLoading: isLoadingModalidade } =
    useQueryModalidade();
  const { data: aulasOcupadas = [] } = useQueryAulasOcupadas({
    salaId: formData.sala,
    anoLectivo: formData.anoLetivo,
    periodo: formData.periodo,
    semestre: formData.semestre,
  });

  const ocupadasSet = useMemo(
    () => mapOcupacaoPorChave(aulasOcupadas),
    [aulasOcupadas],
  );

  const { data: designacao } = useNextScheduleDesignation(
    {
      cursoSigla: formData.curso
        ? gerarSiglaCurso(
          cursos?.find((c) => c.codigo.toString() === formData.curso)
            ?.designacao || "",
        )
        : undefined,
      ano: formData.classes,
      codigoUC: formData.unidadeCurricular
        ? unidadesCurriculares.find(
          (c) => c.pk.toString() === formData.unidadeCurricular,
        )?.codigo || ""
        : "",
      periodo: Number(formData.periodo),
      anoLectivo: Number(formData.anoLetivo),
    },
    true,
  );

  // ─── State ────────────────────────────────────────────────────────────────
  const [aulas, setAulas] = useState<AulaPayload[]>([]);
  const saveHorario = useSaveHorario();

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      designacao: designacao || "",
    }));
  }, [designacao]);

  // ─── Validação ────────────────────────────────────────────────────────────
  const validateForm = () => {
    for (const field of requiredFields) {
      if (isBlank(formData[field.key as keyof typeof formData])) {
        toast({
          variant: "destructive",
          title: "Campo obrigatório",
          description: `Preencha: ${field.label}`,
        });
        return false;
      }
    }
    if (!aulas.length) {
      toast({
        variant: "destructive",
        title: "Horário vazio",
        description: "Selecione pelo menos uma aula.",
      });
      return false;
    }
    return true;
  };

  const isFormComplete =
    requiredFields.every(
      (f) => !isBlank(formData[f.key as keyof typeof formData]),
    ) && aulas.length > 0;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleResetHorario = () => {
    setFormData({
      anoLetivo: "",
      semestre: "",
      periodo: "",
      curso: "",
      unidadeCurricular: "",
      modalidade: "",
      classes: "",
      apenasPrimeiroAno: "",
      designacao: "",
      capacidade: "",
      docente: "",
      tipoAula: "",
      sala: "",
      tipoCandidatura: "1",
    });
    setAulas([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const aulasSemConflito = aulas.filter((aula) => {
      const key = `${aula.diaSemana}-${aula.ordemTempo}`;
      return !ocupadasSet.has(key);
    });

    if (aulasSemConflito.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma aula válida",
        description: "Todos os horários selecionados estão em conflito.",
      });
      return;
    }

    const payload: SaveHorarioPayload = {
      anoLectivo: Number(formData.anoLetivo),
      semestre: Number(formData.semestre),
      periodo: Number(formData.periodo),
      curso: Number(formData.curso),
      unidadeCurricular: Number(formData.unidadeCurricular),
      modalidade: Number(formData.modalidade),
      aulas: aulasSemConflito,
      apenasPrimeiroAno: parseFilter(formData.apenasPrimeiroAno),
      capacidade: Number(formData.capacidade),
      designacao: formData.designacao,
      estadoHorario: 2,
      docente: parseFilter(formData.docente),
      tipoAula: Number(formData.tipoAula),
      sala: Number(formData.sala),
      turma: 0,
      obs: "",
    };

    try {
      await saveHorario.mutateAsync(payload);
      toast({ title: "Sucesso", description: "Horário criado com sucesso" });
      navigate("/horarios/listar");
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar horário",
        description: "Verifique os dados e tente novamente",
      });
    }
  };
  const isDisabledForm = !isPrivilegedUser && (!scheduleCreationPrompt || !scheduleCreationPrompt?.is_in_prazo || isLoadingPeriodos || formData.anoLetivo === "" || formData.semestre === "")

  // ─── Loading Inicial ──────────────────────────────────────────────────────
  if (isLoadingAcademicYear || isLoadingScheduleCreationPrompt) {
    return (
      <div className="flex justify-center items-center h-96">
        <LucideLoader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Criar Horário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Banner Privilegiado */}
      {isPrivilegedUser && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800 text-sm flex items-center gap-2">
          <span className="h-2 w-2 bg-purple-500 rounded-full" />
          Acesso privilegiado — criação de horários sem restrição de prazo.
        </div>
      )}

      {!canOperateInPage ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Lottie
              animationData={BlockDocument}
              loop={true}
              style={{ width: 300, height: 300 }}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Você não tem permissão para criar horários.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ALERTAS DE PRAZO */}
          {!isPrivilegedUser && (
            <>
              {!shouldCheckDeadline ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-500 rounded-full" />
                  Selecione o <strong>Ano Letivo</strong> e o <strong>Semestre</strong> para verificar o prazo de criação.
                </div>
              ) : !scheduleCreationPrompt ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Nenhum Prazo de Criação de Horários Definido</AlertTitle>
                  <AlertDescription>
                    Ainda não foi definido um período para criação de horários neste semestre.
                    Contacte a administração.
                  </AlertDescription>
                </Alert>
              ) : !scheduleCreationPrompt?.is_in_prazo ? (
                <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
                    Fora do Prazo de Criação de Horários
                  </AlertTitle>
                  <AlertDescription>
                    O período para criação de horários é de{" "}
                    <strong>
                      {new Date(scheduleCreationPrompt.data_inicio).toLocaleDateString("pt-AO")}
                    </strong>{" "}
                    a{" "}
                    <strong>
                      {new Date(scheduleCreationPrompt.data_fim).toLocaleDateString("pt-AO")}
                    </strong>
                    .
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full" />
                  Dentro do prazo para criação de horários ✔
                </div>
              )}
            </>
          )}

          {/* FORMULÁRIO - Sempre visível */}

          <div className="grid md:grid-cols-4 gap-4">
            <TipoCandidaturaSelect
              value={formData.tipoCandidatura}
              onChangeValue={(v) => setFormData({ ...formData, tipoCandidatura: v })}
            />
            <AcademicYearSelect
              onlyActive
              enableDefaultActiveYear
              tipoCandidaturaId={parseFilter(formData.tipoCandidatura)}
              value={formData.anoLetivo}
              onChangeValue={(v) => setFormData({ ...formData, anoLetivo: v })}
            />
            <SemestreSelect
              value={formData.semestre}
              onChangeValue={(v) => setFormData({ ...formData, semestre: v })}
            />
            <FormSelect
              disabled={isLoadingPeriodos || isDisabledForm}
              loading={isLoadingPeriodos}
              label="Período"
              value={formData.periodo}
              onChange={(v) => setFormData({ ...formData, periodo: v })}
              options={periodos}
              map={(p) => ({ key: p.codigo, label: p.designacao, value: p.codigo })}
            />

            <CourseSelect
              params={{ tipoCandidaturaId: parseFilter(formData.tipoCandidatura) }}
              value={formData.curso}
              disabled={isLoadingPeriodos || isDisabledForm}
              onChangeValue={(v) => {
                setFormData({
                  ...formData,
                  curso: v,
                  unidadeCurricular: "",
                  designacao: "",
                  classes: "",
                });
              }}
              allowedIds={allowedCursoIds}
            />
            <AnoCurricularSelect
              curso={formData.curso}
              onChangeValue={(v) => setFormData({ ...formData, classes: v })}
              value={formData.classes}
              disabled={isLoadingClasses || isDisabledForm}
            />


            <FormSelect
              label="Unidade Curricular"
              value={formData.unidadeCurricular}
              disabled={isLoadingUC || isDisabledForm}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  unidadeCurricular: v,
                  designacao: "",
                })
              }
              options={unidadesCurriculares}
              map={(u) => ({ key: u.pk, label: u.descricao, value: u.pk })}
              loading={isLoadingUC}
            />

            <FormSelect
              label="Modalidade"
              value={formData.modalidade}
              disabled={isLoadingModalidade || isDisabledForm}
              onChange={(v) => setFormData({ ...formData, modalidade: v })}
              options={modalidade}
              map={(m) => ({ key: m.pkModalidade, label: m.designacao, value: m.pkModalidade })}
              loading={isLoadingModalidade}
            />

            <FormSelect
              label="Reservada para novos estudantes"
              value={formData.apenasPrimeiroAno}
              disabled={isLoadingModalidade || isDisabledForm}
              onChange={(v) => setFormData({ ...formData, apenasPrimeiroAno: v })}
              options={onlyFirstYear}
              map={(m) => ({ key: m.value, label: m.label, value: m.value })}
            />

            <div>
              <Label>Designação do Horário</Label>
              <Input
                readOnly
                placeholder="Ex: Horário LEI 1º Ano - Manhã"
                value={formData.designacao}
                onChange={(e) => setFormData({ ...formData, designacao: e.target.value })}
              />
            </div>

            <div>
              <Label>Capacidade</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ex: 40"
                disabled={isDisabledForm}
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
              />
            </div>

            <FormSelect
              label="Docente"
              value={formData.docente}
              disabled={isLoadingTeacher || isDisabledForm}
              onChange={(v) => setFormData({ ...formData, docente: v })}
              options={teachers}
              map={(t) => ({ key: t.pk, label: t.nomeCompleto, value: t.pk })}
              loading={isLoadingTeacher}
            />

            <div>
              <Label>Tipo de Aula</Label>
              <Select
                value={formData.tipoAula}
                onValueChange={(v) => setFormData({ ...formData, tipoAula: v })}
              >
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
                disabled={!formData.tipoAula || isDisabledForm}
                isLoading={isLoadingSala}
                placeholder={isLoadingSala ? "Carregando..." : "Selecione Salas"}
                options={salas ?? []}
                map={(sala) => ({
                  key: sala.salaid,
                  value: sala.salaid.toString(),
                  label: sala.sala,
                })}
                onChange={(v) => setFormData({ ...formData, sala: v })}
              />
            </div>
          </div>

          {/* GRID */}
          {temposDisponiveis.length > 0 &&
            !isDisabledForm &&
            !!formData.anoLetivo &&
            !!formData.periodo &&
            !!formData.semestre &&
            !!formData.unidadeCurricular &&
            !!formData.modalidade &&
            !!formData.tipoAula &&
            !!formData.sala && (
              <ScheduleGrid
                ocupadas={ocupadasSet}
                scheduleData={temposDisponiveis}
                onChange={setAulas}
              />
            )}

          {/* BOTÕES */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/horarios/listar")}
            >
              <List className="mr-2 h-4 w-4" />
              Listar Horário
            </Button>
            <Button type="button" variant="outline" onClick={handleResetHorario}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                !isFormComplete ||
                saveHorario.isPending ||
                (!isWithinPeriod && !isPrivilegedUser)
              }
            >
              {saveHorario.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar Horário
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}