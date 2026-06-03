import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeX, Eye, FileText, X } from "lucide-react";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";
import Lottie from "lottie-react";
import TimeLoader from "@/assets/timeloader.json";
import { useState } from "react";
import { AnularPagamentoModal } from "./AnularPagamentoModal";
import { AnularMultaModal } from "./AnularMultaModal";
import { HasPermission } from "@/components/common/HasPermission";
import { PermissionTypeDetails } from "@/constants/permission.type";

type PagamentosTableProps = {
  payments: PaymentItem[];
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  limit: number;
  setLimit: (l: number) => void;
  total: number | undefined;
  totalPages: number | undefined;
  onVerDetalhes: (pag: PaymentItem) => void;
};

const getStatusPagamentoBadge = (status: string) => {
  switch (status) {
    case "concluido":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      );
    case "pendente":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export function PagamentosTable({
  payments,
  loading,
  page,
  setPage,
  limit,
  setLimit,
  total,
  totalPages,
  onVerDetalhes,
}: PagamentosTableProps) {
  const [openAnularPagamentoModal, setAnularPagamentoModal] =
    useState<boolean>(false);
  const [openAnularMultaModal, setAnularMultaModal] = useState<boolean>(false);
  const [selectedPagId, setSelectedPagId] = useState<number>(1);

  const closePagamentoModal = () => setAnularPagamentoModal(false);
  const openPagamentoModal = (pagId: number) => {
    setSelectedPagId(pagId);
    setAnularPagamentoModal(true);
  };

  //MULTA
  const closeMultaModal = () => setAnularMultaModal(false);
  const openMultaModal = (pagId: number) => {
    setSelectedPagId(pagId);
    setAnularMultaModal(true);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <div className="h-[300px]">
                <div className="flex justify-center items-center">
                  <Lottie
                    animationData={TimeLoader}
                    loop={true}
                    style={{ width: 200, height: 200 }}
                  />
                </div>
                <p className="text-center">Carregando pagamentos ...</p>
              </div>
            </>
          ) : payments.length == 0 ? (
            <>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Nenhum registo encontrado
                </p>
                <p className="text-sm text-muted-foreground">
                  Utilize os filtros acima para pesquisar
                </p>
              </div>
            </>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left whitespace-nowrap">
                      Código
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Factura
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Curso
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Código Matrícula
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Estudante
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Nº Operação Bancária
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Nº 2ª Operação Bancária
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Forma de Pagamento
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Nome Operador
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Caixa
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Canal
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      Valor Total
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      Valor Depositado
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Data Banco
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Data Registo
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Status Pgto.
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap">
                      Tipo de Pagamento
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((pag) => (
                    <TableRow key={pag.codigo_pagamento}>
                      <TableCell className="whitespace-nowrap">
                        {pag?.codigo_pagamento}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {pag?.codigo_factura || "---"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {pag?.curso || "---"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {pag?.codigo_matricula || "---"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <p className="text-sm font-medium whitespace-nowrap">
                          {pag?.nome_completo || "---"}
                        </p>
                      </TableCell>

                      <TableCell className="font-mono text-sm whitespace-nowrap">
                        {pag?.operacao_bancaria || "---"}
                      </TableCell>

                      <TableCell className="font-mono text-sm whitespace-nowrap">
                        {pag?.seg_operacao_bancaria || "---"}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        {pag?.forma_pagamento || "---"}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        {pag?.nome_operador || "---"}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        {pag?.caixa || "---"}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        {pag?.canal || "---"}
                      </TableCell>

                      <TableCell className="text-right font-medium whitespace-nowrap">
                        {formatNumber(pag?.totalgeral || 0)}
                      </TableCell>

                      <TableCell className="text-right font-medium whitespace-nowrap">
                        {formatNumber(pag?.valor_depositado || 0)}
                      </TableCell>

                      <TableCell className="text-center text-sm whitespace-nowrap">
                        {formatarData(pag?.databanco || "")}
                      </TableCell>

                      <TableCell className="text-center text-sm whitespace-nowrap">
                        {formatarData(pag?.data_registro || "")}
                      </TableCell>

                      <TableCell className="text-center">
                        {getStatusPagamentoBadge(pag?.status_pagamento || "")}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        {pag?.tipo_pagamento || "---"}
                      </TableCell>

                      <TableCell className="text-center space-x-1 whitespace-nowrap">
                        <HasPermission
                          permission={PermissionTypeDetails.ANULAR_MULTA.sigla!}
                        >
                          <Button
                            size="sm"
                            variant="secondary"
                            title="Anular Multa"
                            onClick={() => openMultaModal(pag.codigo_pagamento)}
                          >
                            <BadgeX className="h-3 w-3" />
                          </Button>
                        </HasPermission>
                        <HasPermission
                          permission={
                            PermissionTypeDetails.ANULAR_PAGAMENTO.sigla!
                          }
                        >
                          <Button
                            size="sm"
                            variant="destructive"
                            title="Anular Pagamento"
                            onClick={() =>
                              openPagamentoModal(pag.codigo_pagamento)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </HasPermission>

                        <Button
                          size="sm"
                          variant="outline"
                          title="Ver Detalhes"
                          onClick={() => onVerDetalhes(pag)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {payments.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Próxima
                  </Button>

                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <AnularPagamentoModal
        paymentId={selectedPagId}
        open={openAnularPagamentoModal}
        onClose={closePagamentoModal}
      />
      <AnularMultaModal
        paymentId={selectedPagId}
        open={openAnularMultaModal}
        onClose={closeMultaModal}
      />
    </>
  );
}
