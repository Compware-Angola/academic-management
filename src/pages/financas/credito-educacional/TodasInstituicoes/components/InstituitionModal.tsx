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
import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";
import { useUpdateInstituicao } from "@/hooks/financa/use-mutation-update-instituition";
import { TipoInstituicaoSelect } from "@/components/common/global-selects/TipoInstituicaoSelect";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instituicao?: Instituicao | null;
  onSuccess?: () => void;
}
export function InstituitionModal({
  open,
  onOpenChange,
  instituicao,
  onSuccess,
}: Props) {
  const isEdit = !!instituicao;

  const [formData, setFormData] = useState({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
    tipo: "",
  });

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
      });
    } else {
      setFormData({
        instituicao: "",
        nif: "",
        contacto: "",
        endereco: "",
        sigla: "",
      });
    }
  }, [instituicao]);

  const handleSubmit = async () => {
    // if (isEdit) {
    //   await updateInstituicao({
    //     codigo: instituicao!.codigo,
    //     payload: {
    //       ...formData,
    //     },
    //   });
    // } else {
    //   await createInstituicao({
    //     payload: {
    //       ...formData,
    //     },
    //   });
    // }

    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              setFormData({ ...formData, instituicao: e.target.value })
            }
          />
          <Input
            placeholder="Sigla"
            value={formData.sigla}
            onChange={(e) =>
              setFormData({ ...formData, sigla: e.target.value })
            }
          />
          <TipoInstituicaoSelect
            value={formData.tipo}
            placeholder="Tipo de Instituição"
            onChangeValue={(t) => setFormData({ ...formData, tipo: t })}
          />
          <Input
            placeholder="NIF"
            value={formData.nif}
            onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
          />
          <Input
            placeholder="Contacto"
            value={formData.contacto}
            onChange={(e) =>
              setFormData({ ...formData, contacto: e.target.value })
            }
          />
          <Input
            placeholder="Endereço"
            value={formData.endereco}
            onChange={(e) =>
              setFormData({ ...formData, endereco: e.target.value })
            }
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={creating || updating}>
            {isEdit ? "Salvar Alterações" : "Criar Instituição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
