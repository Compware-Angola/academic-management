import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";

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

export type EditAcademicActivityForm = {
  codigo: number;
  designacao: string;
  codigo_ano_lectivo: string;
  codigo_tipo_candidatura: number;
  codigo_tipo_calendario: number;
  tipo_candidatura: string;
  tipo_calendario: string;
  data_inicio: string;
  data_fim: string;
};

type EditAcademicActivityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: EditAcademicActivityForm | null;
  setForm: Dispatch<SetStateAction<EditAcademicActivityForm | null>>;
  academicYears: AnoAcademico[];
  isSubmitting: boolean;
  validationError: string;
  onSubmit: () => void;
};

export function EditAcademicActivityModal({
  open,
  onOpenChange,
  form,
  setForm,
  academicYears,
  isSubmitting,
  validationError,
  onSubmit,
}: EditAcademicActivityModalProps) {
  if (!form) return null;

  const activeAcademicYears = academicYears.filter((year) =>
    year.estado?.toLowerCase().includes("activ"),
  );

  function updateForm(
    field:
      | "designacao"
      | "codigo_ano_lectivo"
      | "data_inicio"
      | "data_fim",
    value: string,
  ) {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar atividade letiva</DialogTitle>
          <DialogDescription>
            Atualize os dados permitidos da atividade de Pós-Graduação.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activity-description">Descrição *</Label>
            <Input
              id="activity-description"
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
            <Label htmlFor="activity-degree">Grau</Label>
            <Input
              id="activity-degree"
              value={form.tipo_candidatura}
              disabled
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activity-calendar-type">
              Tipo de Calendário
            </Label>
            <Input
              id="activity-calendar-type"
              value={form.tipo_calendario}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-start-date">Data de início *</Label>
            <Input
              id="activity-start-date"
              type="date"
              value={form.data_inicio}
              onChange={(event) =>
                updateForm("data_inicio", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-end-date">Data de término *</Label>
            <Input
              id="activity-end-date"
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
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Guardar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
