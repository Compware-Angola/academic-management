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
import { useBlockUserAccess } from "@/hooks/acess/use-block-user-access";

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

  // Estado para selecionar acesso para conceder
  const [selectedAccessToGrant, setSelectedAccessToGrant] = useState<number | null>(null);

  // Estado para selecionar acesso para bloquear
  const [selectedAccessToBlock, setSelectedAccessToBlock] = useState<number | null>(null);

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
    error: errorAccesses,
  } = useGroupAccesses({
    groupId: selectedGroup?.codigo || 0,
    enabled: !!selectedGroup && open,
  });

  /** TODOS os acessos do sistema (catálogo) */
  const { data: allAccesses = [], isLoading: loadingAllAccesses } =
    useQueryAcessos({ apenasAtivos: true });

  /** Mutação: conceder / reativar acesso */
  const { mutateAsync: grantAccess, isPending: granting } =
    useGrantUserAccess();

  /** Mutação: bloquear acesso */
  const { mutateAsync: blockAccess, isPending: blocking } = useBlockUserAccess();

  /** Função para conceder acesso */
  async function handleGrantAccess() {
    if (!selectedAccessToGrant) return;

    await grantAccess({
      utilizadorId: user.codigo,
      acessoId: selectedAccessToGrant,
    });

    setSelectedAccessToGrant(null);
    refetchGroupAccesses();
  }

  /** Função para bloquear acesso */
  async function handleBlockAccess() {
    if (!selectedAccessToBlock) return;

    await blockAccess({
      utilizadorId: user.codigo,
      acessoId: selectedAccessToBlock,
    });

    setSelectedAccessToBlock(null);
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
                  <span>{group?.descricao}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))
            )}
          </div>

          {/* COLUNA 2 — Permissões do grupo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Permissões Ativas
              {selectedGroup && (
                <Badge className="ml-2">{selectedGroup.descricao}</Badge>
              )}
            </div>

            {!selectedGroup ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Selecione um grupo à esquerda para ver as permissões</p>
              </div>
            ) : loadingGroupAccesses ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : errorAccesses ? (
              <p className="text-destructive">Erro ao carregar permissões.</p>
            ) : groupAccesses.length === 0 ? (
              <p className="text-muted-foreground italic">
                Este grupo não tem permissões associadas.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groupAccesses.map((access) => (
                  <div
                    key={access.codigo}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="font-medium text-sm">
                          {access.codigo} – {access.descricao}
                        </span>
                      </div>
                      {access["Update at"] && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado em:{" "}
                          {format(
                            new Date(access["Update at"]),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={access.disponibilidade === 1 ? "default" : "outline"}
                    >
                      {access.disponibilidade === 1 ? "Ativo" : "Bloqueado"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUNA 3 — Adicionar e Bloquear acesso */}
          <div className="space-y-8">
            {/* ADICIONAR ACESSO */}
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
                    value={selectedAccessToGrant?.toString()}
                    onValueChange={(v) => setSelectedAccessToGrant(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccesses?.map((access) => (
                        <SelectItem key={access.id} value={access.id.toString()}>
                          {access.id} – {access.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full"
                    onClick={handleGrantAccess}
                    disabled={!selectedAccessToGrant || granting}
                  >
                    {granting ? "A conceder..." : "Conceder acesso"}
                  </Button>
                </>
              )}
            </div>

            {/* BLOQUEAR ACESSO */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <Shield className="h-5 w-5" />
                Bloquear acesso
              </div>

              {loadingAllAccesses ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <Select
                    value={selectedAccessToBlock?.toString()}
                    onValueChange={(v) => setSelectedAccessToBlock(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccesses?.map((access) => (
                        <SelectItem
                          key={access.id}
                          value={access.id.toString()}
                        >
                          {access.id} – {access.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleBlockAccess}
                    disabled={!selectedAccessToBlock || blocking}
                  >
                    {blocking ? "Bloqueando..." : "Bloquear acesso"}
                  </Button>
                </>
              )}
            </div>
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
