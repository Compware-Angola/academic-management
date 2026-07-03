import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryFacturaItens } from "@/hooks/horario/use-query-invoice";
import { PaymentNoteActions } from "@/pages/financas/components/views/uma-payment-invoice";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { StatusBadge } from "./status-badge";
import {
  Factura,
  FacturaItem,
} from "@/services/finance/listar-facturas.service";
import { formatCurrency, formatDate } from "@/util/finance-format";

type FacturaDetalhesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factura: Factura | undefined;
};

export function FacturaDetalhesModal({
  open,
  onOpenChange,
  factura,
}: FacturaDetalhesModalProps) {
  const { hasPermission } = usePermission();

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetching: isFetchingItens,
  } = useQueryFacturaItens(factura?.codigo ?? undefined);

  const cadeirasRecurso = useMemo(
    () =>
      factura?.cadeiras_recurso_epoca_especial
        ? factura.cadeiras_recurso_epoca_especial.split(" , ")
        : [],
    [factura?.cadeiras_recurso_epoca_especial],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl! max-h-[90vh]! overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md">
        <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="flex items-center justify-between gap-4 text-2xl font-bold">
            <div className="flex items-center gap-3">
              Detalhes da Nota de Pagamento
              {factura && (
                <span className="inline-flex px-3 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium">
                  {factura.referencia || factura.codigo || "—"}
                </span>
              )}
            </div>
            {factura && <StatusBadge status={factura.estado} />}
          </DialogTitle>
        </DialogHeader>

        {factura && (
          <div className="space-y-8 pt-6">
            {/* Valor total destacado */}
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatCurrency(factura.total_preco)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Valor a Pagar
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(factura.valor_pagar)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Emitida em
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatDate(factura.data_factura)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados do Estudante */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dados do Estudante</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Código da Matrícula
                  </p>
                  <p className="font-medium font-mono">
                    {factura.codigo_matricula || "—"}
                  </p>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-sm text-muted-foreground">
                    Nome do Estudante
                  </p>
                  <p className="font-semibold text-lg">
                    {factura.nome_aluno || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="font-medium">{factura.curso || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ano Lectivo</p>
                  <p className="font-medium">{factura.ano_lectivo || "—"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações da Nota */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Informações da Nota
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Nº da Nota</p>
                  <p className="font-medium font-mono">
                    {factura.referencia || factura.codigo || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nº da Operação Bancária
                  </p>
                  <p className="font-medium font-mono">
                    {factura.n_operacao_bancaria || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data de Emissão
                  </p>
                  <p className="font-medium">
                    {formatDate(factura.data_factura)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data de Pagamento
                  </p>
                  <p className="font-medium">
                    {formatDate(factura.data_pagamento)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Multa</p>
                  <p className="font-medium text-orange-600 dark:text-orange-400">
                    {formatCurrency(factura.total_multa || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <StatusBadge status={factura.estado} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Itens da Factura */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Itens da Nota de Pagamento
              </h3>

              {isLoadingItens || isFetchingItens ? (
                <div className="py-10 text-center text-muted-foreground bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  A carregar itens da factura...
                </div>
              ) : !itens?.data?.length ? (
                <div className="py-10 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30 text-muted-foreground">
                  Nenhum item encontrado para esta nota de pagamento
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-center">Multa</TableHead>
                        <TableHead className="text-right">
                          Valor Unit.
                        </TableHead>
                        <TableHead className="text-right pr-6">
                          Valor Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.data.map((item: FacturaItem, index: number) => {
                        const cadeira = cadeirasRecurso[index];

                        const descricaoCompleta =
                          (item.descricaoservico || "—") +
                          (cadeira ? ` (${cadeira})` : "") +
                          (Number(item.mesid) !== 3 &&
                          item.mesid &&
                          item.mesdescricao
                            ? ` (${item.mesdescricao})`
                            : "");

                        return (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell>{descricaoCompleta}</TableCell>
                            <TableCell className="text-center">
                              {item.quantidade ?? 1}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 dark:text-orange-400">
                              {item.multa ? formatCurrency(item.multa) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(item.preco)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold pr-6">
                              {formatCurrency(item.total)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                        <TableCell colSpan={4} className="text-right">
                          Total Unitário
                        </TableCell>
                        <TableCell className="text-right text-primary pr-6">
                          {formatCurrency(
                            itens.data.reduce((total, item) => {
                              const quantidade = item.quantidade ?? 1;
                              return total + item.preco * quantidade;
                            }, 0),
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                        <TableCell colSpan={4} className="text-right">
                          Total Preço
                        </TableCell>
                        <TableCell className="text-right text-primary pr-6">
                          {formatCurrency(
                            itens.data.reduce((total, item) => {
                              const quantidade = item.quantidade ?? 1;
                              return total + item.total * quantidade;
                            }, 0),
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <Separator />

            {/* Ações */}
            <div className="flex justify-end pt-2">
              <PaymentNoteActions
                nota={factura}
                itens={itens?.data || []}
                showDownload={true}
                showPrint={true}
                showliquidarNota={hasPermission(
                  PermissionTypeDetails.LIQUIDAR_NOTA_PAGAMENTO.sigla,
                )}
              />
            </div>
          </div>
        )}

        {!factura && (
          <div className="py-12 text-center text-muted-foreground">
            Não foi possível carregar os detalhes desta nota de pagamento.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
