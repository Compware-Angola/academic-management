import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";

import { Save, X, Loader2 } from "lucide-react";

import { useMutationUpdateVagas } from "@/hooks/academiccalendar/useMutation-update-vagas";

type EditVagaModalProps = {
  open: boolean;
  onClose: () => void;
  idVaga: number;
  numeroVagasAtual: number;
};

export function EditVagaModal({
  open,
  onClose,
  idVaga,
  numeroVagasAtual,
}: EditVagaModalProps) {
  const [numeroVagas, setNumeroVagas] = useState(numeroVagasAtual);

  const { mutateAsync, isPending } = useMutationUpdateVagas();

  useEffect(() => {
    setNumeroVagas(numeroVagasAtual);
  }, [numeroVagasAtual]);

  const handleSaveVaga = async () => {
    await mutateAsync({ id: idVaga, num_vagas: numeroVagas });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar número de vagas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input */}
          <div>
            <Label>Número de vagas</Label>
            <Input
              type="number"
              min={0}
              value={numeroVagas}
              disabled={isPending}
              onChange={(e) => setNumeroVagas(Number(e.target.value))}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button onClick={handleSaveVaga} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Atualizar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
