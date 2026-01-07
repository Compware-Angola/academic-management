// src/pages/grupos/components/grupo-form-dialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { useMutationCriarGrupo } from "@/hooks/controle-acesso/use-mutation-criar-grupo";
import { useMutationEditarGrupo } from "@/hooks/controle-acesso/use-mutation-editar-grupo";

type GrupoFormData = {
  id?: string | number;
  designacao: string;
  descricao?: string;
  sigla: string;
  fkTipoDeGrupo: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: GrupoFormData;
};

export function GrupoFormDialog({ open, onClose, mode, initialData }: Props) {
  const criarMutation = useMutationCriarGrupo();
  const editarMutation = useMutationEditarGrupo();

  const [designacao, setDesignacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");
  const [tipoGrupo, setTipoGrupo] = useState("1");

  /* -------- popular dados quando editar -------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setDesignacao(initialData.designacao);
      setDescricao(initialData.descricao ?? "");
      setSigla(initialData.sigla);
      setTipoGrupo(String(initialData.fkTipoDeGrupo));
    }

    if (mode === "create") {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    setDesignacao("");
    setDescricao("");
    setSigla("");
    setTipoGrupo("1");
  };

  const handleSubmit = () => {
    if (!designacao || !sigla) return;

    if (mode === "create") {
      criarMutation.mutate({
        designacao,
        descricao,
        sigla,
        fkTipoDeGrupo: Number(tipoGrupo),
        active_state: 1,
      });
    }

    if (mode === "edit" && initialData?.id) {
      editarMutation.mutate({
        id: initialData.id,
        designacao,
        descricao,
        sigla,
        fkTipoDeGrupo: Number(tipoGrupo),
        active_state: 1,
      });
    }

    onClose();
    resetForm();
  };

  const isLoading = criarMutation.isPending || editarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Grupo" : "Editar Grupo"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Nome do grupo"
            value={designacao}
            onChange={(e) => setDesignacao(e.target.value)}
          />

          <Input
            placeholder="Sigla (ADM, DEV...)"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
          />

          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <Select value={tipoGrupo} onValueChange={setTipoGrupo}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Multiutilizador</SelectItem>
              <SelectItem value="2">Unitário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {mode === "create" ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
