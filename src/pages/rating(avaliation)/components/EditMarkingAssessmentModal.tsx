import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import {
  useQueryMarkingAssesmentById,
  useQueryMarkingAssessment,
} from "@/hooks/avaliacao/use-query-marking-assessment";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useMutationCreateCalendar } from "@/hooks/avaliacao/use-mutation-create-calendar";
import { CreateCalendarPayload } from "@/services/avaliacao/create-calendario-prova";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { useToast } from "@/hooks/use-toast";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryMarcacaoProvaPrazo } from "@/hooks/prazos/use-query-marcacao-prazo";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryExamCreationPrompt } from "@/hooks/academiccalendar/use-query-exam-creation-prompt";
import { calcularDuracao } from "@/util/calcular-duracao";
import {
  DocenteSelected,
  DocenteVigilantePicker,
} from "./DocenteVigilantePicker";
import { buildVigilantesPayloads } from "./helpers";
import { formatarData, parseLocalDate } from "@/util/date-formate";
import { useMutateUpdateMarkingAssessment } from "@/hooks/avaliacao/use-mutation-update-marking-assessment";

type EditMarkingAssessmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  provaId?: number;
};

type Filters = {
  anoLetivo?: string;
  semestre?: string;
  periodo?: string;
  curso?: string;
  anoCurricular?: string;
  unidadeCurricular?: string;
  prazoId?: string;
  docente?: string;
  dataInicio?: string;
  modalidade?: string;
  tipoProva?: string;
  horarioId?: string;
  tipoCandidatura?: string;
  sala?: string;
  duracaoProva?: string;
  horaProva?: string;
  horaTermino?: string;
};
type ScheduleSelect = {
  id: number;
  label: string;
};
const isInvalid = (v?: string) => v === undefined || v.trim() === "";
export const formatData = (dataString: string): string => {
  if (!dataString) return "-";

  const date = parseLocalDate(dataString);

  if (isNaN(date.getTime())) return dataString;

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};
const formatTime = (time?: string) => {
  if (!time) return "";
  return time.substring(0, 5);
};
export default function EditMarkingAssessmentModal({
  isOpen,
  onClose,
  provaId,
}: EditMarkingAssessmentModalProps) {
  const { toast } = useToast();
  const {
    mutate: updateMarkingAssessment,
    isPending: isMarkingAssessmentLoadingCalendar,
  } = useMutateUpdateMarkingAssessment();

  const [filters, setFilters] = useState<Filters>({});
  const [teacher, setTeacher] = useState<DocenteSelected[]>([]);
  const [vigilantesEdited, setVigilantesEdited] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [markingSchedules, setMarkingSchedules] = useState<ScheduleSelect[]>(
    [],
  );

  const { data: provaData, isLoading: isLoadingProva } =
    useQueryMarkingAssesmentById(isOpen ? provaId : undefined);

  // Preenche os filtros assim que os dados chegam
  useEffect(() => {
    if (!provaData || hydrated) return;

    setFilters({
      anoLetivo: String(provaData.codigo_ano_lectivo),
      semestre: String(provaData.codigo_semestre),
      periodo: String(provaData.codigo_periodo),
      curso: String(provaData.codigo_curso),
      anoCurricular: String(provaData.codigo_classe),
      unidadeCurricular: String(provaData.codigo_grade),
      modalidade: String(provaData.codigo_modalidade),
      tipoProva: String(provaData.codigo_tipo_prova),
      prazoId: String(provaData?.codigo_prazo),
      tipoCandidatura: "1",
      sala: String(provaData.codigo_sala),
      horarioId: String(provaData.codigo_horario),
      dataInicio: provaData.data_prova,
      horaProva: formatTime(provaData.hora_prova),
      horaTermino: formatTime(provaData.hora_termino),
    });

    const docentesIniciais: DocenteSelected[] = provaData.vigilantes.map(
      (v) => ({
        nome: v.nome_vigilante,
        id: v.codigo_utilizador,
      }),
    );
    setTeacher(docentesIniciais);
    setMarkingSchedules([
      {
        id: provaData?.codigo_horario,
        label: provaData?.horario,
      },
    ]);
    setHydrated(true);
  }, [provaData, hydrated]);

  useEffect(() => {
    const duracao = calcularDuracao(filters.horaProva, filters.horaTermino);
    setFilters((prev) => ({
      ...prev,
      duracaoProva: duracao ?? "",
    }));
  }, [filters.horaProva, filters.horaTermino]);

  const { data: anosAcademicos, isLoading: isLoadingAnosAcademicos } =
    useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: modalidade = [], isLoading: isLoadingModalidade } =
    useQueryModalidade();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const { data: tipoCandidatura = [], isLoading: isLoadingTipoCandidatura } =
    useQueryTipoCandidatura();
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } =
    useQueryTipoProva();
  const { data: salas = [], isLoading: isLoadingSala } = useQuerySalas();
  const { data: period = [], isLoading: isLoadingPeriod } = useQueryPeriod();
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular,
    });
  const { data: prazos = [], isLoading: isLoadingPrazos } =
    useQueryMarcacaoProvaPrazo({
      anoLectivo: parseFilter(filters.anoLetivo),
      semestre: parseFilter(filters.semestre),
    });

  const tipoAvaliacaoPrazo = prazos.find(
    (p) => p.prazoid === Number(filters.prazoId),
  )?.tipoavaliacao;

  const { data: gradesCreationPrompt, isLoading: isLoadingGradesPrompt } =
    useQueryExamCreationPrompt({
      anoLectivo: parseFilter(filters.anoLetivo),
      semestre: parseFilter(filters.semestre),
      typeAvaliation: tipoAvaliacaoPrazo,
    });

  const gradesPeriodStatus = useMemo(() => {
    if (!filters.anoLetivo) return "NO_YEAR_SELECTED";
    if (isLoadingGradesPrompt) return "LOADING";
    if (!gradesCreationPrompt) return "NOT_DEFINED";

    const now = new Date();
    const start = new Date(gradesCreationPrompt.data_inicio);
    const end = new Date(gradesCreationPrompt.data_fim);

    return now >= start && now <= end ? "ALLOWED" : "OUT_OF_PERIOD";
  }, [filters.anoLetivo, gradesCreationPrompt, isLoadingGradesPrompt]);

  const shouldDisable =
    gradesPeriodStatus === "LOADING" ||
    gradesPeriodStatus === "NOT_DEFINED" ||
    gradesPeriodStatus === "OUT_OF_PERIOD" ||
    gradesPeriodStatus === "NO_YEAR_SELECTED";

  const isFormInvalid =
    isInvalid(filters.anoLetivo) ||
    isInvalid(filters.semestre) ||
    isInvalid(filters.curso) ||
    isInvalid(filters.unidadeCurricular) ||
    isInvalid(filters.dataInicio) ||
    isInvalid(filters.duracaoProva) ||
    isInvalid(filters.horaProva) ||
    isInvalid(filters.horaTermino);

  const closeModal = () => {
    setFilters({});
    setTeacher([]);
    setVigilantesEdited(false);
    setHydrated(false);
    onClose();
  };

  function getMissingFields(
    fields: Record<string, string | undefined>,
  ): string[] {
    return Object.entries(fields)
      .filter(([, value]) => isInvalid(value))
      .map(([label]) => label);
  }

  const handleEditCalendarioProva = () => {
    const missingFields = getMissingFields({
      "Ano letivo": filters.anoLetivo,
      Semestre: filters.semestre,
      Curso: filters.curso,
      "Unidade Curricular": filters.unidadeCurricular,
      "Data da prova": filters.dataInicio,
      "Duração da prova": filters.duracaoProva,
      "Hora de início": filters.horaProva,
      "Hora de término": filters.horaTermino,
    });

    if (missingFields.length > 0) {
      toast({
        title: "Erro",
        description: `Faltam preencher os seguintes campos:\n\n• ${missingFields.join("\n• ")}`,
        variant: "destructive",
      });
      return;
    }

    const payload = {
      codigoCalendario: provaId,
      codigoTipoProva: parseFilter(filters.tipoProva),
      codigoModalidade: parseFilter(filters.modalidade),
      codigoSala: parseFilter(filters.sala),
      //codigoPeriodo: parseFilter(filters.periodo),
      //codigoDisciplina: parseFilter(filters.unidadeCurricular),
      dataProva: filters.dataInicio,
      duracaoProva: parseFilter(filters.duracaoProva),
      horaProva: filters.horaProva,
      horaTermino: filters.horaTermino,
      url: "",
      //Horario: parseFilter(filters.horarioId),
      prazoId: parseFilter(filters.prazoId),
      //anoLectivo: parseFilter(filters.anoLetivo),
      //semestre: parseFilter(filters.semestre),
      vigilantes: vigilantesEdited
        ? buildVigilantesPayloads(teacher)
        : undefined,
    };

    updateMarkingAssessment(payload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl! w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl">
            Editar Marcação de Prova
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />

        {/* Loading inicial dos dados da prova */}
        {isLoadingProva && (
          <div className="flex items-center gap-2 bg-muted border rounded-lg p-4 text-sm">
            <Loader className="animate-spin size-4" />A carregar dados da
            prova...
          </div>
        )}

        {/* Banner de período — igual ao modal de criação */}
        {filters.anoLetivo && filters.semestre && tipoAvaliacaoPrazo && (
          <div className="space-y-2">
            {gradesPeriodStatus === "LOADING" && (
              <div className="bg-muted border rounded-lg p-4 text-sm">
                A verificar período de lançamento de notas...
              </div>
            )}

            {gradesPeriodStatus === "NOT_DEFINED" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-700">
                  Nenhum prazo definido para lançamento de notas
                </p>
                <p className="text-sm text-red-600">
                  Não existe um período configurado para{" "}
                  <strong>{gradesCreationPrompt?.tipo_avaliacao_nome}</strong>.
                  Contacte a administração.
                </p>
              </div>
            )}

            {gradesPeriodStatus === "OUT_OF_PERIOD" && gradesCreationPrompt && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <p className="font-semibold text-amber-800">
                  Fora do prazo —{" "}
                  {gradesCreationPrompt.tipo_avaliacao_nome ??
                    "Lançamento de Notas"}
                </p>
                <p className="text-sm text-amber-700">
                  Permitido de{" "}
                  <strong>
                    {new Date(
                      gradesCreationPrompt.data_inicio,
                    ).toLocaleDateString("pt-AO")}
                  </strong>{" "}
                  até{" "}
                  <strong>
                    {new Date(gradesCreationPrompt.data_fim).toLocaleDateString(
                      "pt-AO",
                    )}
                  </strong>
                </p>
              </div>
            )}

            {gradesPeriodStatus === "ALLOWED" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                Dentro do prazo para lançamento de notas ✔
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-full py-6 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormSelect
              label="Ano Letivo"
              disabled
              value={filters.anoLetivo}
              onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              options={anosAcademicos}
              loading={isLoadingAnosAcademicos || isLoadingProva}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />

            <FormSelect
              disabled
              label="Semestre"
              value={filters.semestre}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  semestre: v,
                  anoCurricular: undefined,
                  unidadeCurricular: undefined,
                })
              }
              options={semestres}
              loading={isLoadingProva}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
            />

            <FormSelect
              label="Período"
              value={filters.periodo}
              onChange={(v) => setFilters({ ...filters, periodo: v })}
              disabled
              options={period}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
              loading={isLoadingPeriod || isLoadingProva}
            />

            <CourseSelect
              value={filters.curso}
              disabled
              onChangeValue={(v) =>
                setFilters({ ...filters, curso: v, anoCurricular: "all" })
              }
            />

            <FormSelect
              disabled
              label="Ano Curricular"
              value={filters.anoCurricular}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  anoCurricular: v,
                  unidadeCurricular: undefined,
                })
              }
              options={anosCurriculares}
              loading={isLoadingProva}
              map={(ac) => ({
                key: ac.codigo,
                label: ac.designacao,
                value: ac.codigo,
              })}
            />

            <FormSelect
              label="Unidade Curricular"
              disabled
              value={filters.unidadeCurricular}
              onChange={(v) => setFilters({ ...filters, unidadeCurricular: v })}
              options={unidadesCurriculares}
              loading={isLoadingUC || isLoadingProva}
              map={(uc) => ({
                key: uc.pk,
                label: uc.descricao,
                value: uc.pk,
              })}
            />

            <FormSelect
              label="Modalidade"
              value={filters.modalidade}
              disabled={isLoadingModalidade || isLoadingProva}
              onChange={(v) => setFilters({ ...filters, modalidade: v })}
              options={modalidade}
              map={(m) => ({
                key: m.pkModalidade,
                label: m.designacao,
                value: m.pkModalidade,
              })}
              loading={isLoadingModalidade || isLoadingProva}
            />

            <FormSelect
              label="Tipo de Epoca"
              value={filters.prazoId}
              onChange={(v) => setFilters({ ...filters, prazoId: v })}
              options={prazos}
              loading={isLoadingPrazos || isLoadingProva}
              disabled={isLoadingPrazos || isLoadingProva}
              map={(u) => ({
                key: u.prazoid,
                label: u.designacao,
                value: u.prazoid,
              })}
            />

            <FormSelect
              label="Tipo de Prova"
              value={filters.tipoProva}
              disabled={isLoadingTipoProva || isLoadingProva}
              onChange={(v) => setFilters({ ...filters, tipoProva: v })}
              options={tipoProva}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
              loading={isLoadingTipoProva || isLoadingProva}
            />

            <FormSelect
              label="Tipo Candidatura"
              value={filters.tipoCandidatura}
              onChange={(v) => setFilters({ ...filters, tipoCandidatura: v })}
              options={tipoCandidatura}
              loading={isLoadingTipoCandidatura || isLoadingProva}
              disabled
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />

            <FormSelect
              label="Horarios"
              value={filters.horarioId}
              onChange={(v) => setFilters({ ...filters, horarioId: v })}
              options={markingSchedules}
              loading={isLoadingProva}
              disabled
              map={(u) => ({
                key: u.id,
                label: u.label,
                value: u.id,
              })}
            />

            <FormSelect
              label="Salas"
              value={filters.sala}
              onChange={(v) => setFilters({ ...filters, sala: v })}
              options={salas}
              loading={isLoadingSala || isLoadingProva}
              disabled={isLoadingSala || isLoadingProva}
              map={(u) => ({
                key: u.pk,
                label: u.descricao,
                value: u.pk,
              })}
            />

            <div className="space-y-2">
              <Label>Data da Prova</Label>
              <Input
                type="date"
                value={filters.dataInicio ?? ""}
                disabled={isLoadingProva}
                onChange={(e) =>
                  setFilters({ ...filters, dataInicio: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hora de Início</Label>
              <Input
                type="time"
                step="60"
                lang="pt-PT"
                value={filters.horaProva ?? ""}
                disabled={isLoadingProva}
                onChange={(e) =>
                  setFilters({ ...filters, horaProva: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hora de Término</Label>
              <Input
                type="time"
                step="60"
                lang="pt-PT"
                value={filters.horaTermino ?? ""}
                disabled={isLoadingProva}
                onChange={(e) =>
                  setFilters({ ...filters, horaTermino: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Duração da Prova (minutos)</Label>
              <Input
                disabled
                type="number"
                min={1}
                placeholder="Ex: 120"
                value={filters.duracaoProva ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, duracaoProva: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <DocenteVigilantePicker
              onChange={(v) => {
                setTeacher(v);
                setVigilantesEdited(true);
              }}
              values={teacher}
              max={10}
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => closeModal()} size="lg">
            Fechar
          </Button>
          <Button
            disabled={
              isMarkingAssessmentLoadingCalendar ||
              isFormInvalid ||
              shouldDisable ||
              gradesPeriodStatus !== "ALLOWED" ||
              isLoadingProva
            }
            onClick={handleEditCalendarioProva}
            size="lg"
          >
            {isMarkingAssessmentLoadingCalendar ? (
              <Loader className="animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
