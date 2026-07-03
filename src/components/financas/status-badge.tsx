import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<number, { label: string; className: string }> = {
  0: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  1: {
    label: "Pago",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  2: {
    label: "Parcelado",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  3: {
    label: "Anulado",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export function StatusBadge({ status }: { status: number }) {
  const config = STATUS_CONFIG[status];
  if (!config) return <Badge>Desconhecido</Badge>;
  return <Badge className={config.className}>{config.label}</Badge>;
}
