import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useMutationUpdateDefinirOral } from "@/hooks/avaliacao/use-mutation-update-definir-oral";
import { DefinirOral } from "@/services/avaliacao/fetch-oral";

type Props = {
  open: boolean;
  onClose: () => void;
  data: DefinirOral | null;
};

export function ModalDefinirOral({ open, onClose, data }: Props) {
  const mutation = useMutationUpdateDefinirOral();

  if (!data) return null;

  async function handleToggle() {
    await mutation.mutateAsync({
      codigoGrade: data.codigoGrade,
      habilitar: !data.habilitar,
    });

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status da Oral</DialogTitle>
        </DialogHeader>

        <p className="mt-4">
          Disciplina:
          <strong className="ml-2">{data.disciplina}</strong>
        </p>

        <p className="mt-2">
          Status atual:
          <strong className="ml-2">
            {data.habilitar ? "Habilitado" : "Desabilitado"}
          </strong>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button disabled={mutation.isPending} onClick={handleToggle}>
            {mutation.isPending
              ? "Salvando..."
              : data.habilitar
              ? "Desativar"
              : "Ativar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
