import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { FormMultiSelect } from "@/components/common/FormMultiSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationCreateExamMarking } from "@/hooks/post-graduation/use-mutation-create-exam-marking";
import { useQueryExamMarkingOptions } from "@/hooks/post-graduation/use-query-exam-marking-options";
import { formatDateOnlyPt } from "@/util/date-formate";

type CreateExamMarkingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  initialCourseId?: number;
};

type FormState = {
  courseId: string;
  curricularGradeId: string;
  scheduleId: string;
  termId: string;
  examTypeId: string;
  modalityId: string;
  roomId: string;
  periodId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  invigilatorUserIds: string[];
};

const emptyForm: FormState = {
  courseId: "",
  curricularGradeId: "",
  scheduleId: "",
  termId: "",
  examTypeId: "",
  modalityId: "",
  roomId: "",
  periodId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  invigilatorUserIds: [],
};

export function CreateExamMarkingModal({
  open,
  onOpenChange,
  academicYearId,
  degreeId,
  semesterId,
  initialCourseId,
}: CreateExamMarkingModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const createExamMarking = useMutationCreateExamMarking();
  const { data, isLoading, isError, error } = useQueryExamMarkingOptions({
    academicYearId,
    degreeId,
    semesterId,
  });
  const options = data?.data;

  useEffect(() => {
    if (!open) return;

    setForm({
      ...emptyForm,
      courseId: initialCourseId ? String(initialCourseId) : "",
    });
  }, [initialCourseId, open]);

  const curricularUnits = useMemo(
    () =>
      (options?.curricularUnits ?? []).filter(
        (item) => item.courseId === Number(form.courseId),
      ),
    [form.courseId, options?.curricularUnits],
  );
  const schedules = useMemo(
    () =>
      (options?.schedules ?? []).filter(
        (item) =>
          item.courseId === Number(form.courseId) &&
          item.curricularGradeId === Number(form.curricularGradeId),
      ),
    [
      form.courseId,
      form.curricularGradeId,
      options?.schedules,
    ],
  );
  const openTerms = useMemo(
    () => (options?.terms ?? []).filter((term) => term.isOpen),
    [options?.terms],
  );
  const selectedTerm = openTerms.find(
    (term) => term.id === Number(form.termId),
  );

  function updateField(field: keyof FormState, value: string | string[]) {
    setForm((current) => {
      if (field === "courseId") {
        return {
          ...current,
          courseId: String(value),
          curricularGradeId: "",
          scheduleId: "",
          periodId: "",
        };
      }

      if (field === "curricularGradeId") {
        return {
          ...current,
          curricularGradeId: String(value),
          scheduleId: "",
          periodId: "",
        };
      }

      if (field === "scheduleId") {
        const schedule = schedules.find(
          (item) => item.id === Number(value),
        );

        return {
          ...current,
          scheduleId: String(value),
          periodId: schedule?.periodId
            ? String(schedule.periodId)
            : "",
        };
      }

      return { ...current, [field]: value };
    });
  }

  const hasRequiredFields =
    Number(form.courseId) > 0 &&
    Number(form.curricularGradeId) > 0 &&
    Number(form.scheduleId) > 0 &&
    Number(form.termId) > 0 &&
    Number(form.examTypeId) > 0 &&
    Number(form.modalityId) > 0 &&
    Number(form.roomId) > 0 &&
    Number(form.periodId) > 0 &&
    Boolean(form.examDate) &&
    Boolean(form.startTime) &&
    Boolean(form.endTime);
  const hasValidTime =
    Boolean(form.startTime) &&
    Boolean(form.endTime) &&
    form.endTime > form.startTime;

  function handleSubmit() {
    if (!hasRequiredFields || !hasValidTime) return;

    createExamMarking.mutate(
      {
        degreeId,
        academicYearId,
        semesterId,
        courseId: Number(form.courseId),
        curricularGradeId: Number(form.curricularGradeId),
        scheduleId: Number(form.scheduleId),
        termId: Number(form.termId),
        examTypeId: Number(form.examTypeId),
        modalityId: Number(form.modalityId),
        roomId: Number(form.roomId),
        periodId: Number(form.periodId),
        examDate: form.examDate,
        startTime: form.startTime,
        endTime: form.endTime,
        invigilatorUserIds: form.invigilatorUserIds.map(Number),
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Marcar prova</DialogTitle>
          <DialogDescription>
            Registe uma prova para um horário em que está associado como
            docente.
          </DialogDescription>
        </DialogHeader>

        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível carregar as opções</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && openTerms.length === 0 && (
          <Alert>
            <AlertTitle>Sem prazo aberto</AlertTitle>
            <AlertDescription>
              Não existe prazo de marcação activo para o grau, ano lectivo e
              semestre seleccionados.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 xl:grid-cols-4">
          <FormSelect
            label="Curso"
            value={form.courseId}
            options={options?.courses ?? []}
            loading={isLoading}
            disabled={isLoading || isError}
            placeholder="Seleccione o curso"
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => updateField("courseId", value)}
          />

          <FormSelect
            label="Unidade Curricular"
            value={form.curricularGradeId}
            options={curricularUnits}
            disabled={!form.courseId || isLoading}
            placeholder="Seleccione a UC"
            map={(item) => ({
              key: item.curricularGradeId,
              value: item.curricularGradeId,
              label: item.designation,
            })}
            onChange={(value) =>
              updateField("curricularGradeId", value)
            }
          />

          <FormSelect
            label="Horário"
            value={form.scheduleId}
            options={schedules}
            disabled={!form.curricularGradeId || isLoading}
            placeholder="Seleccione o horário"
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => updateField("scheduleId", value)}
          />

          <FormSelect
            label="Tipo de Época"
            value={form.termId}
            options={openTerms}
            disabled={isLoading || openTerms.length === 0}
            placeholder="Seleccione a época"
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.assessmentType ?? `Prazo ${item.id}`,
            })}
            onChange={(value) => updateField("termId", value)}
          />

          <FormSelect
            label="Tipo de Prova"
            value={form.examTypeId}
            options={options?.examTypes ?? []}
            disabled={isLoading}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => updateField("examTypeId", value)}
          />

          <FormSelect
            label="Modalidade"
            value={form.modalityId}
            options={options?.modalities ?? []}
            disabled={isLoading}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => updateField("modalityId", value)}
          />

          <FormSelect
            label="Sala"
            value={form.roomId}
            options={options?.rooms ?? []}
            disabled={isLoading}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: `${item.designation}${
                item.capacity ? ` (${item.capacity} lugares)` : ""
              }`,
            })}
            onChange={(value) => updateField("roomId", value)}
          />

          <FormSelect
            label="Período"
            value={form.periodId}
            options={options?.periods ?? []}
            disabled
            placeholder="Definido pelo horário"
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => updateField("periodId", value)}
          />

          <div className="space-y-2">
            <Label htmlFor="post-graduation-exam-date">
              Data da Prova
            </Label>
            <Input
              id="post-graduation-exam-date"
              type="date"
              value={form.examDate}
              min={selectedTerm?.startDate}
              max={selectedTerm?.endDate}
              disabled={!selectedTerm}
              onChange={(event) =>
                updateField("examDate", event.target.value)
              }
            />
            {selectedTerm && (
              <p className="text-xs text-muted-foreground">
                Período: {formatDateOnlyPt(selectedTerm.startDate)} a{" "}
                {formatDateOnlyPt(selectedTerm.endDate)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-graduation-start-time">
              Hora de Início
            </Label>
            <Input
              id="post-graduation-start-time"
              type="time"
              step="60"
              value={form.startTime}
              onChange={(event) =>
                updateField("startTime", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-graduation-end-time">
              Hora de Término
            </Label>
            <Input
              id="post-graduation-end-time"
              type="time"
              step="60"
              value={form.endTime}
              onChange={(event) =>
                updateField("endTime", event.target.value)
              }
            />
            {form.startTime && form.endTime && !hasValidTime && (
              <p className="text-xs text-destructive">
                A hora de término deve ser posterior à hora de início.
              </p>
            )}
          </div>

          <FormMultiSelect
            label="Vigilantes"
            values={form.invigilatorUserIds}
            options={options?.invigilators ?? []}
            loading={isLoading}
            placeholder="Até dois vigilantes"
            search
            map={(item) => ({
              key: item.id,
              value: String(item.id),
              label: item.name,
            })}
            onChange={(values) => {
              if (values.length <= 2) {
                updateField("invigilatorUserIds", values);
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={createExamMarking.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={
              isLoading ||
              isError ||
              openTerms.length === 0 ||
              !hasRequiredFields ||
              !hasValidTime ||
              createExamMarking.isPending
            }
            onClick={handleSubmit}
          >
            {createExamMarking.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Marcar prova
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
