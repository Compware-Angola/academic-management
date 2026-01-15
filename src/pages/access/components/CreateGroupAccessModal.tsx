import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryAcessos } from "@/hooks/acess/use-query-all-accesses";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useAddGroupAccess } from "@/hooks/acess/use-add-group-access";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
};

export function CreateGroupAccessModal({ open, onOpenChange, groupId }: Props) {
  const [accessId, setAccessId] = useState("");

  const { data: allAccesses = [], isLoading: loadingAllAccesses } =
    useQueryAcessos({ apenasAtivos: true });

  const { mutateAsync, isPending, isSuccess } = useAddGroupAccess({
    groupId,
  });

  async function handleSubmit() {
    if (!accessId) return;

    try {
      await mutateAsync(accessId);
      setAccessId("");
      onOpenChange(false);
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir Permissão ao Grupo</DialogTitle>
        </DialogHeader>

        <FormCommandSelect
          disabled={loadingAllAccesses}
          value={accessId}
          label="Acessos"
          width="full"
          options={allAccesses}
          map={(a) => ({
            key: a.id.toString(),
            value: a.id.toString(),
            label: a.designacao,
          })}
          onChange={setAccessId}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!accessId || isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
