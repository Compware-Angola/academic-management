import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ShieldCheck, Users, ChevronRight, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { User } from "@/services/access/fect-users.service";
import { UserGroup } from "@/services/access/fetch-user-group.service";

import { useUserGroups } from "@/hooks/acess/use-user-groups";
import { useGroupAccesses } from "@/hooks/acess/use-query-group-accesses";
import { useQueryAcessos } from "@/hooks/acess/use-query-all-accesses";
import { useGrantUserAccess } from "@/hooks/acess/use-grant-user-access";

interface UserPermissionsModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserPermissionsModal({
  user,
  open,
  onOpenChange,
}: UserPermissionsModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [selectedAccessId, setSelectedAccessId] = useState<number | null>(null);

  /** Grupos do utilizador */
  const { data: groups = [], isLoading: loadingGroups } = useUserGroups({
    userId: user.codigo,
    enabled: open,
  });

  /** Acessos do grupo selecionado */
  const {
    data: groupAccesses = [],
    isLoading: loadingGroupAccesses,
    refetch: refetchGroupAccesses,
  } = useGroupAccesses({
    groupId: selectedGroup?.codigo || 0,
    enabled: !!selectedGroup && open,
  });

  /** TODOS os acessos do sistema (catálogo) */
  const { data: allAccesses = [], isLoading: loadingAllAccesses } =
    useQueryAcessos();

  console.log("Acessos: ");

  /** Mutação: conceder / reativar acesso */
  const { mutateAsync: grantAccess, isPending: granting } =
    useGrantUserAccess();

  async function handleGrantAccess() {
    if (!selectedAccessId) return;

    await grantAccess({
      utilizadorId: user.codigo,
      acessoId: selectedAccessId,
    });

    setSelectedAccessId(null);
    refetchGroupAccesses();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl! w-full! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-primary" />
            Permissões de Acesso – {user.nome}
            <Badge variant="outline">Código: {user.codigo}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* COLUNA 1 — Grupos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" />
              Grupos Associados
            </div>

            {loadingGroups ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              groups.map((group) => (
                <Button
                  key={group.codigo}
                  variant={
                    selectedGroup?.codigo === group.codigo
                      ? "default"
                      : "outline"
                  }
                  className="w-full justify-between"
                  onClick={() => setSelectedGroup(group)}
                >
                  <span>{group.descricao}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))
            )}
          </div>

          {/* COLUNA 2 — Permissões do grupo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Permissões Ativas
            </div>

            {!selectedGroup ? (
              <p className="text-muted-foreground italic">Selecione um grupo</p>
            ) : loadingGroupAccesses ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="space-y-2">
                {groupAccesses
                  .filter((a) => a.disponibilidade === 1)
                  .map((access) => (
                    <div key={access.codigo} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">
                        {access.codigo} – {access.descricao}
                      </div>
                      {access["Update at"] && (
                        <div className="text-xs text-muted-foreground">
                          Atualizado em{" "}
                          {format(
                            new Date(access["Update at"]),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* COLUNA 3 — ADICIONAR ACESSO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Plus className="h-5 w-5" />
              Adicionar acesso
            </div>

            {loadingAllAccesses ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Select
                  value={selectedAccessId?.toString()}
                  onValueChange={(v) => setSelectedAccessId(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAccesses.map((access) => (
                      <SelectItem key={access.id} value={access.id.toString()}>
                        {access.id} – {access.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleGrantAccess}
                  disabled={!selectedAccessId || granting}
                >
                  {granting ? "A conceder..." : "Conceder acesso"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
