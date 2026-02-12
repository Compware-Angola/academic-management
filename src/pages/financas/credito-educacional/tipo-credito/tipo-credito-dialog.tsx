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
import { toast } from "sonner";
import { useCreateTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/use-create-tipo-credito-educacional";
import { useUpdateTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/update-tipo-credito-educacional";
type TipoCreditoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTipoCredito: (tipoCredito?: CreditoEducacionalTipo) => void;
  selectedTipoCredito: CreditoEducacionalTipo | undefined;

};

export function TipoCreditoDialog({
  open,
  onOpenChange,
  selectedTipoCredito,
  onSelectTipoCredito

}: TipoCreditoDialogProps) {
  const [formData, setFormData] = useState<{
    designacao: string;
    sigla: string;
  }>({
    designacao: selectedTipoCredito?.designacao ?? "",
    sigla: selectedTipoCredito?.sigla ?? "",

  });
  const { mutateAsync: createMutateAsync, isPending: isCreating } = useCreateTipoCreditoEducacional();
  const { mutateAsync: updateMutateAsync, isPending: isUpdating } = useUpdateTipoCreditoEducacional();
  useEffect(() => {
    if (open) {
      setFormData({
        designacao: selectedTipoCredito?.designacao ?? "",
        sigla: selectedTipoCredito?.sigla ?? "",
      });
    }
  }, [selectedTipoCredito, open]);
  const handleClose = () => {
    onSelectTipoCredito()
  }
  const handleSubmit = async () => {
    if (selectedTipoCredito) {
      await updateMutateAsync({
        data: {
          designacao: formData.designacao,
          sigla: formData.sigla
        },
        id: selectedTipoCredito.codigo
      });
      toast.success("Crédito atualizado com sucesso",);
      handleClose()
      return
    }

    await createMutateAsync({
      designacao: formData.designacao,
      sigla: formData.sigla
    });
    toast.success("Crédito criado com sucesso",);
    handleClose()
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
          <DialogTitle>{selectedTipoCredito ? "Editar Tipo de Crédito" : "Criar Novo Tipo de Crédito"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Designação</Label>
            <Input
              id="designacao"
              name="designacao"
              value={formData.designacao}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sigla</Label>
            <Input
              id="sigla"
              name="sigla"
              value={formData.sigla}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isCreating ||
              isUpdating ||
              !formData.designacao ||
              !formData.sigla
            }
          >
            {selectedTipoCredito ? "Atualizar Tipo de Crédito" : "Criar Tipo de Crédito"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
