import { X } from "lucide-react";
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
import {
  Shield,
  ShieldCheck,
  Users,
  ChevronRight,
  Plus,
  ShieldX,
} from "lucide-react";
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
import { useRemoveGruopFromUser } from "@/hooks/acess/use-remove-gruop-from-user";
import { useQueryClient } from "@tanstack/react-query";
import { GroupSelect } from "@/components/common/global-selects/GroupSelect";
import { AccessSelect } from "@/components/common/global-selects/AccessSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccessRestrictionsByUser } from "@/hooks/acess/use-query-access-restrictions-by-user";
import { useCreateAccessRestriction } from "@/hooks/acess/use-create-access-restriction";
import { useRemoveAccessRestriction } from "@/hooks/acess/use-remove-access-restriction";

interface UserPermissionsModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LocalGroupAccess = {
  codigo: number;
  descricao: string;
  disponibilidade: number;
  blocking: boolean;
  "Update at"?: string;
};

export function UserPermissionsModal({
  user,
  open,
  onOpenChange,
}: UserPermissionsModalProps) {
  const queryClient = useQueryClient();

  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [selectedAccessToGrant, setSelectedAccessToGrant] = useState<
    number | null
  >(null);
  const [selectedGroupToAdd, setSelectedGroupToAdd] = useState<number | null>(
    null,
  );
  const [selectedAccessToRestrict, setSelectedAccessToRestrict] = useState<
    number | null
  >(null);

  /** Grupos do utilizador */
  const {
    data: groups = [],
    isLoading: loadingGroups,
    refetch: refetchUserGroups,
  } = useUserGroups({
    userId: user.codigo,
    enabled: open,
  });

  /** Acessos do grupo selecionado */
  const {
    data: groupAccesses = [],
    isLoading: loadingGroupAccesses,
    error: errorAccesses,
    refetch: refetchGroupAccesses,
  } = useGroupAccesses({
    groupId: selectedGroup?.codigo || 0,
    enabled: !!selectedGroup && open,
  });

  /** Estado local — fonte de verdade enquanto o modal estiver aberto */
  const [localGroupAccesses, setLocalGroupAccesses] = useState<
    LocalGroupAccess[]
  >([]);

  // Sempre que o grupo selecionado mudar → limpa + força refetch + atualiza estado local
  useEffect(() => {
    if (!open) {
      // Limpa tudo quando o modal fecha
      setLocalGroupAccesses([]);
      setSelectedGroup(null);
      return;
    }

    if (selectedGroup) {
      // 1. Limpa imediatamente o estado anterior (evita mistura)
      setLocalGroupAccesses([]);

      // 2. Força recarregamento fresco dos acessos do grupo atual
      refetchGroupAccesses().then(() => {
        // 3. Só atualiza o estado local após o fetch terminar
        setLocalGroupAccesses(
          groupAccesses.map((a) => ({
            ...a,
            blocking: false,
          })),
        );
      });
    } else {
      // Sem grupo selecionado → limpa a lista
      setLocalGroupAccesses([]);
    }
  }, [open, selectedGroup, refetchGroupAccesses, groupAccesses]);

  /** TODOS os acessos do sistema */
  const { data: allAccesses = [], isLoading: loadingAllAccesses } =
    useQueryAcessos({ apenasAtivos: true });

  const { mutateAsync: grantAccess, isPending: granting } =
    useGrantUserAccess();
  const { data: todosGrupos = [], isPending: loadingTodosGrupos } =
    useQueryGrupos({ ativo: "true" });
  const { mutateAsync: addGrupoUser, isPending: addGroupLoading } =
    useAddUserGruop();
  const { mutateAsync: blockAccess } = useBlockUserAccess();
  const { mutateAsync: removeGruop, isPending: removingGruop } =
    useRemoveGruopFromUser();
  const {
    data: accessRestrictions = [],
    isLoading: loadingAccessRestrictions,
    error: accessRestrictionsError,
  } = useAccessRestrictionsByUser({
    codigoUtilizador: user.codigo,
    enabled: open,
  });
  const { mutateAsync: createAccessRestriction, isPending: restrictingAccess } =
    useCreateAccessRestriction();
  const {
    mutateAsync: removeAccessRestriction,
    isPending: removingRestriction,
  } = useRemoveAccessRestriction();
  const activeAccessRestrictions = accessRestrictions.filter(
    (restriction) => restriction.status === 1,
  );

  async function handleGrantAccess() {
    if (!selectedAccessToGrant) return;

    try {
      await grantAccess({
        utilizadorId: user.codigo,
        acessoId: selectedAccessToGrant,
      });

      queryClient.invalidateQueries({
        queryKey: ["group-accesses", user.codigo],
      });
      refetchGroupAccesses();

      const acessoInfo = allAccesses.find(
        (a) => a.id === selectedAccessToGrant,
      );
      if (acessoInfo) {
        setLocalGroupAccesses((prev) => [
          ...prev,
          {
            codigo: acessoInfo.id,
            descricao: acessoInfo.designacao,
            disponibilidade: 1,
            blocking: false,
            ["Update at"]: new Date().toISOString(),
          },
        ]);
      }

      setSelectedAccessToGrant(null);
    } catch (err) {
      console.error("Erro ao conceder acesso:", err);
    }
  }

  async function handleBlockAccess(accessCodigo: number) {
    setLocalGroupAccesses((prev) =>
      prev.map((a) =>
        a.codigo === accessCodigo ? { ...a, blocking: true } : a,
      ),
    );

    try {
      await blockAccess({
        utilizadorId: user.codigo,
        acessoId: accessCodigo,
      });

      queryClient.invalidateQueries({
        queryKey: ["group-accesses", user.codigo],
      });
      refetchGroupAccesses();

      // Remove da lista visual
      setLocalGroupAccesses((prev) =>
        prev.filter((a) => a.codigo !== accessCodigo),
      );
    } catch (err) {
      setLocalGroupAccesses((prev) =>
        prev.map((a) =>
          a.codigo === accessCodigo ? { ...a, blocking: false } : a,
        ),
      );
      console.error("Erro ao bloquear acesso:", err);
    }
  }

  async function handleAddGroup() {
    if (!selectedGroupToAdd) return;

    try {
      await addGrupoUser({
        userId: user.codigo,
        gruopId: selectedGroupToAdd,
      });

      queryClient.invalidateQueries({
        queryKey: ["user-groups", user.codigo],
      });

      queryClient.invalidateQueries({
        queryKey: ["users-by-group"],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-accesses", selectedGroupToAdd],
      });

      await refetchUserGroups();
      setSelectedGroupToAdd(null);
    } catch (err) {
      console.error("Erro ao adicionar grupo:", err);
    }
  }

  async function handleRemoveGroup(groupCodigo: number) {
    try {
      await removeGruop({
        userId: user.codigo,
        gruopId: groupCodigo,
      });

      queryClient.invalidateQueries({
        queryKey: ["user-groups", user.codigo],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-accesses", groupCodigo],
      });

      await refetchUserGroups();

      setSelectedGroup((prev) => (prev?.codigo === groupCodigo ? null : prev));
    } catch (err) {
      console.error("Erro ao remover grupo:", err);
    }
  }

  async function handleCreateAccessRestriction() {
    if (!selectedAccessToRestrict) return;

    try {
      await createAccessRestriction({
        codigoAcesso: selectedAccessToRestrict,
        codigoUtilizador: user.codigo,
      });
      setSelectedAccessToRestrict(null);
    } catch (err) {
      console.error("Erro ao restringir acesso:", err);
    }
  }

  async function handleRemoveAccessRestriction(accessCodigo: number) {
    try {
      await removeAccessRestriction({
        codigoAcesso: accessCodigo,
        codigoUtilizador: user.codigo,
      });
    } catch (err) {
      console.error("Erro ao remover restrição de acesso:", err);
    }
  }

  function isGrupoUnitario(group?: UserGroup): boolean {
    return group?.tipo_grupo === 2;
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

        <Tabs defaultValue="permissions" className="mt-4">
          <TabsList>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="restrictions">Restrições</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions">
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
                    <div
                      key={group.codigo}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedGroup(group)}
                      className={`
                    w-full flex items-center justify-between
                    px-4 py-2 rounded-md border
                    cursor-pointer transition-colors
                    ${
                      selectedGroup?.codigo === group.codigo
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }
                  `}
                    >
                      <span>{group.descricao}</span>

                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4" />

                        {group.tipo_grupo !== 2 && (
                          <X
                            className="h-4 w-4 text-destructive cursor-pointer hover:opacity-80"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGroup(group.codigo);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Adicionar Grupo */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <Plus className="h-5 w-5" />
                    Adicionar grupo
                  </div>

                  {loadingTodosGrupos ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <>
                      <GroupSelect
                        value={selectedGroupToAdd?.toString() ?? ""}
                        onChangeValue={(v) => setSelectedGroupToAdd(Number(v))}
                        excludeGroups={groups}
                        labelMode="inside"
                      />

                      <Button
                        className="w-full"
                        onClick={handleAddGroup}
                        disabled={
                          !selectedGroupToAdd ||
                          loadingTodosGrupos ||
                          addGroupLoading
                        }
                      >
                        {addGroupLoading ? "A conceder..." : "Conceder grupo"}
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
                  <p className="text-destructive">
                    Erro ao carregar permissões.
                  </p>
                ) : localGroupAccesses.length === 0 ? (
                  <p className="text-muted-foreground italic">
                    Este grupo não tem permissões associadas.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {localGroupAccesses.map((access) => (
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
                            Atualizado em:{" "}
                            {format(
                              new Date(access["Update at"]),
                              "dd/MM/yyyy HH:mm",
                            )}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant={
                              access.disponibilidade === 1
                                ? "default"
                                : "destructive"
                            }
                          >
                            {access.disponibilidade === 1
                              ? "Ativo"
                              : "Bloqueado"}
                          </Badge>

                          {access.disponibilidade === 1 &&
                            isGrupoUnitario(selectedGroup) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleBlockAccess(access.codigo)
                                }
                                disabled={access.blocking}
                              >
                                {access.blocking ? "Removendo..." : "Remover"}
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
                    <AccessSelect
                      value={selectedAccessToGrant?.toString() ?? ""}
                      onChangeValue={(v) => setSelectedAccessToGrant(Number(v))}
                      labelMode="inside"
                    />

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
          </TabsContent>

          <TabsContent value="restrictions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="space-y-4 lg:col-span-1">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldX className="h-5 w-5" />
                  Restringir acesso
                </div>

                {loadingAllAccesses ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <AccessSelect
                      value={selectedAccessToRestrict?.toString() ?? ""}
                      onChangeValue={(v) =>
                        setSelectedAccessToRestrict(Number(v))
                      }
                      labelMode="inside"
                    />

                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={handleCreateAccessRestriction}
                      disabled={!selectedAccessToRestrict || restrictingAccess}
                    >
                      {restrictingAccess
                        ? "A restringir..."
                        : "Adicionar restrição"}
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-4 lg:col-span-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ShieldX className="h-5 w-5" />
                  Restrições do utilizador
                </div>

                {loadingAccessRestrictions ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : accessRestrictionsError ? (
                  <p className="text-destructive">
                    Erro ao carregar restrições.
                  </p>
                ) : activeAccessRestrictions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <ShieldX className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Este utilizador não tem restrições de acesso.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activeAccessRestrictions.map((restriction) => (
                      <div
                        key={restriction.codigo_acesso}
                        className="flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShieldX className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-sm">
                              {restriction.codigo_acesso} –{" "}
                              {restriction.designacao}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Sigla: {restriction.sigla}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Ativa</Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRemoveAccessRestriction(
                                restriction.codigo_acesso,
                              )
                            }
                            disabled={removingRestriction}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
