import { Badge } from "@/components/ui/badge";

type PaymentStatus = "Pending" | "Success" | "Failed" | "Expired";

type PagamentoReferenciaStatusProps = {
  status: string;
};

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  Pending: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  Success: {
    label: "Sucesso",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  Failed: {
    label: "Falhado",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  Expired: {
    label: "Expirado",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export const PagamentoReferenciaStatus = ({
  status,
}: PagamentoReferenciaStatusProps): JSX.Element => {
  const config = STATUS_CONFIG[status as PaymentStatus];

  if (!config) {
    return <Badge>Desconhecido</Badge>;
  }

  return <Badge className={config.className}>{config.label}</Badge>;
};
