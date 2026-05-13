import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRemoveGruopFromUser } from "@/hooks/acess/use-remove-gruop-from-user";
import { queryClient } from "@/lib/react-query";
import { GraduationCap, Loader2, Trash } from "lucide-react";

export interface UserItem {
  name: string;
  username: string;
  email: string | null;
  codigo_utilizador: number;
  grupoId: number;
}

export function mapStudent(original: any): UserItem {
  return {
    name: original.nome,
    username: original.username,
    email: original.email,
    codigo_utilizador: original.codigo_utilizador,
    grupoId: original.codigo_grupo,
  };
}

interface UserGroupCardProps {
  item: UserItem;
}

export function UserGroupCard({ item }: UserGroupCardProps) {
  const { mutateAsync: removeGrupo, isPending } = useRemoveGruopFromUser();
  async function handleRemoveGroup(userId: number, grupoId: number) {
    try {
      await removeGrupo({
        userId: userId,
        gruopId: grupoId,
      });
    } catch (err) {
      console.error("Erro ao remover grupo:", err);
    }
  }
  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 relative">
            <div className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium text-base">{item.name}</p>

              <p className="text-sm text-muted-foreground">{item.username}</p>

              <p className="text-sm text-muted-foreground">{item.email}</p>
            </div>
            <div className=" right-1 absolute top-1 rounded-full bg-primary/10">
              <Button
                variant="outline"
                className="rounded-full"
                size="icon"
                disabled={isPending}
                title="Editar grupo"
                onClick={() =>
                  handleRemoveGroup(item.codigo_utilizador, item.grupoId)
                }
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
