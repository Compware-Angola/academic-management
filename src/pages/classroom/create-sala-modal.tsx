import { toast } from "sonner";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryRoomTypes } from "@/hooks/salas/use-query-room-types";
import { useMutationCreateSala } from "@/hooks/salas/use-mutation-create-sala";

import { Room } from "@/services/salas/fetch-sala";
import { useMutationUpdateSala } from "@/hooks/salas/use-mutation-update-sala";

interface CreateSalaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sala?: Room | null;
  onSuccess?: () => void;
}

export function CreateSalaModal({
  open,
  onOpenChange,
  sala = null,
  onSuccess,
}: CreateSalaModalProps) {
  const isEdit = !!sala;

  const { data: tipos = [] } = useQueryRoomTypes();
  const { mutate: create, isPending: creating } = useMutationCreateSala();
  const { mutate: update, isPending: updating } = useMutationUpdateSala();

  const isPending = creating || updating;

  const [form, setForm] = useState({
    designacao: "",
    tipo_sala: "",
    numero: "",
    capacidade: "",
    capacidade_exame_acesso_prova: "",
    comprimento: "",
    largura: "",
    area: "",
    num_ac: "",
    num_janelas: "",
    num_lampadas: "",
    area_aluno: "",
    utilizavel: "SIM", // default para criação
  });

  // Preenche formulário quando abre em modo edição
  useEffect(() => {
    if (isEdit && sala && open) {
      setForm({
        designacao: sala.designacao || "",
        tipo_sala: sala.tipo_sala?.toString() || "",
        numero: sala.numero || "",
        capacidade: sala.capacidade?.toString() || "",
        capacidade_exame_acesso_prova: sala.capacidadeexameacessoprova?.toString() || "",
        comprimento: sala.comprimento?.toString() || "",
        largura: sala.largura?.toString() || "",
        area: sala.area?.toString() || "",
        num_ac: sala.num_ac?.toString() || "",
        num_janelas: sala.num_janelas?.toString() || "",
        num_lampadas: sala.num_lampadas?.toString() || "",
        area_aluno: sala.area_aluno?.toString() || "",
        utilizavel: sala.utilizavel?.toUpperCase() === "SIM" ? "Sim" : "Não",
      });
    } else if (!isEdit && open) {
      // Reset para criação
      setForm({
        designacao: "",
        tipo_sala: "",
        numero: "",
        capacidade: "",
        capacidade_exame_acesso_prova: "",
        comprimento: "",
        largura: "",
        area: "",
        num_ac: "",
        num_janelas: "",
        num_lampadas: "",
        area_aluno: "",
        utilizavel: "Sim",
      });
    }
  }, [sala, open, isEdit]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      designacao: form.designacao.trim(),
      tipo_sala: Number(form.tipo_sala) || null,
      numero: form.numero.trim() || null,
      capacidade: Number(form.capacidade) || 0,
      capacidade_exame_acesso_prova: Number(form.capacidade_exame_acesso_prova) || 0,
      comprimento: form.comprimento ? Number(form.comprimento) : null,
      largura: form.largura ? Number(form.largura) : null,
      area: form.area ? Number(form.area) : null,
      num_ac: form.num_ac ? Number(form.num_ac) : null,
      num_janelas: form.num_janelas ? Number(form.num_janelas) : null,
      num_lampadas: form.num_lampadas ? Number(form.num_lampadas) : null,
      area_aluno: form.area_aluno ? Number(form.area_aluno) : null,
      utilizavel: form.utilizavel === "Sim" ? "SIM" : "NÃO",
      polo_id: 1,
      piso_id: 1,
      edificio_id: 1,
      estado: "livre",
    };

    if (isEdit && sala?.codigo) {
      update(
        { id: sala.codigo.toString(), ...payload },
        {
          onSuccess: () => {
            toast.success("Sala atualizada com sucesso");
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Erro ao atualizar a sala. Tente novamente."
          );
        },
        }
      );
    } else {
      create(payload, {
        onSuccess: () => {
          toast.success("Sala criada com sucesso");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Erro ao criar a sala. Tente novamente."
          );
      },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Sala" : "Nova Sala"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Designação */}
          <div>
            <Label>Designação *</Label>
            <Input
              value={form.designacao}
              onChange={(e) => handleChange("designacao", e.target.value)}
              placeholder="Ex: U-101, Anfiteatro A"
            />
          </div>

          {/* Número */}
          <div>
            <Label>Número</Label>
            <Input
              value={form.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              placeholder="Ex: 101"
            />
          </div>

          {/* Tipo de Sala */}
          <div>
            <Label>Tipo de Sala</Label>
            <Select value={form.tipo_sala} onValueChange={(v) => handleChange("tipo_sala", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((t) => (
                  <SelectItem key={t.codigo} value={t.codigo.toString()}>
                    {t.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Utilização */}
          <div>
            <Label>Estado de Utilização</Label>
            <Select value={form.utilizavel} onValueChange={(v) => handleChange("utilizavel", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Disponível</SelectItem>
                <SelectItem value="Não">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacidade Normal */}
          <div>
            <Label>Capacidade Normal</Label>
            <Input
              type="number"
              value={form.capacidade}
              onChange={(e) => handleChange("capacidade", e.target.value)}
              placeholder="Ex: 50"
            />
          </div>

          {/* Capacidade Exame */}
          <div>
            <Label>Capacidade Exame / Acesso Prova</Label>
            <Input
              type="number"
              value={form.capacidade_exame_acesso_prova}
              onChange={(e) => handleChange("capacidade_exame_acesso_prova", e.target.value)}
              placeholder="Ex: 40"
            />
          </div>

          {/* Comprimento */}
          <div>
            <Label>Comprimento (m)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.comprimento}
              onChange={(e) => handleChange("comprimento", e.target.value)}
            />
          </div>

          {/* Largura */}
          <div>
            <Label>Largura (m)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.largura}
              onChange={(e) => handleChange("largura", e.target.value)}
            />
          </div>

          {/* Área */}
          <div>
            <Label>Área Total (m²)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          {/* Nº AC */}
          <div>
            <Label>Nº de Ar Condicionado</Label>
            <Input
              type="number"
              value={form.num_ac}
              onChange={(e) => handleChange("num_ac", e.target.value)}
            />
          </div>

          {/* Nº Janelas */}
          <div>
            <Label>Nº de Janelas</Label>
            <Input
              type="number"
              value={form.num_janelas}
              onChange={(e) => handleChange("num_janelas", e.target.value)}
            />
          </div>

          {/* Nº Lâmpadas */}
          <div>
            <Label>Nº de Lâmpadas</Label>
            <Input
              type="number"
              value={form.num_lampadas}
              onChange={(e) => handleChange("num_lampadas", e.target.value)}
            />
          </div>

          {/* Área por Aluno */}
          <div className="md:col-span-2">
            <Label>Área por Aluno (m²/aluno)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.area_aluno}
              onChange={(e) => handleChange("area_aluno", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? "Salvando..."
              : isEdit
              ? "Atualizar Sala"
              : "Criar Sala"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}