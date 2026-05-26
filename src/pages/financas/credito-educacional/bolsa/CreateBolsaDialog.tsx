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

import { CreditoEducacionalTipoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoSelect";
import { CreditoEducacionalTipoDescontoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoDescontoSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
export type CreateBolsaFormData = {
  designacao: string;
  codigoInstituicao: string;
  codigoTipoDesconto: string;
  valorDesconto: string;
  codigoTipoCredito: string;
};
type CreateBolsaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    designacao: string;
    codigoInstituicao: string;
    codigoTipoDesconto: string;
    valorDesconto: string;
    codigoTipoCredito: string;
  };
  onChange: (data: CreateBolsaDialogProps["formData"]) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
};
export function CreateBolsaDialog({
  open,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  mode,
}: CreateBolsaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>
          {mode === "edit" ? "Editar Bolsa" : "Criar Nova Bolsa"}
        </DialogTitle>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Designação</Label>
            <Input
              value={formData.designacao}
              onChange={(e) =>
                onChange({ ...formData, designacao: e.target.value })
              }
            />
          </div>

          <InstituicaoSelect
            value={formData.codigoInstituicao}
            onChangeValue={(v) =>
              onChange({ ...formData, codigoInstituicao: v })
            }
          />

          <CreditoEducacionalTipoSelect
            value={formData.codigoTipoCredito}
            onChangeValue={(v) =>
              onChange({ ...formData, codigoTipoCredito: v })
            }
          />

          <CreditoEducacionalTipoDescontoSelect
            value={formData.codigoTipoDesconto}
            onChangeValue={(v) =>
              onChange({ ...formData, codigoTipoDesconto: v })
            }
          />

          <div className="grid gap-2">
            <Label>Valor do Desconto</Label>
            <Input
              type="number"
              value={formData.valorDesconto}
              onChange={(e) =>
                onChange({ ...formData, valorDesconto: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !formData.designacao ||
              !formData.codigoInstituicao ||
              !formData.codigoTipoCredito ||
              !formData.codigoTipoDesconto ||
              !formData.valorDesconto
            }
          >
            {mode === "edit" ? "Editar Bolsa" : "Criar Bolsa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
