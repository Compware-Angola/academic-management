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
import { Shield, ShieldCheck, Users, ChevronRight } from "lucide-react";

import { format } from "date-fns";
import { User } from "@/services/access/fect-users.service";
import { UserGroup } from "@/services/access/fetch-user-group.service";
import { useUserGroups } from "@/hooks/acess/use-user-groups";
import { useGroupAccesses } from "@/hooks/acess/use-query-group-accesses";

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

  const {
    data: groups = [],
    isLoading: loadingGroups,
    error: errorGroups,
  } = useUserGroups({ userId: user.codigo, enabled: open });

  const {
    data: accesses = [],
    isLoading: loadingAccesses,
    error: errorAccesses,
  } = useGroupAccesses({
    groupId: selectedGroup?.codigo || 0,
    enabled: !!selectedGroup && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-primary" />
            Permissões de Acesso – {user.nome}
            <Badge variant="outline" className="ml-2">
              Código: {user.codigo}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Coluna 1: Grupos do utilizador */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5" />
              Grupos Associados
            </div>

            {loadingGroups ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : errorGroups ? (
              <p className="text-destructive">Erro ao carregar grupos.</p>
            ) : groups.length === 0 ? (
              <p className="text-muted-foreground italic">
                Nenhum grupo associado a este utilizador.
              </p>
            ) : (
              <div className="space-y-2">
                {groups.map((group) => (
                  <Button
                    key={group.codigo}
                    variant={selectedGroup?.codigo === group.codigo ? "default" : "outline"}
                    className="w-full justify-between h-auto py-4 px-4 text-left"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div>
                      <div className="font-medium">{group.descricao}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Código do grupo: {group.codigo}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Coluna 2: Permissões do grupo selecionado */}
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
            ) : loadingAccesses ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : errorAccesses ? (
              <p className="text-destructive">Erro ao carregar permissões.</p>
            ) : accesses.length === 0 ? (
              <p className="text-muted-foreground italic">
                Este grupo não tem permissões associadas.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {accesses
                  .filter((a) => a.disponibilidade === 1)
                  .map((access) => (
                    <div
                      key={access.codigo}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
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
                              "dd/MM/yyyy HH:mm"
                            )}
                          </p>
                        )}
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                  ))}
                {accesses.filter((a) => a.disponibilidade !== 1).length > 0 && (
                  <details className="mt-4">
                    <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                      Mostrar permissões inativas (
                      {accesses.filter((a) => a.disponibilidade !== 1).length})
                    </summary>
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-muted">
                      {accesses
                        .filter((a) => a.disponibilidade !== 1)
                        .map((access) => (
                          <div
                            key={access.codigo}
                            className="text-sm text-muted-foreground"
                          >
                            {access.codigo} – {access.descricao}
                          </div>
                        ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}