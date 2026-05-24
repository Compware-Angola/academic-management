import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Delete, Loader2 } from "lucide-react";

export type CreateDescontoFormData = {
  descricao: string;
  sigla: string;
  taxa: string;
  data_inicio: string;
  data_fim: string;
  obs: string;
  estado: boolean;
};

type CreateDescontoDialogProps = {
  isEditing: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateDescontoFormData;
  onChange: (data: CreateDescontoFormData) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export function CreateDescontoDialog({
  open,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  isEditing,
  isSubmitting,
}: CreateDescontoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Desconto" : "Criar Novo Desconto"}{" "}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Ex: Desconto de Funcionário"
              value={formData.descricao}
              onChange={(e) =>
                onChange({ ...formData, descricao: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input
              id="sigla"
              placeholder="Ex: DESC_FUNC"
              value={formData.sigla}
              onChange={(e) =>
                onChange({ ...formData, sigla: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxa">Percentual (%)</Label>
              <Input
                id="taxa"
                type="number"
                placeholder="Ex: 10"
                value={formData.taxa}
                onChange={(e) =>
                  onChange({ ...formData, taxa: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado ? "true" : "false"}
                onValueChange={(v) =>
                  onChange({ ...formData, estado: v === "true" })
                }
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data Inicial</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) =>
                  onChange({ ...formData, data_inicio: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_fim">Data Final</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) =>
                  onChange({ ...formData, data_fim: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              placeholder="Informações adicionais..."
              value={formData.obs}
              onChange={(e) => onChange({ ...formData, obs: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !formData.descricao ||
              !formData.sigla ||
              !formData.taxa ||
              !formData.data_inicio ||
              !formData.data_fim
            }
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isEditing ? "Editar Desconto" : "Criar Desconto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
