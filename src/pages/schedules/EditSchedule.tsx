import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FormSelect } from "@/components/common/FormSelect";
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
import { AulasOcupadasPorDia } from "@/services/horario/fetch-aulas-ocupadas.service";
import { useQueryAulasOcupadas } from "@/hooks/horario/use-query-aulas-ocupadas";
const requiredFields = [
  { key: "designacao", label: "Designação do Horário" },
  { key: "capacidade", label: "Capacidade" },
  { key: "anoLetivo", label: "Ano Letivo" },
  { key: "semestre", label: "Semestre" },
  { key: "periodo", label: "Período" },
  { key: "curso", label: "Curso" },
  { key: "docente", label: "Docente" },
  { key: "tipoAula", label: "Tipo de Aula" },
  { key: "sala", label: "Sala" },
  { key: "unidadeCurricular", label: "Unidade Curricular" },
  { key: "modalidade", label: "Modalidade" },
];

const isEmpty = (v: unknown) => v === null || v === undefined || v === "";
/* ------------------------------------------------------------------ */

export function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const scheduleId = Number(id);
  const updateSchedule = useUpdateSchedule();

  /* ------------------------- FORM STATE ------------------------- */

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

  /* ------------------------- QUERIES ------------------------- */

  const { data, isLoading, isError } = useQueryScheduleDetails(scheduleId);

  const { data: academicYear = [] } = useQueryAnoAcademico();
  const { data: semestres = [] } = useQuerySemestres();
  const { data: periodos = [] } = useQueryPeriod();
  const { data: cursos = [] } = useCursos();
  const { data: modalidade = [] } = useQueryModalidade();

  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: formData.curso,
      classe: formData.classes,
      semestre: formData.semestre,
    });

  const { data: temposDisponiveis = [] } = useQueryTemposDisponiveis({
    anoLectivo: Number(formData.anoLetivo),
    periodo: Number(formData.periodo),
  });
  const { data: designacao, isLoading: isLoadindeNextScheduleDesignation } =
    useNextScheduleDesignation(
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
  const { data: teachers = [], isLoading: isLoadingTeacher } =
    useQueryTeacherByUC(formData.unidadeCurricular);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      designacao: designacao || "",
    }));
  }, [designacao]);
  const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
    anoLectivo: Number(formData.anoLetivo),

    tipoAula: Number(formData?.tipoAula),
    periodo: Number(formData?.periodo),
  });

  const { data: aulasOcupadas = [] } = useQueryAulasOcupadas({
    salaId: formData.sala,
    anoLectivo: formData.anoLetivo,
    periodo: formData.periodo,
  });
  const ocupadasSet = useMemo(
    () => mapOcupacaoPorChave(aulasOcupadas),
    [aulasOcupadas],
  );
  /* ------------------------- LOAD INICIAL ------------------------- */

  useEffect(() => {
    if (!data) return;

    const mapped = mapScheduleToFormData(data);
    console.log({ mapped });

    // 🔹 Campos independentes
    setFormData((prev) => ({
      ...prev,
      anoLetivo: mapped.anoLetivo,
      semestre: mapped.semestre,
      periodo: mapped.periodo,
      curso: mapped.curso,
      modalidade: mapped.modalidade,
      apenasPrimeiroAno: mapped.apenasPrimeiroAno,
      designacao: mapped.designacao,
      capacidade: mapped.capacidade,
      sala: mapped.sala,
      tipoAula: mapped.tipoAula,
      docente: mapped.docente || "",
    }));

    // 🔹 Campos dependentes (guardados)
    setPendingSelects({
      classes: mapped.classes,
      unidadeCurricular: mapped.unidadeCurricular,
    });

    // 🔹 Aulas
    const slots: AulaPayload[] = mapBackendAulasToGrid(data.aulas) ?? [];

    setAulas(slots);
  }, [data]);
  console.log({ aulas });
  /* ------------------------- APPLY CLASSES ------------------------- */

  useEffect(() => {
    if (!pendingSelects.classes) return;
    if (isLoadingClasses) return;

    const exists = classes.some(
      (c) => String(c.codigo) === pendingSelects.classes,
    );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        classes: pendingSelects.classes!,
      }));

      setPendingSelects((p) => ({ ...p, classes: undefined }));
    }
  }, [classes, isLoadingClasses, pendingSelects.classes]);

  /* ------------------------- APPLY UC ------------------------- */

  useEffect(() => {
    if (!pendingSelects.unidadeCurricular) return;
    if (isLoadingUC) return;

    const exists = unidadesCurriculares.some(
      (u) => String(u.pk) === pendingSelects.unidadeCurricular,
    );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        unidadeCurricular: pendingSelects.unidadeCurricular!,
      }));

      setPendingSelects((p) => ({ ...p, unidadeCurricular: undefined }));
    }
  }, [unidadesCurriculares, isLoadingUC, pendingSelects.unidadeCurricular]);

  /* ------------------------- SAVE ------------------------- */

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
        aulas,
      },
    });

    toast({ title: "Horário atualizado com sucesso" });
    navigate("/horarios/listar");
  };

  /* ------------------------- UI ------------------------- */
  const isFormComplete =
    requiredFields.every(
      (f) => !isEmpty(formData[f.key as keyof typeof formData]),
    ) && aulas.length > 0;
  if (isLoading) {
    return (
      <div className="p-6 flex items-center gap-2">
        <Loader2 className="animate-spin" /> Carregando horário…
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">Erro ao carregar horário</div>;
  }

  return (
    <form onSubmit={handleSave} className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Editar Horário</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <FormSelect
          label="Ano Letivo"
          value={formData.anoLetivo}
          options={academicYear}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
            value: String(a.codigo),
          })}
          onChange={(v) => setFormData((p) => ({ ...p, anoLetivo: v }))}
        />

        <FormSelect
          label="Semestre"
          value={formData.semestre}
          options={semestres}
          map={(s) => ({
            key: s.codigo,
            label: s.designacao,
            value: String(s.codigo),
          })}
          onChange={(v) => setFormData((p) => ({ ...p, semestre: v }))}
        />

        <FormSelect
          label="Período"
          value={formData.periodo}
          options={periodos}
          map={(p) => ({
            key: p.codigo,
            label: p.designacao,
            value: String(p.codigo),
          })}
          onChange={(v) => setFormData((p) => ({ ...p, periodo: v }))}
        />

        <FormSelect
          label="Curso"
          value={formData.curso}
          options={cursos}
          map={(c) => ({
            key: c.codigo,
            label: c.designacao,
            value: String(c.codigo),
          })}
          onChange={(v) =>
            setFormData((p) => ({
              ...p,
              curso: v,
              classes: "",
              unidadeCurricular: "",
            }))
          }
        />

        <FormSelect
          label="Ano Curricular"
          value={formData.classes}
          options={classes}
          loading={isLoadingClasses}
          map={(c) => ({
            key: c.codigo,
            label: c.designacao,
            value: String(c.codigo),
          })}
          onChange={(v) =>
            setFormData((p) => ({ ...p, classes: v, unidadeCurricular: "" }))
          }
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
          map={(m) => ({
            key: m.pkModalidade,
            label: m.designacao,
            value: String(m.pkModalidade),
          })}
          onChange={(v) => setFormData((p) => ({ ...p, modalidade: v }))}
        />
        <FormSelect
          label="Reservada para novos estudantes"
          value={formData.apenasPrimeiroAno}
          options={onlyFirstYear}
          map={(o) => ({
            key: o.value,
            label: o.label,
            value: o.value,
          })}
          onChange={(v) =>
            setFormData((prev) => ({ ...prev, apenasPrimeiroAno: v }))
          }
        />
        <div className="space-y-1">
          <Label htmlFor="designacao">Designação</Label>

          <div className="relative">
            <Input
              id="designacao"
              readOnly
              disabled={isLoadindeNextScheduleDesignation}
              value={formData.designacao}
              placeholder={
                isLoadindeNextScheduleDesignation
                  ? "A gerar designação automaticamente…"
                  : "Designação do horário"
              }
              className="pr-10"
            />

            {isLoadindeNextScheduleDesignation && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            A designação é gerada automaticamente com base no curso, UC e
            modalidade.
          </p>
        </div>

        <div>
          <Label>Capacidade</Label>
          <Input
            type="number"
            value={formData.capacidade}
            onChange={(e) =>
              setFormData((p) => ({ ...p, capacidade: e.target.value }))
            }
          />
        </div>
        <FormSelect
          label="Docente"
          value={formData.docente}
          disabled={isLoadingTeacher}
          onChange={(v) => setFormData({ ...formData, docente: v })}
          options={teachers}
          map={(t) => ({
            key: t.pk,
            label: t.nomeCompleto,
            value: t.pk,
          })}
          loading={isLoadingTeacher}
        />
        <div>
          <Label>Tipo de Aula</Label>
          <Select
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
        <Button
          type="submit"
          disabled={!isFormComplete || updateSchedule.isPending}
        >
          {updateSchedule.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {updateSchedule.isPending ? "A guardar..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

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

function extrairAnoCurricular(texto: string) {
  const match = texto.match(/^(\d+)/);
  return match ? match[1] : "";
}
const onlyFirstYear = [
  { value: 0, label: "Sim" },
  { value: 1, label: "Não" },
];
const STOP_WORDS = ["e", "de", "do", "da", "dos", "das"];
function gerarSiglaCurso(nome: string) {
  return nome
    .split(" ")
    .filter((p) => !STOP_WORDS.includes(p.toLowerCase()))
    .map((p) => p[0].toUpperCase())
    .join("");
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
