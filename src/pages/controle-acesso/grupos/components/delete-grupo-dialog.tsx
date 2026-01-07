import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteGrupo } from "@/hooks/controle-acesso/use-delete-grupo";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DeleteGrupoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupoId?: number;
  grupoNome?: string;
  onDeleted?: () => void;
}

export function DeleteGrupoDialog({
  open,
  onOpenChange,
  grupoId,
  grupoNome,
  onDeleted,
}: DeleteGrupoDialogProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteGrupo();

  const handleDelete = async () => {
    if (!grupoId) return;

    try {
      await deleteMutation.mutateAsync(grupoId);
      toast({
        title: "Sucesso",
        description: "Grupo excluído com sucesso",
      });
      onDeleted?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir o grupo",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o grupo <strong>{grupoNome}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center gap-2"
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
