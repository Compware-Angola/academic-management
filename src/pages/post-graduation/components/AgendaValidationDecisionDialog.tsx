import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PostGraduationAgendaValidation } from "@/services/post-graduation/fetch-agenda-validations.service";

export type AgendaValidationDecision = "approve" | "reject";

type AgendaValidationDecisionDialogProps = {
  record: PostGraduationAgendaValidation | null;
  decision: AgendaValidationDecision | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function AgendaValidationDecisionDialog({
  record,
  decision,
  isPending,
  onOpenChange,
  onConfirm,
}: AgendaValidationDecisionDialogProps) {
  const isApprove = decision === "approve";

  return (
    <Dialog
      open={record !== null && decision !== null}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isApprove ? "Aprovar pauta" : "Rejeitar pauta"}
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <span className="block">
              Confirme a decisão sobre a pauta selecionada.
            </span>
            {record && (
              <span className="block space-y-1 rounded-md bg-muted/50 p-3 text-sm text-foreground">
                <span className="block">
                  <strong>UC:</strong> {record.curricularUnit}
                </span>
                <span className="block">
                  <strong>Docente:</strong> {record.teacher}
                </span>
                <span className="block">
                  <strong>Curso:</strong> {record.course}
                </span>
              </span>
            )}
            <span className="block text-sm font-medium text-destructive">
              A decisão não poderá ser alterada por este fluxo.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isApprove ? "default" : "destructive"}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isApprove ? "Aprovar" : "Rejeitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
