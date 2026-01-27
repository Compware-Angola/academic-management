import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMutationUpdateFormulaUC } from "@/hooks/avaliacao/use-mutation-update-formula-uc";

export type FormulaUC = {
  codigo: number;
  disciplina: string;

  notaMinPratica: number | null;
  notaMinPrimeiraFreq: number | null;
  notaMinSegundaFreq: number | null;

  pesoPratica: number | null;
  pesoPrimeiraFreq: number | null;
  pesoSegundaFreq: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: FormulaUC | null;
};

export function ModalFormulaUC({ open, onClose, data }: Props) {
  const mutation = useMutationUpdateFormulaUC();

  const [form, setForm] = useState({
    notaMinPratica: null as number | null,
    pesoPratica: null as number | null,

    notaMinPrimeiraFreq: null as number | null,
    pesoPrimeiraFreq: null as number | null,

    notaMinSegundaFreq: null as number | null,
    pesoSegundaFreq: null as number | null,
  });

  // ✅ Preenche o formulário quando abre o modal
  useEffect(() => {
    if (!data) return;

    setForm({
      notaMinPratica: data.notaMinPratica,
      pesoPratica: data.pesoPratica,

      notaMinPrimeiraFreq: data.notaMinPrimeiraFreq,
      pesoPrimeiraFreq: data.pesoPrimeiraFreq,

      notaMinSegundaFreq: data.notaMinSegundaFreq,
      pesoSegundaFreq: data.pesoSegundaFreq,
    });
  }, [data]);

  function handleChange(key: keyof typeof form, value: string) {
    const result = value.trim() === "" ? null : Number(value);

    setForm((prev) => ({
      ...prev,
      [key]: result,
    }));
  }

  // ✅ só é válido se TODOS os campos tiverem valor
  const isFormValid = Object.values(form).every(
    (value) => value !== null && !Number.isNaN(value)
  );

  async function handleSave() {
    if (!data) return;

    if (!isFormValid) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    const payload: any = {
      codigo: data.codigo,
    };

    // envia apenas campos alterados
    (Object.keys(form) as Array<keyof typeof form>).forEach((key) => {
      if (form[key] !== data[key]) {
        payload[key] = form[key];
      }
    });

    await mutation.mutateAsync(payload);
    onClose();
  }

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar fórmula — {data.disciplina}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            type="number"
            placeholder="Nota mín. prática"
            value={form.notaMinPratica ?? ""}
            onChange={(e) => handleChange("notaMinPratica", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Peso prática"
            value={form.pesoPratica ?? ""}
            onChange={(e) => handleChange("pesoPratica", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Nota mín. 1ª freq."
            value={form.notaMinPrimeiraFreq ?? ""}
            onChange={(e) =>
              handleChange("notaMinPrimeiraFreq", e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Peso 1ª freq."
            value={form.pesoPrimeiraFreq ?? ""}
            onChange={(e) => handleChange("pesoPrimeiraFreq", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Nota mín. 2ª freq."
            value={form.notaMinSegundaFreq ?? ""}
            onChange={(e) => handleChange("notaMinSegundaFreq", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Peso 2ª freq."
            value={form.pesoSegundaFreq ?? ""}
            onChange={(e) => handleChange("pesoSegundaFreq", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={mutation.isPending || !isFormValid}
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
