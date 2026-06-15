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
import { Loader2 } from "lucide-react";
import { PagamentoBolsa } from "@/services/financas/bolsa/pagamento-bolsa.service";
import { Button } from "@/components/ui/button";
import { useDeletePagamentoBolsa } from "@/hooks/financas/bolsa/pagamento-bolsa";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selected: PagamentoBolsa | null;
};

export function DeletePagamentoBolsaDialog({
    open,
    onOpenChange,
    selected,

}: Props) {
    const { mutateAsync: deletePagamentoBolsa, isPending: isDeleting } = useDeletePagamentoBolsa()

    async function handleDelete() {
        if (!selected) return
        await deletePagamentoBolsa(selected.codigo_pagamento)
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={(value) => {
            if (!isDeleting) onOpenChange(value)
        }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmar eliminação
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Tens certeza que queres eliminar este pagamento de bolsa?
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancelar
                    </AlertDialogCancel>

                    <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Eliminar
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}