import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { NegociacaoItem } from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";

interface NegociacaoDeleteModalProps {
  isOpen: boolean;
  negociacao: NegociacaoItem | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const NegociacaoDeleteModal = ({
  isOpen,
  negociacao,
  isLoading = false,
  onClose,
  onConfirm,
}: NegociacaoDeleteModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            Eliminar Negociação de Dívida
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem a certeza que deseja eliminar a negociação de dívida do aluno{" "}
            <span className="font-medium text-foreground">
              {negociacao?.nome}
            </span>{" "}
            (matrícula {negociacao?.codigo_matricula})? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
