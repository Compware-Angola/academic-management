// src/pages/components/InstituitionEditModal.tsx

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUpdateInstituicao } from "@/hooks/financa/use-mutation-update-instituition";
import { UpdateInstituicaoParams } from "@/services/finance/update-instituicao.service";

export interface Instituition {
  codigo?: number;
  instituicao: string;
  nif: string;
  contacto: string;
  endereco: string;
  sigla: string;
  tipo_instituicao: number;
}

interface InstituitionEditModalProps {
  instituicao: Instituition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InstituitionEditModal({
  instituicao,
  open,
  onOpenChange,
  onSuccess,
}: InstituitionEditModalProps) {

  const [formData, setFormData] = useState<UpdateInstituicaoParams>({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
    tipo_instituicao: 1,
  });

  const { mutateAsync: update } = useUpdateInstituicao();
  

  // Preenche o formulário quando abrir o modal
  useEffect(() => {
    if (instituicao && open) {
      setFormData({
        instituicao: instituicao.instituicao,
        nif: instituicao.nif,
        contacto: instituicao.contacto,
        endereco: instituicao.endereco,
        sigla: instituicao.sigla,
        tipo_instituicao: instituicao.tipo_instituicao,
      });
    }
  }, [instituicao, open]);

  const handleChange = (field: keyof UpdateInstituicaoParams, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await update({ codigo: instituicao.codigo, data: formData });
        
        
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao atualizar instituição:", err);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData({
        instituicao: "",
        nif: "",
        contacto: "",
        endereco: "",
        sigla: "",
        tipo_instituicao: 1,
      });
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            Editar Instituição – {instituicao.instituicao}
            <Badge variant="outline">ID: {instituicao.nif}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="instituicao">Nome da Instituição</Label>
            <Input
              id="instituicao"
              value={formData.instituicao}
              onChange={(e) => handleChange("instituicao", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nif">NIF</Label>
            <Input
              id="nif"
              value={formData.nif}
              onChange={(e) => handleChange("nif", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto">Contacto</Label>
            <Input
              id="contacto"
              value={formData.contacto}
              onChange={(e) => handleChange("contacto", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input
              id="sigla"
              value={formData.sigla}
              onChange={(e) => handleChange("sigla", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_instituicao">Tipo de Instituição</Label>
            <Input
              id="tipo_instituicao"
              type="number"
              value={formData.tipo_instituicao}
              onChange={(e) => handleChange("tipo_instituicao", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
                      onClick={handleSave}
                      
                    >
                      Salvar
                    </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
