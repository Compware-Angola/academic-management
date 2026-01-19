import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { formatarData } from "@/util/date-formate";
import { useQueryFacturaDetalhes } from "@/hooks/financa/use-query-factura-detalhes";
import { NegociacaoItem } from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";
import { formatNumber } from "@/util/format-number";
import { useQueryFacturaItens } from "@/hooks/horario/use-query-invoice";

interface NegociacaoDividaModalProps {
  selectedNegociacao: NegociacaoItem;
  isModalOpen: boolean;
  facturaId: string;
  setIsModalOpen: () => void;
}
export const NegociacaoDividaModal = ({
  isModalOpen,
  selectedNegociacao,
  setIsModalOpen,
}: NegociacaoDividaModalProps) => {
  const { data: factura, isLoading: isLoadingFactura } =
    useQueryFacturaDetalhes(selectedNegociacao?.codigo_factura);

  const { data: facturaItens, isLoading: isLoadingFacturaItens } =
    useQueryFacturaItens(selectedNegociacao?.codigo_factura);

  const getStatusBadge = (status: number) => {
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
  const isLoading = isLoadingFactura || isLoadingFacturaItens;

  return (
    <>
      {/* Modal de Detalhes */}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Detalhes do Factura - {selectedNegociacao?.codigo_factura}
            </DialogTitle>
          </DialogHeader>
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">
                  Carregando Detalhes de Factura...
                </p>
              </div>
            ) : (
              <>
                {selectedNegociacao && (
                  <div className="space-y-6">
                    {/* Dados do Estudante */}
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                        <User className="h-5 w-5 text-primary" />
                        Dados do Estudante
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Código da Matrícula
                          </p>
                          <p className="font-medium">
                            {selectedNegociacao?.codigo_matricula}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Nome do Estudante
                          </p>
                          <p className="font-medium">
                            {selectedNegociacao?.nome}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" /> Curso
                          </p>
                          <p className="font-medium">
                            {selectedNegociacao?.curso}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Detalhes do Pagamento */}
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Detalhes da Factura
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Data Factura
                          </p>
                          <p className="font-mono font-medium">
                            {formatarData(factura?.DataFactura)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Valor Total
                          </p>
                          <p className="font-medium text-lg text-primary">
                            {formatNumber(factura?.TotalPreco)} kz
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total Multa
                          </p>
                          <p className="font-medium text-lg text-primary">
                            {formatNumber(factura?.TotalMulta)} kz
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Estado
                          </p>
                          {getStatusBadge(factura?.estado)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Valor A pagar
                          </p>
                          <p className="font-medium">
                            {formatNumber(factura?.ValorAPagar)} kz
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Descrição
                          </p>
                          <p className="font-medium">{factura?.Descricao}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Desconto
                          </p>
                          <p className="font-medium">
                            {formatNumber(factura?.Desconto)} kz
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Serviços */}
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                        <FileText className="h-5 w-5 text-primary" />
                        Serviços
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Quantidade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {facturaItens?.data?.map((facturaItem) => (
                            <TableRow>
                              <TableCell className="font-medium">
                                {facturaItem?.descricaoservico}{" "}
                                {facturaItem?.mesdescricao}
                              </TableCell>
                              <TableCell className="font-mono">
                                {formatNumber(facturaItem?.preco)}
                              </TableCell>
                              <TableCell className="font-mono">
                                {formatNumber(facturaItem?.preco)}
                              </TableCell>
                              <TableCell>{facturaItem?.quantidade}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};
