import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useListarPagamentoBolsa } from "@/hooks/financas/bolsa/use-query-listar-pagamento-bolsa";
import { parseFilter } from "@/util/parse-filter";
import { TabsContent } from "@radix-ui/react-tabs";
import { Eye } from "lucide-react";
type BolsoBolsaPagamentosTableProps = {
    filters?: {
        codigoBolsa?: string;
        codigoInstituicao?: string;
        anoLectivo?: string;
        semestre?: string;
        page?: number;
        limit?: number;
    };
    onSetPage: (page: number) => void
};
const fmt = (v: number) =>
    new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
        maximumFractionDigits: 0,
    }).format(v);
export function PagamentosBolsasTable({
    filters,
    onSetPage
}: BolsoBolsaPagamentosTableProps) {
    console.log(filters)



    const { data, isLoading, isFetching } = useListarPagamentoBolsa({
        anoLectivo: parseFilter(filters?.anoLectivo),
        semestre: parseFilter(filters?.semestre),
        codigoBolsa: parseFilter(filters?.codigoBolsa),
        codigoInstituicao: parseFilter(filters?.codigoInstituicao),
        page: filters?.page,
        limit: filters?.limit,
    });

    const pagamentoBolsa = data?.data ?? [];
    const meta = data?.meta;

    return (
        <TabsContent value="tabela" className="mt-4">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bolsa</TableHead>
                                <TableHead>Instituição</TableHead>
                                <TableHead>Ano Letivo</TableHead>
                                <TableHead>Semestre</TableHead>
                                <TableHead>Nº Bolseiros</TableHead>
                                <TableHead>Valor Depositado</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : pagamentoBolsa.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground py-10"
                                    >
                                        Nenhum registo encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagamentoBolsa.map((r) => (
                                    <TableRow
                                        key={r.codigo_bolsa}
                                        className={isFetching ? "opacity-50" : ""}
                                    >
                                        <TableCell className="font-medium">{r.bolsa}</TableCell>

                                        <TableCell>{r.instituicao}</TableCell>

                                        <TableCell>{r.ano_lectivo ?? "N/A"}</TableCell>

                                        <TableCell>{r.semestre ?? "N/A"}</TableCell>

                                        <TableCell>{r.qtd_estudantes}</TableCell>

                                        <TableCell>{fmt(r.valor_depositado ?? 0)}</TableCell>

                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                    {meta?.total ?? 0} registos · Página {meta?.page ?? 1} de{" "}
                    {meta?.totalPages ?? 1}
                </p>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={filters?.page <= 1 || isFetching}
                        onClick={() => onSetPage(filters?.page - 1)}
                    >
                        Anterior
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={filters?.page >= (meta?.totalPages ?? 1) || isFetching}
                        onClick={() => onSetPage(filters?.page + 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </div>
        </TabsContent>
    );
}
