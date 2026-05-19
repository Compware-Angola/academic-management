import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";
import { TableActions } from "./TableActions";

export const MovementRow = ({
  movement,
  onViewDetails,
  onValidate,
}: {
  movement: CashRegisterMovement;
  onViewDetails: (movement: CashRegisterMovement) => void;
  onValidate: (
    movement: CashRegisterMovement,
    action: "approved" | "rejected",
  ) => void;
}) => {
  const getStatusBadge = (status: string, adminStatus?: string) => {
    if (adminStatus === "validado") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-green-200"
        >
          Validado
        </Badge>
      );
    }

    if (adminStatus === "nao validado") {
      return <Badge variant="destructive">Rejeitado</Badge>;
    }

    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      aberto: "outline",
      fechado: "secondary",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  // Função para formatar hora
  const formatTime = (time: string | null) => {
    if (!time) return "---";
    // Se já vem no formato HH:MM:SS, pega só HH:MM
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return time;
  };

  // Função para formatar data
  const formatDate = (date: string | null) => {
    if (!date) return "---";
    return new Date(date).toLocaleDateString();
  };

  return (
    <TableRow key={movement.code}>
      <TableCell className="text-muted-foreground text-xs font-mono">
        #{String(movement.code).padStart(3, "0")}
      </TableCell>
      <TableCell className="font-medium">
        {movement.cash_register_name}
      </TableCell>
      <TableCell className="text-sm">{movement.operator_name}</TableCell>
      <TableCell className="text-green-600 font-medium">
        {formatCurrencyAOA(movement.opening_amount)}
      </TableCell>
      <TableCell className="text-blue-600 font-medium">
        {formatCurrencyAOA(movement.total_collected_amount)}
      </TableCell>
      <TableCell className="text-sm">{formatDate(movement.date_at)}</TableCell>
      <TableCell className="text-sm font-mono">
        {formatTime(movement.opening_time)}
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(movement.closing_date)}
      </TableCell>
      <TableCell className="text-sm font-mono">
        {formatTime(movement.closing_time)}
      </TableCell>
      <TableCell>
        {getStatusBadge(movement.status, movement.admin_status)}
      </TableCell>
      <TableCell className="text-center">
        <TableActions
          movement={movement}
          onViewDetails={onViewDetails}
          onValidate={onValidate}
        />
      </TableCell>
    </TableRow>
  );
};
