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
import { Plus } from "lucide-react";

import { useMutationCreateAcesso } from "@/hooks/acess/use-mutation-create-acesso";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AcessoFormDialog({ open, onClose }: Props) {
  const { mutate, isPending } = useMutationCreateAcesso();

  const [designacao, setDesignacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");

  const handleSubmit = () => {
    console.log("ACESSO", designacao,descricao,sigla)
    if (!designacao || !sigla) return;

    mutate({
      designacao,
      descricao,
      sigla,
      icone: "",
      fkModulo: 1,
      fkSubmenu: 1,
      fkPagina: 1,
      fkTipoAcesso: 1,
      obs: "",
      ordem: 1,
      activeDate: new Date().toISOString().slice(0, 10),
      activeState: true,
    });

    onClose();
    setDesignacao("");
    setDescricao("");
    setSigla("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Acesso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Designação"
            value={designacao}
            onChange={(e) => setDesignacao(e.target.value)}
          />

          <Input
            placeholder="Sigla"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
          />

          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
