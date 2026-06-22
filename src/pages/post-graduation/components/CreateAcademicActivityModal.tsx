import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnoAcademico } from "@/services/fetch-anos-academico";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import { TipoCalendario } from "@/services/academiccalendar/fetch-type-calendar";

export type CreateAcademicActivityForm = {
  designacao: string;
  codigo_ano_lectivo: string;
  codigo_tipo_candidatura: string;
  codigo_tipo_calendario: string;
  data_inicio: string;
  data_fim: string;
};

type CreateAcademicActivityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateAcademicActivityForm;
  setForm: Dispatch<SetStateAction<CreateAcademicActivityForm>>;
  academicYears: AnoAcademico[];
  degrees: PostGraduationDegree[];
  calendarTypes: TipoCalendario[];
  isLoadingCalendarTypes: boolean;
  isSubmitting: boolean;
  validationError: string;
  onSubmit: () => void;
};

export function CreateAcademicActivityModal({
  open,
  onOpenChange,
  form,
  setForm,
  academicYears,
  degrees,
  calendarTypes,
  isLoadingCalendarTypes,
  isSubmitting,
  validationError,
  onSubmit,
}: CreateAcademicActivityModalProps) {
  const activeAcademicYears = academicYears.filter((year) =>
    year.estado?.toLowerCase().includes("activ"),
  );

  function updateForm(
    field: keyof CreateAcademicActivityForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova atividade letiva</DialogTitle>
          <DialogDescription>
            Cadastre uma atividade para Mestrado ou Doutoramento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="new-activity-description">Descrição *</Label>
            <Input
              id="new-activity-description"
              value={form.designacao}
              onChange={(event) =>
                updateForm("designacao", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ano Lectivo *</Label>
            <Select
              value={form.codigo_ano_lectivo}
              onValueChange={(value) =>
                updateForm("codigo_ano_lectivo", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano lectivo" />
              </SelectTrigger>
              <SelectContent>
                {activeAcademicYears.map((year) => (
                  <SelectItem
                    key={year.codigo}
                    value={String(year.codigo)}
                  >
                    {year.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Candidatura *</Label>
            <Select
              value={form.codigo_tipo_candidatura}
              onValueChange={(value) =>
                updateForm("codigo_tipo_candidatura", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grau" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem
                    key={degree.id}
                    value={String(degree.id)}
                  >
                    {degree.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <FormCommandSelect
              label="Tipo de Calendário *"
              value={form.codigo_tipo_calendario}
              onChange={(value) =>
                updateForm("codigo_tipo_calendario", value)
              }
              options={calendarTypes}
              map={(calendarType) => ({
                key: calendarType.codigo,
                label: calendarType.designacao,
                value: calendarType.codigo,
              })}
              placeholder={
                isLoadingCalendarTypes ? "Carregando..." : "Selecione"
              }
              disabled={isLoadingCalendarTypes}
              width="full"
              isLoading={isLoadingCalendarTypes}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-activity-start-date">
              Data de início *
            </Label>
            <Input
              id="new-activity-start-date"
              type="date"
              value={form.data_inicio}
              onChange={(event) =>
                updateForm("data_inicio", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-activity-end-date">
              Data de término *
            </Label>
            <Input
              id="new-activity-end-date"
              type="date"
              value={form.data_fim}
              onChange={(event) =>
                updateForm("data_fim", event.target.value)
              }
            />
          </div>
        </div>

        {validationError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar atividade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
