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
import { Eye, Loader2 } from "lucide-react";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";



type PagamentosTableProps = {
    payments: PaymentItem[];
    loading: boolean;
    page: number;
    setPage: (p: number) => void;
    limit: number;
    setLimit: (l: number) => void;
    total: number | undefined;
    totalPages: number | undefined;
    onVerDetalhes: (codigoFactura: number) => void;
};

const getStatusPagamentoBadge = (status: string) => {
    switch (status) {
        case "concluido":
            return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
        case "pendente":
            return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pagamentos ({payments.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Factura</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Código Matricula</TableHead>
                            <TableHead>Estudante</TableHead>
                            <TableHead>Nº da Operação bancaria</TableHead>
                            <TableHead>Nº da 2º Operação bancaria</TableHead>
                            <TableHead>Forma de Pagamento</TableHead>
                            <TableHead>Nome Operador</TableHead>
                            <TableHead>Caixa</TableHead>
                            <TableHead>Canal</TableHead>
                            <TableHead>Valor Total</TableHead>
                            <TableHead>Valor Depositado</TableHead>
                            <TableHead>Data Banco</TableHead>
                            <TableHead>Data Registro</TableHead>
                            <TableHead>Status Pgto.</TableHead>
                            <TableHead>Tipo de Pagamento</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="animate-spin text-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                                    Nenhum pagamento encontrado com os filtros aplicados
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((pag) => (
                                <TableRow key={pag.codigo_pagamento}>
                                    <TableCell>{pag?.codigo_pagamento}</TableCell>
                                    <TableCell>{pag?.codigo_factura || "---"}</TableCell>
                                    <TableCell>{pag?.curso}</TableCell>
                                    <TableCell>{pag?.codigo_matricula}</TableCell>
                                    <TableCell>
                                        <p className="font-medium text-sm">{pag?.nome_completo || "---"}</p>
                                    </TableCell>
                                    <TableCell className="font-mono font-medium text-sm">
                                        {pag?.operacao_bancaria || "---"}
                                    </TableCell>
                                    <TableCell className="font-mono font-medium text-sm">
                                        {pag?.seg_operacao_bancaria || "---"}
                                    </TableCell>
                                    <TableCell className="text-sm">{pag?.forma_pagamento || "---"}</TableCell>
                                    <TableCell className="font-mono text-sm">{pag?.nome_operador || "---"}</TableCell>
                                    <TableCell className="text-sm">{pag?.canal || "---"}</TableCell>
                                    <TableCell className="text-sm">{formatNumber(pag?.totalgeral || 0)}</TableCell>
                                    <TableCell className="font-medium font-mono text-sm">
                                        {formatNumber(pag?.valor_depositado || 0)}
                                    </TableCell>
                                    <TableCell className="text-sm">{formatarData(pag?.databanco || "")}</TableCell>
                                    <TableCell className="text-sm">{formatarData(pag?.data_registro || "")}</TableCell>
                                    <TableCell>{getStatusPagamentoBadge(pag?.status_pagamento || "")}</TableCell>
                                    <TableCell>{pag?.tipo_pagamento || "---"}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            title="Ver Detalhes"
                                            onClick={() => onVerDetalhes(pag?.codigo_factura)}
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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
            </CardContent>
        </Card>
    );
}