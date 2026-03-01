import { Badge } from "../ui/badge";
interface PagamentoStatusProps {
  status: number;
}
const PagamentoStatus = ({ status }: PagamentoStatusProps) => {
  switch (status) {
    case 0:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pendente
        </Badge>
      );
    case 1:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Pago
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Parcelado
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Anulado
        </Badge>
      );
    default:
      return <Badge>Desconhecido</Badge>;
  }
};
export { PagamentoStatus };
