import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useToast } from "@/hooks/use-toast";

import ScheduleGrid, { AulaPayload } from "./ScheduleGrid";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryTemposDisponiveis } from "@/hooks/tempos/use-query-tempos-disponiveis";
import { useQueryTeacherByUC } from "@/hooks/teacher/use-query-teacher-uc";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { FormSelect } from "../../../components/common/FormSelect";
import { useSaveHorario } from "@/hooks/horario/use-save-horario";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
import { SaveHorarioPayload } from "@/services/horario/save-horario.service";

/* -----------------------------------
   CONSTANTES E UTILS
----------------------------------- */

const requiredFields = [
  { key: "anoLetivo", label: "Ano Letivo" },
  { key: "semestre", label: "Semestre" },
  { key: "periodo", label: "Período" },
  { key: "curso", label: "Curso" },
  { key: "unidadeCurricular", label: "Unidade Curricular" },
  { key: "docente", label: "Docente" },
  { key: "modalidade", label: "Modalidade" },
];

const isEmpty = (v: unknown) => v === null || v === undefined || v === "";

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
    docente: "",
    modalidade: "",
    classes: "",
  });

  const [aulas, setAulas] = useState<AulaPayload[]>([]);

  const [isChecking, setIsChecking] = useState(false);
  const [hasCheckedCollisions, setHasCheckedCollisions] = useState(false);
  const [collisionMessage, setCollisionMessage] = useState("");

  /* ---------- QUERIES ----------- */
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
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

  const { data: teachers = [], isLoading: isLoadingTeacher } =
    useQueryTeacherByUC(formData.unidadeCurricular);
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: modalidade = [], isLoading: isLoadingModalidade } =
    useQueryModalidade();
  /* ---------- COLISÃO ----------- */

  const { mutate: salvarHorario, isPending } = useSaveHorario();
  useEffect(() => {
    setHasCheckedCollisions(false);
    setCollisionMessage("");
  }, [formData, aulas]);

  /* ---------- VALIDAR FORM ----------- */
  const validateForm = () => {
    for (const field of requiredFields) {
      if (isEmpty(formData[field.key as keyof typeof formData])) {
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
      (f) => !isEmpty(formData[f.key as keyof typeof formData])
    ) && aulas.length > 0;

  /* ---------- SUBMIT ----------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validação pendente",
        description: "Verifique todos os campos",
      });
      return;
    }

    const payload: SaveHorarioPayload = {
      anoLectivo: Number(formData.anoLetivo),
      semestre: Number(formData.semestre),
      periodo: Number(formData.periodo),
      curso: Number(formData.curso),
      unidadeCurricular: Number(formData.unidadeCurricular),
      docente: Number(formData.docente),
      modalidade: Number(formData.modalidade),
      tipoAula: aulas[0].tipoAula,
      aulas,
    };

    salvarHorario(payload);
    setFormData({
      anoLetivo: "",
      semestre: "",
      periodo: "",
      curso: "",
      unidadeCurricular: "",
      docente: "",
      modalidade: "",
      classes: "",
    });
    setAulas([]);
    setHasCheckedCollisions(false);
    setCollisionMessage("");
  };

  /* ---------- UI ----------- */
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
            <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Criar Horário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ALERTA DE COLISÃO */}
      {!!collisionMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{collisionMessage}</AlertDescription>
        </Alert>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GRID DE CAMPOS */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* ANO */}
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
            options={academicYear?.filter(
              (ay) => ay.estado.toLowerCase() === "activo"
            )}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
            })}
          />
          <FormSelect
            disabled={
              isLoadingPeriodos ||
              isLoadingAcademicYear ||
              formData.anoLetivo === ""
            }
            loading={isLoadingPeriodos}
            label="Período"
            value={formData.periodo}
            onChange={(v) => setFormData({ ...formData, periodo: v })}
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
            })}
          />

          {/* SEMESTRE */}
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
            })}
          />

          {/* CURSO */}
          <FormSelect
            disabled={isLoadingCurso}
            loading={isLoadingCurso}
            label="Curso"
            value={formData.curso}
            onChange={(v) => setFormData({ ...formData, curso: v })}
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
            })}
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
              !formData.classes
            }
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.pk,
              label: u.descricao,
            })}
            loading={isLoadingUC}
          />

          {/* DOCENTE */}
          <FormSelect
            label="Docente"
            value={formData.docente}
            disabled={isLoadingTeacher || !formData.unidadeCurricular}
            onChange={(v) => setFormData({ ...formData, docente: v })}
            options={teachers}
            map={(t) => ({
              key: t.pk,
              label: t.nomeCompleto,
            })}
            loading={isLoadingTeacher}
          />

          {/* MODALIDADE */}
          <FormSelect
            label="Modalidade"
            value={formData.modalidade}
            disabled={isLoadingModalidade}
            onChange={(v) => setFormData({ ...formData, modalidade: v })}
            options={modalidade}
            map={(m) => ({
              key: m.pkModalidade,
              label: m.designacao,
            })}
            loading={isLoadingModalidade}
          />
        </div>

        {/* GRID DE HORÁRIOS */}
        {temposDisponiveis.length > 0 &&
          !!formData.anoLetivo &&
          !!formData.anoLetivo &&
          !!formData.docente &&
          !!formData.periodo &&
          !!formData.semestre &&
          !!formData.unidadeCurricular &&
          !!formData.modalidade && (
            <ScheduleGrid
              scheduleData={temposDisponiveis}
              onChange={setAulas}
              anoLetivo={formData.anoLetivo}
              docente={formData.docente}
              periodo={formData.periodo}
              semestre={formData.semestre}
              unidadeCurricular={formData.unidadeCurricular}
            />
          )}

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/horarios")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>

          <Button type="submit" disabled={!isFormComplete || isPending}>
            {isPending ? (
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
    </div>
  );
}
