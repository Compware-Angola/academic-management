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

type CreateCreditoEducacionalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    designacao: string;
    codigoTipoDesconto: string;
    valorDesconto: string;
    codigoTipoCredito: string;
  };
  onChange: (data: CreateCreditoEducacionalDialogProps["formData"]) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export function CreateCreditoEducacionalDialog({
  open,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
}: CreateCreditoEducacionalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Crédito Educacional</DialogTitle>
        </DialogHeader>

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
            <Label>Valor do Desconto (%)</Label>
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
              !formData.codigoTipoCredito ||
              !formData.codigoTipoDesconto ||
              !formData.valorDesconto
            }
          >
            Criar Crédito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
