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
import { useMutationApagarVinculo } from "@/hooks/defesa-tfc/apagar-vinculo-tfc";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vinculoId: number;
};
export function ApagarVinculoAlert(props: Props) {
  const { open, onOpenChange, vinculoId } = props;
  const { mutateAsync: apagarVinculo, isPending } = useMutationApagarVinculo();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar Vinculo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja apagar este vinculo?
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
              await apagarVinculo(vinculoId);
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
