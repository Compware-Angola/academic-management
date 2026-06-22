import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useConciliacaoFinanceira } from "@/hooks/financas/bolsa/pagamento-bolsa";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";

export function ConciliacaoTab() {
    const [filters, setFilters] = useState({
        anoLectivo: "23",
        semestre: "all",
    });

    const { data, isLoading, error } = useConciliacaoFinanceira({
        anoLectivo: parseInt(filters.anoLectivo),
        semestre: parseInt(filters.semestre),
    }, {
        enabled: !!filters.anoLectivo
    });

    const rows = data?.data ?? [];

    const formatMoney = (value: number) =>
        new Intl.NumberFormat("pt-PT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value) + " Kz";

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Conciliado":
                return "border-green-500 text-green-600";
            case "Sem pagamento":
                return "border-amber-500 text-amber-600";
            case "Divergência significativa":
                return "border-red-500 text-red-600";
            default:
                return "";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-base">
                        Auditoria de Conciliação Financeira
                    </CardTitle>

                    <p className="text-sm text-muted-foreground mt-1">
                        Compare valores depositados vs valores esperados por
                        instituição
                    </p>
                </div>

                <div className="flex gap-2">
                    <AcademicYearSelect
                        value={filters.anoLectivo}

                        onChangeValue={(v) =>
                            setFilters((f) => ({
                                ...f,
                                anoLectivo: v,
                            }))
                        }
                    />

                    <SemestreSelect
                        value={filters.semestre}
                        enableDefaultSelectItem
                        onChangeValue={(v) =>
                            setFilters((f) => ({
                                ...f,
                                semestre: v,
                            }))
                        }
                    />
                </div>
            </CardHeader>

            <CardContent>
                {isLoading && (
                    <p className="text-sm text-muted-foreground">
                        Carregando dados...
                    </p>
                )}

                {error && (
                    <p className="text-red-500">
                        Erro ao carregar conciliação.
                    </p>
                )}

                {!isLoading && !error && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Instituição</TableHead>
                                <TableHead>Qtd Bolsas</TableHead>
                                <TableHead>Qtd Bolseiros</TableHead>
                                <TableHead>Valor Depositado</TableHead>
                                <TableHead>Valor Esperado</TableHead>
                                <TableHead>Diferença</TableHead>
                                <TableHead>% Divergência</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.length > 0 ? (
                                rows.map((c) => (
                                    <TableRow key={c.codigo_instituicao}>
                                        <TableCell className="font-medium">
                                            {c.instituicao}
                                        </TableCell>

                                        <TableCell>
                                            {c.qtd_bolsas}
                                        </TableCell>

                                        <TableCell>
                                            {c.qtd_bolseiros}
                                        </TableCell>

                                        <TableCell>
                                            {formatMoney(c.valor_depositado)}
                                        </TableCell>

                                        <TableCell>
                                            {formatMoney(c.valor_esperado)}
                                        </TableCell>

                                        <TableCell
                                            className={
                                                c.diferenca < 0
                                                    ? "text-red-600 font-medium"
                                                    : c.diferenca > 0
                                                        ? "text-amber-600 font-medium"
                                                        : "text-green-600"
                                            }
                                        >
                                            {formatMoney(c.diferenca)}
                                        </TableCell>

                                        <TableCell>
                                            {c.pct_divergencia.toFixed(2)}%
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusClass(
                                                    c.status_conciliacao
                                                )}
                                            >
                                                {c.status_conciliacao}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-6"
                                    >
                                        Nenhum dado encontrado
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}