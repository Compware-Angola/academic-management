import { Badge } from "@/components/ui/badge";
import { InvoiceEnum } from "@/enums/invoice.enum";

type InvoiceStatusBadgeProps = {
  status: number;
};
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  switch (status) {
    case InvoiceEnum.PAGO:
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <span className="size-1.5 rounded-full bg-green-600 mr-1.5" />
          Pago
        </Badge>
      );
    case InvoiceEnum.PENDENTE:
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
          <span className="size-1.5 rounded-full bg-amber-600 mr-1.5" />
          Pendente
        </Badge>
      );
    case InvoiceEnum.PARCELADO:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Parcelado
        </Badge>
      );
    case InvoiceEnum.ISENTO:
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <span className="size-1.5 rounded-full bg-gray-600 mr-1.5" />
          Isento
        </Badge>
      );

    case InvoiceEnum.ANULADO:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejeitado
        </Badge>
      );
  }
}
