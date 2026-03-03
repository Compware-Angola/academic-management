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
  MapPin,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { formatarData } from "@/util/date-formate";
import {
  useQueryFacturaItens,
  useQueryFacturas,
} from "@/hooks/horario/use-query-invoice";
import { formatNumber } from "@/util/format-number";
import { Button } from "@/components/ui/button";

interface ListaPagamentoModalProps {
  factureId: number;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const ListaPagamentoModal = ({
  isModalOpen,
  factureId,
  setIsModalOpen,
}: ListaPagamentoModalProps) => {
  const { data: facturaItens, isLoading: isLoadingFacturaItens } =
    useQueryFacturaItens(factureId);
  const { data: facturaResponse, isLoading: isLoadingFactura } =
    useQueryFacturas(
      {
        codigoFatura: factureId,
      },
      !!factureId,
    );
  const factura = facturaResponse?.data?.[0];
  const isLoading = isLoadingFacturaItens || isLoadingFactura;
  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Detalhes do Pagamento - {factura?.referencia}
            </DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-6 h-24 flex justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="text-primary animate-in" />
                <p className="mt-2">Carregando Pagamento...</p>
              </div>
            </div>
          ) : factura ? (
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
                    <p className="font-medium">{factura?.codigo_matricula}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-medium">{factura?.nome_aluno}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" /> Curso
                    </p>
                    <p className="font-medium">{factura?.curso}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Campus
                    </p>
                    <p className="font-medium">{factura?.polo}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalhes do Pagamento */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Detalhes do Pagamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Referência</p>
                    <p className="font-mono font-medium">
                      {factura?.referencia}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-medium text-lg text-primary">
                      {factura?.total_preco}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Valor da Multa
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.total_multa)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Valor de Desconto
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.desconto)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Valor Apagar
                    </p>
                    <p className="font-medium">
                      {formatNumber(factura?.valor_pagar)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Data de Factura
                    </p>
                    <p className="font-medium">
                      {formatarData(factura?.data_factura)}
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
                      <TableHead>Factura Referente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturaItens?.data?.map((item) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          {item?.descricaoservico} {item?.mesdescricao}
                        </TableCell>
                        <TableCell className="font-mono">
                          {item?.codigofactura}
                        </TableCell>
                        <TableCell>{item?.preco}</TableCell>
                        <TableCell>{item?.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-lg">
                Detalhes da factura não encontrada.
              </p>
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => setIsModalOpen()}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos pagamentos
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
