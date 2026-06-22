import { useEffect, useMemo, useState } from "react";

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
import { useMutationUpdateCurricularUnitFormula } from "@/hooks/post-graduation/use-mutation-update-curricular-unit-formula";
import { PostGraduationCurricularUnitFormula } from "@/services/post-graduation/fetch-curricular-unit-formulas.service";

type FormulaFormState = {
  minimumPracticalGrade: string;
  practicalWeight: string;
  minimumFirstFrequencyGrade: string;
  firstFrequencyWeight: string;
  minimumSecondFrequencyGrade: string;
  secondFrequencyWeight: string;
};

type EditCurricularUnitFormulaModalProps = {
  open: boolean;
  formula: PostGraduationCurricularUnitFormula | null;
  onOpenChange: (open: boolean) => void;
};

const emptyForm: FormulaFormState = {
  minimumPracticalGrade: "",
  practicalWeight: "",
  minimumFirstFrequencyGrade: "",
  firstFrequencyWeight: "",
  minimumSecondFrequencyGrade: "",
  secondFrequencyWeight: "",
};

function toInputValue(value: number | null) {
  return value === null ? "" : String(value);
}

export function EditCurricularUnitFormulaModal({
  open,
  formula,
  onOpenChange,
}: EditCurricularUnitFormulaModalProps) {
  const [form, setForm] = useState<FormulaFormState>(emptyForm);
  const mutation = useMutationUpdateCurricularUnitFormula();

  useEffect(() => {
    if (!formula) {
      setForm(emptyForm);
      return;
    }

    setForm({
      minimumPracticalGrade: toInputValue(formula.minimumPracticalGrade),
      practicalWeight: toInputValue(formula.practicalWeight),
      minimumFirstFrequencyGrade: toInputValue(
        formula.minimumFirstFrequencyGrade,
      ),
      firstFrequencyWeight: toInputValue(formula.firstFrequencyWeight),
      minimumSecondFrequencyGrade: toInputValue(
        formula.minimumSecondFrequencyGrade,
      ),
      secondFrequencyWeight: toInputValue(formula.secondFrequencyWeight),
    });
  }, [formula]);

  const parsedValues = useMemo(
    () => ({
      minimumPracticalGrade: Number(form.minimumPracticalGrade),
      practicalWeight: Number(form.practicalWeight),
      minimumFirstFrequencyGrade: Number(
        form.minimumFirstFrequencyGrade,
      ),
      firstFrequencyWeight: Number(form.firstFrequencyWeight),
      minimumSecondFrequencyGrade: Number(
        form.minimumSecondFrequencyGrade,
      ),
      secondFrequencyWeight: Number(form.secondFrequencyWeight),
    }),
    [form],
  );

  const hasEmptyFields = Object.values(form).some(
    (value) => value.trim() === "",
  );
  const hasInvalidNumbers = Object.values(parsedValues).some(
    (value) => !Number.isFinite(value),
  );
  const hasInvalidGrades = [
    parsedValues.minimumPracticalGrade,
    parsedValues.minimumFirstFrequencyGrade,
    parsedValues.minimumSecondFrequencyGrade,
  ].some((value) => value < 0 || value > 20);
  const hasInvalidWeights = [
    parsedValues.practicalWeight,
    parsedValues.firstFrequencyWeight,
    parsedValues.secondFrequencyWeight,
  ].some((value) => value < 0 || value > 100);
  const totalWeight =
    parsedValues.practicalWeight +
    parsedValues.firstFrequencyWeight +
    parsedValues.secondFrequencyWeight;
  const hasValidTotalWeight =
    !hasEmptyFields &&
    !hasInvalidNumbers &&
    Math.abs(totalWeight - 100) <= 0.001;
  const isFormValid =
    !hasEmptyFields &&
    !hasInvalidNumbers &&
    !hasInvalidGrades &&
    !hasInvalidWeights &&
    hasValidTotalWeight;

  function handleChange(field: keyof FormulaFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!formula || !isFormValid) return;

    try {
      await mutation.mutateAsync({
        formulaId: formula.formulaId,
        payload: parsedValues,
      });

      onOpenChange(false);
    } catch {
      // O hook apresenta a mensagem do backend e o modal permanece aberto.
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) return;
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar formula da UC</DialogTitle>
          <DialogDescription>{formula?.curricularUnit}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <FormulaField
            id="minimum-practical-grade"
            label="Nota minima da pratica"
            value={form.minimumPracticalGrade}
            max={20}
            disabled={mutation.isPending}
            onChange={(value) =>
              handleChange("minimumPracticalGrade", value)
            }
          />
          <FormulaField
            id="practical-weight"
            label="Peso da pratica (%)"
            value={form.practicalWeight}
            max={100}
            disabled={mutation.isPending}
            onChange={(value) => handleChange("practicalWeight", value)}
          />
          <FormulaField
            id="minimum-first-frequency-grade"
            label="Nota minima da primeira frequencia"
            value={form.minimumFirstFrequencyGrade}
            max={20}
            disabled={mutation.isPending}
            onChange={(value) =>
              handleChange("minimumFirstFrequencyGrade", value)
            }
          />
          <FormulaField
            id="first-frequency-weight"
            label="Peso da primeira frequencia (%)"
            value={form.firstFrequencyWeight}
            max={100}
            disabled={mutation.isPending}
            onChange={(value) =>
              handleChange("firstFrequencyWeight", value)
            }
          />
          <FormulaField
            id="minimum-second-frequency-grade"
            label="Nota minima da segunda frequencia"
            value={form.minimumSecondFrequencyGrade}
            max={20}
            disabled={mutation.isPending}
            onChange={(value) =>
              handleChange("minimumSecondFrequencyGrade", value)
            }
          />
          <FormulaField
            id="second-frequency-weight"
            label="Peso da segunda frequencia (%)"
            value={form.secondFrequencyWeight}
            max={100}
            disabled={mutation.isPending}
            onChange={(value) =>
              handleChange("secondFrequencyWeight", value)
            }
          />
        </div>

        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            hasValidTotalWeight
              ? "border-green-600/40 text-green-700 dark:text-green-400"
              : "border-destructive/40 text-destructive"
          }`}
        >
          Peso total: {Number.isFinite(totalWeight) ? totalWeight : 0}%
          {!hasValidTotalWeight && " - a soma deve ser igual a 100%."}
        </div>

        {(hasInvalidGrades || hasInvalidWeights) && (
          <p className="text-sm text-destructive">
            As notas devem estar entre 0 e 20 e os pesos entre 0 e 100.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isFormValid || mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FormulaFieldProps = {
  id: string;
  label: string;
  value: string;
  max: number;
  disabled: boolean;
  onChange: (value: string) => void;
};

function FormulaField({
  id,
  label,
  value,
  max,
  disabled,
  onChange,
}: FormulaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        max={max}
        step="0.01"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
