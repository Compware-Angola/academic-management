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
import { ScheduleCreationPrompt } from "@/services/academiccalendar/get-schedule-creation-prompt";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { parseFilter } from "@/util/parse-filter";

/* -----------------------------------
   CONSTANTES E UTILS
----------------------------------- */

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

export default function CreateSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------- STATES ----------- */
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
  });

  const [aulas, setAulas] = useState<AulaPayload[]>([]);

  /* ---------- QUERIES ----------- */
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  // encontra o ano activo
  const activeAcademicYear = academicYear?.find(
    (year) => year.estado.toLowerCase() === "activo",
  );

  // extrai só o código
  const activeAcademicYearId = activeAcademicYear?.codigo;
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      anoLetivo: activeAcademicYearId?.toString() || "",
    }));
  }, [activeAcademicYearId]);
  // busca o prazo usando o código encontrado
  const {
    data: scheduleCreationPrompt,
    isLoading: isLoadingScheduleCreationPrompt,
  } = useQueryScheduleCreationPrompt(activeAcademicYearId!);
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
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const { data: temposDisponiveis = [] } = useQueryTemposDisponiveis({
    anoLectivo: Number(formData.anoLetivo),
    periodo: Number(formData.periodo),
  });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: formData.classes,
      curso: formData.curso,
      semestre: formData.semestre,
    });
  const { data: designacao } = useNextScheduleDesignation(
    formData.curso
      ? gerarSiglaCurso(
          cursos.find((c) => c.codigo.toString() === formData.curso)
            ?.designacao || "",
        )
      : undefined,
    formData.classes,
    formData.unidadeCurricular
      ? unidadesCurriculares.find(
          (c) => c.pk.toString() === formData.unidadeCurricular,
        )?.codigo || ""
      : "",
    Number(formData.periodo),
    Number(formData.anoLetivo),
  );

  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: modalidade = [], isLoading: isLoadingModalidade } =
    useQueryModalidade();

  const { data: aulasOcupadas = [] } = useQueryAulasOcupadas({
    salaId: formData.sala,
    anoLectivo: formData.anoLetivo,
    periodo: formData.periodo,
  });

  const ocupadasSet = useMemo(
    () => mapOcupacaoPorChave(aulasOcupadas),
    [aulasOcupadas],
  );
  /* ---------- COLISÃO ----------- */

  const saveHorario = useSaveHorario();
  useEffect(() => {}, [formData, aulas]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      designacao: designacao || "",
    }));
  }, [designacao]);

  /* ---------- VALIDAR FORM ----------- */
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

  /* ---------- SUBMIT ----------- */
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
      capacidade: "",
      designacao: "",
      docente: "",
      tipoAula: "",
      sala: "",
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

    const aulasComConflito = aulas.filter((aula) => {
      const key = `${aula.diaSemana}-${aula.ordemTempo}`;
      return ocupadasSet.has(key);
    });

    if (aulasComConflito.length > 0) {
      toast({
        variant: "destructive",
        title: "Conflito de horários detectado",
        description: `${aulasComConflito.length} aula(s) foram removidas porque a sala já está ocupada nesse horário.`,
      });
    }

    if (aulasSemConflito.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma aula válida",
        description: "Remova os conflitos antes de guardar o horário.",
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

      toast({
        title: "Sucesso",
        description: "Horário criado com sucesso",
      });

      navigate("/horarios/listar");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar horário",
        description: "Verifique os dados e tente novamente",
      });
    }
  };

  if (isLoadingAcademicYear || isLoadingScheduleCreationPrompt) {
    return (
      <div className="flex justify-center items-center">
        <LucideLoader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const isWithinPeriod = isWithinScheduleCreationPeriod(scheduleCreationPrompt);

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {!scheduleCreationPrompt ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>
              Nenhum Prazo de Criação de Horários Definido
            </AlertTitle>
            <AlertDescription>
              Ainda não foi definido um período para criação de horários.
              Contacte a administração.
            </AlertDescription>
          </Alert>
        ) : !isWithinPeriod ? (
          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
              Fora do Prazo de Criação de Horários
            </AlertTitle>
            <AlertDescription>
              O período para criação de horários é de{" "}
              <strong>
                {new Date(
                  scheduleCreationPrompt.data_inicio,
                ).toLocaleDateString("pt-AO")}
              </strong>{" "}
              a{" "}
              <strong>
                {new Date(scheduleCreationPrompt.data_fim).toLocaleDateString(
                  "pt-AO",
                )}
              </strong>
              .
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid md:grid-cols-4 gap-4">
          {/* ANO */}
          <FormSelect
            disabled={isLoadingAcademicYear || !isWithinPeriod}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
            options={academicYear?.filter(
              (ay) => ay.estado.toLowerCase() === "activo",
            )}
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
              formData.anoLetivo === "" ||
              !isWithinPeriod
            }
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

          {/* SEMESTRE */}
          <FormSelect
            disabled={isLoadingSemestres || !isWithinPeriod}
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

          {/* CURSO */}

          <CourseSelect
            value={formData.curso}
            onChangeValue={(v) => {
              setFormData({
                ...formData,
                curso: v,
                unidadeCurricular: "",
                designacao: "",
                classes: "",
              });
            }}
          />

          <FormSelect
            label="Ano Curricular"
            value={formData.classes}
            disabled={isLoadingClasses || !formData.curso || !isWithinPeriod}
            onChange={(v) => setFormData({ ...formData, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={isLoadingClasses}
          />

          {/* PERÍODO */}

          {/* UC */}
          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            disabled={
              isLoadingUC ||
              !formData.semestre ||
              !formData.curso ||
              !formData.classes ||
              !isWithinPeriod
            }
            onChange={(v) =>
              setFormData({ ...formData, unidadeCurricular: v, designacao: "" })
            }
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.pk,
              label: u.descricao,
              value: u.pk,
            })}
            loading={isLoadingUC}
          />

          {/* MODALIDADE */}
          <FormSelect
            label="Modalidade"
            value={formData.modalidade}
            disabled={isLoadingModalidade || !isWithinPeriod}
            onChange={(v) => setFormData({ ...formData, modalidade: v })}
            options={modalidade}
            map={(m) => ({
              key: m.pkModalidade,
              label: m.designacao,
              value: m.pkModalidade,
            })}
            loading={isLoadingModalidade}
          />
          <FormSelect
            label="Reservada para novos estudantes"
            value={formData.apenasPrimeiroAno}
            disabled={!isWithinPeriod}
            onChange={(v) => setFormData({ ...formData, apenasPrimeiroAno: v })}
            options={onlyFirstYear}
            map={(m) => ({
              key: m.value,
              label: m.label,
              value: m.value,
            })}
          />
          <div className="">
            <Label>Designação do Horário</Label>
            <Input
              readOnly
              placeholder="Ex: Horário LEI 1º Ano - Manhã"
              value={formData.designacao}
              onChange={(e) =>
                setFormData({ ...formData, designacao: e.target.value })
              }
            />
          </div>

          {/* CAPACIDADE */}
          <div>
            <Label>Capacidade</Label>
            <Input
              disabled={!isWithinPeriod}
              type="number"
              min={0}
              placeholder="Ex: 40"
              value={formData.capacidade}
              onChange={(e) =>
                setFormData({ ...formData, capacidade: e.target.value })
              }
            />
          </div>
          <FormSelect
            label="Docente"
            value={formData.docente}
            disabled={isLoadingTeacher || !isWithinPeriod}
            onChange={(v) => setFormData({ ...formData, docente: v })}
            options={teachers}
            map={(t) => ({
              key: t.pk,
              label: t.nomeCompleto,
              value: t.pk,
            })}
            loading={isLoadingTeacher}
          />

          {/* TIPO DE AULA */}
          <div>
            <Label>Tipo de Aula</Label>
            <Select
              disabled={!isWithinPeriod}
              value={formData.tipoAula}
              onValueChange={(v) => setFormData({ ...formData, tipoAula: v })}
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Escolha o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipoDeSalas.map((tipo) => (
                  <SelectItem
                    key={tipo.pkTipoAula}
                    value={tipo.pkTipoAula.toString()}
                  >
                    {tipo.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SALA */}
          <div>
            <Label>Sala</Label>
            <Select
              disabled={!isWithinPeriod}
              value={formData.sala}
              onValueChange={(v) => setFormData({ ...formData, sala: v })}
            >
              <SelectTrigger
                disabled={Boolean(formData.tipoAula) === false || isLoadingSala}
                className="w-full "
              >
                <SelectValue
                  placeholder={
                    <>
                      {" "}
                      {isLoadingSala ? (
                        <span className="flex gap-2 items-center">
                          Carregando <Loader2 className="animate-spin" />
                        </span>
                      ) : (
                        "Selecione Salas"
                      )}
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {salas?.map((sala) => (
                  <SelectItem key={sala.salaid} value={sala.salaid.toString()}>
                    {sala.sala}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* GRID DE HORÁRIOS */}
        {temposDisponiveis.length > 0 &&
          !!formData.anoLetivo &&
          !!formData.anoLetivo &&
          !!formData.periodo &&
          !!formData.semestre &&
          !!formData.unidadeCurricular &&
          !!formData.modalidade &&
          !!formData.sala && (
            <ScheduleGrid
              ocupadas={ocupadasSet}
              scheduleData={temposDisponiveis}
              onChange={setAulas}
            />
          )}

        {/* BOTÕES */}

        {isWithinPeriod && (
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigate("/horarios/listar");
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Listar Horário
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetHorario}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!isFormComplete || saveHorario.isPending}
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
        )}
      </form>
    </div>
  );
}
const onlyFirstYear = [
  { value: 1, label: "Sim" },
  { value: 0, label: "Não" },
];
const STOP_WORDS = ["e", "de", "do", "da", "dos", "das"];

function gerarSiglaCurso(nome: string) {
  return nome
    .split(" ")
    .filter((p) => !STOP_WORDS.includes(p.toLowerCase()))
    .map((p) => p[0].toUpperCase())
    .join("");
}

/**
 * Gera um Set com as chaves dos horários ocupados
 * Formato da chave: "diaId-horaInicio-horaFim"
 */
export function mapOcupacaoPorChave(aulas: AulasOcupadasPorDia[]) {
  const ocupadas = new Set<string>();

  aulas.forEach((dia) => {
    dia.tempos.forEach((tempo, index) => {
      // backend não manda ordem, então usamos índice + 1
      const ordem = index + 1;
      const key = `${dia.diaSemana.pkDiaDaSemana}-${ordem}`;
      ocupadas.add(key);
    });
  });

  return ocupadas;
}
function isWithinScheduleCreationPeriod(
  prompt: ScheduleCreationPrompt | null | undefined,
) {
  if (!prompt) return false;

  const now = new Date();
  const start = new Date(prompt.data_inicio);
  const end = new Date(prompt.data_fim);

  return now >= start && now <= end;
}
