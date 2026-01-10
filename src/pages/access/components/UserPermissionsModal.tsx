import { useState, useEffect } from "react";
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

import { useAddUserGruop } from "@/hooks/acess/use-add-gruop-user";
import { useQueryGrupos } from "@/hooks/acess/use-query-grupos";

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
  const [selectedAccessToGrant, setSelectedAccessToGrant] = useState<number | null>(null);
  const [selectedGroupToAdd, setSelectedGroupToAdd] = useState<number | null>(null);
  

  /** Grupos do utilizador */
  const { data: groups = [], isLoading: loadingGroups, refetch: refetchUserGroups } = useUserGroups({
    userId: user.codigo,
    enabled: open,
  });

  /** Acessos do grupo selecionado */
  const { data: groupAccesses = [], isLoading: loadingGroupAccesses, error: errorAccesses } =
    useGroupAccesses({
      groupId: selectedGroup?.codigo || 0,
      enabled: !!selectedGroup && open,
    });

  /** Estado local — fonte de verdade enquanto o modal estiver aberto */
  const [localGroupAccesses, setLocalGroupAccesses] = useState<any[]>([]);

  /** Inicializa estado local quando o modal abre ou muda de grupo */
  useEffect(() => {
    if (open && selectedGroup) {
      setLocalGroupAccesses(
        groupAccesses.map(a => ({
          ...a,
          blocking: false,
        }))
      );
    }
  }, [open, selectedGroup, groupAccesses]);

  /** TODOS os acessos do sistema (catálogo) */
  const { data: allAccesses = [], isLoading: loadingAllAccesses } =
    useQueryAcessos({ apenasAtivos: true });

  /** Mutação: conceder / reativar acesso */
  const { mutateAsync: grantAccess, isPending: granting } = useGrantUserAccess();

  /** Adicionar grupo ao utilizador */
  const {data: todosGrupos = [], isPending: loadingTodosGrupos} = useQueryGrupos({ativo: "true"})
  const {mutateAsync: addGrupoUser} = useAddUserGruop()

  /** Mutação: bloquear acesso */
  const { mutateAsync: blockAccess } = useBlockUserAccess();

  /** Concede novo acesso e atualiza o estado local */
  async function handleGrantAccess() {
    if (!selectedAccessToGrant) return;

    await grantAccess({
      utilizadorId: user.codigo,
      acessoId: selectedAccessToGrant,
    });


    // Busca dados do acesso no catálogo
    const acessoInfo = allAccesses.find(a => a.id === selectedAccessToGrant);
    if (acessoInfo) {
      setLocalGroupAccesses(prev => [
        ...prev,
        {
          codigo: acessoInfo.id,
          descricao: acessoInfo.designacao, // Corrige nome do acesso
          disponibilidade: 1,
          blocking: false,
          ["Update at"]: new Date().toISOString(),
        },
      ]);
    }

    setSelectedAccessToGrant(null);
  }

  /** Bloqueia acesso e atualiza estado local */
  async function handleBlockAccess(accessCodigo: number) {
    setLocalGroupAccesses(prev =>
      prev.map(a =>
        a.codigo === accessCodigo ? { ...a, blocking: true } : a
      )
    );

    await blockAccess({
      utilizadorId: user.codigo,
      acessoId: accessCodigo,
    });

    setLocalGroupAccesses(prev =>
      prev.map(a =>
        a.codigo === accessCodigo
          ? { ...a, disponibilidade: 0, blocking: false }
          : a
      )
    );
  }

  async function handleAddGroup() {
  if (!selectedGroupToAdd) return;

  await addGrupoUser({
    userId: user.codigo,
    gruopId: selectedGroupToAdd,
  });

  // Atualiza lista de grupos do utilizador
  await refetchUserGroups();

  // Limpa seleção
  setSelectedGroupToAdd(null);
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
              groups.map(group => (
                <Button
                  key={group.codigo}
                  variant={selectedGroup?.codigo === group.codigo ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedGroup(group)}
                >
                  <span>{group?.descricao}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))
            )}

            {/* COLUNA 3 — Adicionar Grupo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Plus className="h-5 w-5" />
              Adicionar grupo
            </div>

            {loadingTodosGrupos ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Select
                  value={selectedGroupToAdd?.toString()}
                  onValueChange={v => setSelectedGroupToAdd(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar Grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {todosGrupos?.map(grupo => (
                      <SelectItem key={grupo.pkGrupo} value={grupo.pkGrupo.toString()}>
                        {grupo.pkGrupo} – {grupo.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleAddGroup}
                  disabled={!selectedGroupToAdd || loadingTodosGrupos}
                >
                  {loadingTodosGrupos ? "A conceder..." : "Conceder grupo"}
                </Button>
              </>
            )}
          </div>

          </div>

          {/* COLUNA 2 — Permissões do grupo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Permissões Ativas
              {selectedGroup && <Badge className="ml-2">{selectedGroup.descricao}</Badge>}
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
            ) : localGroupAccesses.length === 0 ? (
              <p className="text-muted-foreground italic">
                Este grupo não tem permissões associadas.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {localGroupAccesses.map(access => (
                  <div
                    key={access.codigo}
                    className="flex flex-col p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">
                        {access.codigo} – {access.descricao}
                      </span>
                    </div>

                    {access["Update at"] && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Atualizado em: {format(new Date(access["Update at"]), "dd/MM/yyyy HH:mm")}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={access.disponibilidade === 1 ? "default" : "outline"}>
                        {access.disponibilidade === 1 ? "Ativo" : "Bloqueado"}
                      </Badge>

                      {access.disponibilidade === 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockAccess(access.codigo)}
                          disabled={access.blocking}
                        >
                          {access.blocking ? "Bloqueando..." : "Bloquear"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUNA 3 — Adicionar acesso */}
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
                  onValueChange={v => setSelectedAccessToGrant(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAccesses?.map(access => (
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
