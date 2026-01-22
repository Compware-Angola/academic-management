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
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

import { ReferenciasPagamentoItem } from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";
import { PagamentoReferenciaStatus } from "./PagamentoReferenciaStastus";
import { formatarData } from "@/util/date-formate";
import { useQueryFacturaItens } from "@/hooks/horario/use-query-invoice";

interface PagamentoReferenciaModalProps {
  selectedPagamento: ReferenciasPagamentoItem;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const PagamentoReferenciaModal = ({
  isModalOpen,
  selectedPagamento,
  setIsModalOpen,
}: PagamentoReferenciaModalProps) => {
  const { data: facturaItens, isLoading: isLoadingFacturaItens } =
    useQueryFacturaItens(selectedPagamento?.codigo_factura);
  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Detalhes do Pagamento - {selectedPagamento?.referencia}
            </DialogTitle>
          </DialogHeader>

          {selectedPagamento && (
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
                      {selectedPagamento?.codigo_matricula}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-medium">{selectedPagamento?.nome}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" /> Curso
                    </p>
                    <p className="font-medium">{selectedPagamento?.curso}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Campus
                    </p>
                    <p className="font-medium">{selectedPagamento?.polo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Contacto
                    </p>
                    <p className="font-medium">{selectedPagamento?.contacto}</p>
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
                      {selectedPagamento?.referencia}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-medium text-lg text-primary">
                      {selectedPagamento?.preco}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <PagamentoReferenciaStatus
                      status={selectedPagamento?.estado}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Data de Pagamento
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_pagamento)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data de Registo
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_inicio)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data de Validação
                    </p>
                    <p className="font-medium">
                      {formatarData(selectedPagamento?.data_final)}
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
                          {selectedPagamento?.codigo_factura}
                        </TableCell>
                        <TableCell>{item?.preco}</TableCell>
                        <TableCell>{item?.quantidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
