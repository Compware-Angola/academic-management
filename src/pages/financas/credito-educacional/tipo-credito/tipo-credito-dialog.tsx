import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditoEducacionalTipo } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo.service";
import { useEffect, useState } from "react";
type TipoCreditoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTipoCredito: (tipoCredito?: CreditoEducacionalTipo) => void;
  selectedTipoCredito: CreditoEducacionalTipo | undefined;
  // onSubmit: () => void;
  // isSubmitting?: boolean;
};

export function TipoCreditoDialog({
  open,
  onOpenChange,
  selectedTipoCredito,
  onSelectTipoCredito
  // onSubmit,
  // isSubmitting,
}: TipoCreditoDialogProps) {
  const [formData, setFormData] = useState<{
    designacao: string;
    sigla: string;
  }>({
    designacao: selectedTipoCredito?.designacao ?? "",
    sigla: selectedTipoCredito?.sigla ?? "",

  });

  const handleClose = () => {
    onSelectTipoCredito()
  }
  const handleSubmit = () => {
    onOpenChange(false);
    setFormData({
      designacao: "",
      sigla: "",
    });
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Tipo de Crédito</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Designação</Label>
            <Input
              value={selectedTipoCredito?.designacao}
              onChange={handleChange}
            />
          </div>


          <div className="grid gap-2">
            <Label>Sigla</Label>
            <Input
              value={selectedTipoCredito?.sigla}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
          // onClick={onSubmit}
          // disabled={
          //   // isSubmitting ||
          //   // !formData.designacao ||
          //   // !formData.sigla
          // }
          >
            Criar Tipo de Crédito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
