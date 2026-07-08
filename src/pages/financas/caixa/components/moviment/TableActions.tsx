import { Button } from "@/components/ui/button";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { CheckCircle, Eye, XCircle } from "lucide-react";

export const TableActions = ({
  movement,
  onViewDetails,
  onValidate,
}: {
  movement: CashRegisterMovement;

  onViewDetails: (movement: CashRegisterMovement) => void;
  onValidate?: (
    movement: CashRegisterMovement,
    action: "approved" | "rejected",
  ) => void;
}) => {
  const canValidate =
    movement.closing_date && movement.admin_status === "pendente";


  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onViewDetails(movement)}
        title="Ver detalhes"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {canValidate && !!onValidate && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onValidate(movement, "approved")}
            title="Aprovar movimento"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onValidate(movement, "rejected")}
            title="Rejeitar movimento"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
