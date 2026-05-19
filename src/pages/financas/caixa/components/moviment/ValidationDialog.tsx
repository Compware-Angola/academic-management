import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { Loader2 } from "lucide-react";

export const ValidationDialog = ({
    open,
    movement,
    action,
    rejectionReason,
    isValidating,
    onOpenChange,
    onRejectionReasonChange,
    onConfirm,
}: {
    open: boolean;
    movement: CashRegisterMovement | null;
    action: "approved" | "rejected" | null;
    rejectionReason: string;
    isValidating: boolean;
    onOpenChange: (open: boolean) => void;
    onRejectionReasonChange: (reason: string) => void;
    onConfirm: () => void;
}) => {
    const isApproved = action === "approved";
    const movementCode = movement ? String(movement.code).padStart(3, "0") : "";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isApproved ? "Aprovar Movimento" : "Rejeitar Movimento"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isApproved
                            ? `Tem certeza que deseja aprovar o movimento #${movementCode}?`
                            : `Tem certeza que deseja rejeitar o movimento #${movementCode}?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {!isApproved && (
                    <div className="space-y-2 py-4">
                        <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
                        <Textarea
                            id="rejectionReason"
                            placeholder="Informe o motivo da rejeição..."
                            value={rejectionReason}
                            onChange={(e) => onRejectionReasonChange(e.target.value)}
                            rows={4}
                            disabled={isValidating}
                        />
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isValidating}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isValidating}
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className={
                            isApproved
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                        }
                    >
                        {isValidating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isApproved ? "Aprovar" : "Rejeitar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

















