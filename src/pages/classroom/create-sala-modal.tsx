import { useState } from "react";

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

export function CreateSalaModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data: tipos = [] } = useQueryRoomTypes();
  const { mutate, isPending } = useMutationCreateSala();

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
    utilizavel: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = () => {
    mutate({
      designacao: form.designacao,
      tipo_sala: Number(form.tipo_sala),
      numero: form.numero,
      estado: "livre",
      capacidade: Number(form.capacidade),
      polo_id: 1,
      piso_id: 1,
      edificio_id: 1,
      comprimento: Number(form.comprimento),
      largura: Number(form.largura),
      area: Number(form.area),
      num_ac: Number(form.num_ac),
      num_lampadas: Number(form.num_lampadas),
      num_janelas: Number(form.num_janelas),
      area_aluno: Number(form.area_aluno),
      utilizavel: form.utilizavel,
      capacidade_exame_acesso_prova: Number(form.capacidade_exame_acesso_prova),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nova Sala</DialogTitle>
        </DialogHeader>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Designação</Label>
            <Input
              value={form.designacao}
              onChange={(e) => handleChange("designacao", e.target.value)}
            />
          </div>

          <div>
            <Label>Número</Label>
            <Input
              value={form.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={form.tipo_sala}
              onValueChange={(v) => handleChange("tipo_sala", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
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
          <div>
            <Label>Utilização da Sala</Label>

            <Select
              value={form.utilizavel}
              onValueChange={(v) => handleChange("utilizavel", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Sim">Disponível</SelectItem>
                <SelectItem value="Não">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Capacidade</Label>
            <Input
              type="number"
              value={form.capacidade}
              onChange={(e) => handleChange("capacidade", e.target.value)}
            />
          </div>

          <div>
            <Label>Capacidade Exame</Label>
            <Input
              type="number"
              value={form.capacidade_exame_acesso_prova}
              onChange={(e) =>
                handleChange("capacidade_exame_acesso_prova", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Comprimento</Label>
            <Input
              type="number"
              value={form.comprimento}
              onChange={(e) => handleChange("comprimento", e.target.value)}
            />
          </div>

          <div>
            <Label>Largura</Label>
            <Input
              type="number"
              value={form.largura}
              onChange={(e) => handleChange("largura", e.target.value)}
            />
          </div>

          <div>
            <Label>Área</Label>
            <Input
              type="number"
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          <div>
            <Label>Nº AC</Label>
            <Input
              type="number"
              value={form.num_ac}
              onChange={(e) => handleChange("num_ac", e.target.value)}
            />
          </div>

          <div>
            <Label>Nº Janelas</Label>
            <Input
              type="number"
              value={form.num_janelas}
              onChange={(e) => handleChange("num_janelas", e.target.value)}
            />
          </div>

          <div>
            <Label>Nº Lâmpadas</Label>
            <Input
              type="number"
              value={form.num_lampadas}
              onChange={(e) => handleChange("num_lampadas", e.target.value)}
            />
          </div>

          <div>
            <Label>Área por aluno</Label>
            <Input
              type="number"
              value={form.area_aluno}
              onChange={(e) => handleChange("area_aluno", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Salvando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
