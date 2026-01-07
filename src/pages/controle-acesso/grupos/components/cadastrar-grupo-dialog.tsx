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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useMutationCriarGrupo } from "@/hooks/controle-acesso/use-mutation-criar-grupo";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CadastrarGrupoDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useMutationCriarGrupo();

  const [designacao, setDesignacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");
  const [tipoGrupo, setTipoGrupo] = useState<string>("1");

  const handleSubmit = () => {
    if (!designacao || !sigla) return;

    mutate({
      designacao,
      descricao,
      sigla,
      fkTipoDeGrupo: Number(tipoGrupo),
      active_state: 1,
    });

    onClose();
    setDesignacao("");
    setDescricao("");
    setSigla("");
    setTipoGrupo("1");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Grupo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Nome do grupo"
            value={designacao}
            onChange={(e) => setDesignacao(e.target.value)}
          />

          <Input
            placeholder="Sigla (ex: ADM, DEV)"
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
          <Button onClick={handleSubmit} disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
