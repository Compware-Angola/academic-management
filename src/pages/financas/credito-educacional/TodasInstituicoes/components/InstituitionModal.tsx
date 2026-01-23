import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instituicao } from "@/services/financas/instituicao/fetch-instituicao.service";
import { useCreateInstituicao } from "@/hooks/financas/instituicao/use-create-instituicao";
import { useUpdateInstituicao } from "@/hooks/financas/instituicao/use-mutation-update-instituicao.";
import { TipoInstituicaoSelect } from "@/components/common/global-selects/TipoInstituicaoSelect";
import { useToast } from "@/hooks/use-toast";
export type FormData = Omit<Instituicao, "codigo" | "tipo_instituicao"> & {
  tipo: string;
};
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instituicao?: Instituicao | null;
  onSuccess?: () => void;

  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  resetFormData: () => void;
};

export function InstituitionModal({
  open,
  onOpenChange,
  instituicao,
  onSuccess,
  formData,
  setFormData,
  resetFormData,
}: Props) {
  const isEdit = !!instituicao;
  const { toast } = useToast();
  const { mutateAsync: createInstituicao, isPending: creating } =
    useCreateInstituicao();
  const { mutateAsync: updateInstituicao, isPending: updating } =
    useUpdateInstituicao();

  useEffect(() => {
    if (instituicao) {
      setFormData({
        instituicao: instituicao.instituicao,
        nif: instituicao.nif,
        contacto: instituicao.contacto ?? "",
        endereco: instituicao.endereco ?? "",
        sigla: instituicao.sigla ?? "",
        tipo: instituicao.tipo_instituicao.toString(),
      });
    }
  }, [instituicao, setFormData]);

  function validateForm(data: FormData) {
    const errors: string[] = [];

    if (!data.instituicao.trim()) {
      errors.push("Instituição");
    }

    if (!data.nif.trim()) {
      errors.push("NIF");
    }

    if (!data.tipo) {
      errors.push("Tipo de instituição");
    }

    if (!data.contacto.trim()) {
      errors.push("Contacto");
    }

    if (!data.endereco.trim()) {
      errors.push("Endereço");
    }

    if (!data.sigla.trim()) {
      errors.push("Sigla");
    }

    if (errors.length > 0) {
      toast({
        title: "Campos obrigatórios em falta",
        description: `Preencha: ${errors.join(", ")}`,
        variant: "destructive",
      });

      return false;
    }

    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      return;
    }
    if (isEdit) {
      await updateInstituicao({
        codigo: instituicao!.codigo,
        contacto: formData.contacto,
        tipo_instituicao: Number(formData.tipo),
        sigla: formData.sigla,
        nif: formData.nif,
        endereco: formData.endereco,
        instituicao: formData.instituicao,
      });
    } else {
      await createInstituicao({
        contacto: formData.contacto,
        tipo_instituicao: Number(formData.tipo),
        sigla: formData.sigla,
        nif: formData.nif,
        endereco: formData.endereco,
        instituicao: formData.instituicao,
      });
    }

    resetFormData();
    onSuccess?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetFormData();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Instituição" : "Nova Instituição"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Instituição"
            value={formData.instituicao}
            onChange={(e) =>
              setFormData((p) => ({ ...p, instituicao: e.target.value }))
            }
          />

          <Input
            placeholder="Sigla"
            value={formData.sigla}
            onChange={(e) =>
              setFormData((p) => ({ ...p, sigla: e.target.value }))
            }
          />

          <TipoInstituicaoSelect
            value={formData.tipo}
            placeholder="Tipo Instituição"
            onChangeValue={(t) => setFormData((p) => ({ ...p, tipo: t }))}
          />

          <Input
            placeholder="NIF"
            value={formData.nif}
            onChange={(e) =>
              setFormData((p) => ({ ...p, nif: e.target.value }))
            }
          />

          <Input
            placeholder="Contacto"
            value={formData.contacto}
            onChange={(e) =>
              setFormData((p) => ({ ...p, contacto: e.target.value }))
            }
          />

          <Input
            placeholder="Endereço"
            value={formData.endereco}
            onChange={(e) =>
              setFormData((p) => ({ ...p, endereco: e.target.value }))
            }
          />
        </div>

        <DialogFooter>
          <Button disabled={creating || updating} onClick={handleSubmit}>
            {isEdit ? "Salvar Alterações" : "Criar Instituição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
