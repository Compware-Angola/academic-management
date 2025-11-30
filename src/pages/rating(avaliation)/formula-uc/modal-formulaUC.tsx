import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{data.disciplina}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            type="number"
            defaultValue={data.notaMinPratica ?? ""}
            placeholder="Nota mínima prática"
          />

          <Input
            type="number"
            defaultValue={data.notaMinPrimeiraFreq ?? ""}
            placeholder="Nota mínima 1ª freq."
          />

          <Input
            type="number"
            defaultValue={data.notaMinSegundaFreq ?? ""}
            placeholder="Nota mínima 2ª freq."
          />

          <Input
            type="number"
            defaultValue={data.pesoPratica ?? ""}
            placeholder="Peso prática"
          />

          <Input
            type="number"
            defaultValue={data.pesoPrimeiraFreq ?? ""}
            placeholder="Peso 1ª freq."
          />

          <Input
            type="number"
            defaultValue={data.pesoSegundaFreq ?? ""}
            placeholder="Peso 2ª freq."
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button>Salvar alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
