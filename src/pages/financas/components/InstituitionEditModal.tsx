// src/pages/components/InstituitionEditModal.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ← importe correto do shadcn/ui
import { useUpdateInstituicao } from "@/hooks/financas/instituicao/use-mutation-update-instituicao.";
import { UpdateInstituicaoParams } from "@/services/financas/instituicao/update-instituicao.service";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";

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
  const { data: tiposInstituicao = [], isLoading: isLoadingTipos } =
    useListInstituicaoTipo();

  // Preenche o formulário quando o modal abre
  useEffect(() => {
    if (instituicao && open) {
      setFormData({
        instituicao: instituicao.instituicao || "",
        nif: instituicao.nif || "",
        contacto: instituicao.contacto || "",
        endereco: instituicao.endereco || "",
        sigla: instituicao.sigla || "",
        tipo_instituicao: instituicao.tipo_instituicao || 1,
      });
    }
  }, [instituicao, open]);

  const handleChange = (
    field: keyof UpdateInstituicaoParams,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.instituicao.trim()) {
      alert("O nome da instituição é obrigatório.");
      return;
    }

    try {
      await update({ codigo: instituicao.codigo!, data: formData });
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao atualizar instituição:", err);
      // Aqui você pode adicionar um toast de erro se tiver um sistema de notificações
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Limpa apenas quando realmente fecha
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
            <Label htmlFor="instituicao">Nome da Instituição *</Label>
            <Input
              id="instituicao"
              value={formData.instituicao}
              onChange={(e) => handleChange("instituicao", e.target.value)}
              placeholder="Nome completo da instituição"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nif">NIF</Label>
            <Input
              id="nif"
              value={formData.nif}
              onChange={(e) => handleChange("nif", e.target.value)}
              placeholder="Ex: 5412367890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto">Contacto</Label>
            <Input
              id="contacto"
              value={formData.contacto}
              onChange={(e) => handleChange("contacto", e.target.value)}
              placeholder="Ex: +244 923 456 789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, nº, bairro, cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input
              id="sigla"
              value={formData.sigla}
              onChange={(e) => handleChange("sigla", e.target.value)}
              placeholder="Ex: BPC, BAI, UNITEL"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_instituicao">Tipo de Instituição *</Label>

            {isLoadingTipos ? (
              <div className="text-sm text-muted-foreground">
                Carregando tipos...
              </div>
            ) : (
              <Select
                value={formData.tipo_instituicao.toString()}
                onValueChange={(value) =>
                  handleChange("tipo_instituicao", Number(value))
                }
                disabled={isLoadingTipos || tiposInstituicao.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposInstituicao.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoadingTipos}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
