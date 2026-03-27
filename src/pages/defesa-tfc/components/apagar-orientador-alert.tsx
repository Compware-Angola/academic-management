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
import { useMutationApagarOrientador } from "@/hooks/defesa-tfc/apagar-orientador-tfc";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orientadorId: number;
  anoLectivoId: number;
};
export function ApagarOrientadorAlert(props: Props) {
  const { open, onOpenChange, orientadorId, anoLectivoId } = props;
  const { mutateAsync: apagarOrientador, isPending } =
    useMutationApagarOrientador();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar Orientador</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja apagar este orientador? Todos alunos
            orientados por este orientador serão desvinculados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="cursor-pointer bg-destructive hover:bg-destructive/80 text-destructive-foreground"
            onClick={async () => {
              await apagarOrientador({ orientadorId, anoLectivoId });
              onOpenChange(false);
            }}
          >
            Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
