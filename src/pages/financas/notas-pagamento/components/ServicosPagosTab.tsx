import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Loader2 } from "lucide-react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { useQueryServicosPagosAluno } from "@/hooks/financas/pagamentos-mensais/use-query-servicos-pagos-aluno";

type TipoServico = "TODOS" | "MENSALIDADES" | "SERVICOS";

type ServicosParams = {
    anoLectivo: number;
    codigoMatricula: number;
    tipo: TipoServico;
};

export function ServicosPagosTab() {
    const [tipoServicoPago, setTipoServicoPago] = useState<TipoServico>("TODOS");
    const [mostrarServicosPagos, setMostrarServicosPagos] = useState(false);
    const [servicosParams, setServicosParams] = useState<ServicosParams>({
        anoLectivo: 0,
        codigoMatricula: 0,
        tipo: "TODOS",
    });

    const { data: servicosPagosAluno = [], isLoading: loadingServicosPagos } =
        useQueryServicosPagosAluno(servicosParams, {
            enabled:
                mostrarServicosPagos &&
                !!servicosParams.anoLectivo &&
                !!servicosParams.codigoMatricula,
        });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Consulta de serviços pagos do aluno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AcademicYearSelect
                            value={String(servicosParams.anoLectivo || "")}
                            onChangeValue={(v) =>
                                setServicosParams((prev) => ({
                                    ...prev,
                                    anoLectivo: parseFilter(v),
                                }))
                            }
                        />

                        <div>
                            <Label>Código da Matrícula</Label>
                            <Input
                                type="number"
                                placeholder="Código da matrícula"
                                value={servicosParams.codigoMatricula || ""}
                                onChange={(e) =>
                                    setServicosParams((prev) => ({
                                        ...prev,
                                        codigoMatricula: parseFilter(e.target.value),
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <Label>Tipo</Label>
                            <Select
                                value={tipoServicoPago}
                                onValueChange={(value) => {
                                    const tipo = value as TipoServico;
                                    setTipoServicoPago(tipo);
                                    setServicosParams((prev) => ({ ...prev, tipo }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODOS">Todos</SelectItem>
                                    <SelectItem value="MENSALIDADES">Mensalidades</SelectItem>
                                    <SelectItem value="SERVICOS">Serviços</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={() => setMostrarServicosPagos(true)}>
                        <Search className="h-4 w-4 mr-2" />
                        Consultar Serviços
                    </Button>
                </CardContent>
            </Card>

            {mostrarServicosPagos && (
                <Card>
                    <CardHeader>
                        <CardTitle>Serviços pagos do aluno</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Serviço</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Data pag. Banco</TableHead>
                                    <TableHead>Data de validação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingServicosPagos ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <Loader2 className="animate-spin text-primary mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : servicosPagosAluno.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            Nenhum serviço pago encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    servicosPagosAluno.map((item) => (
                                        <TableRow key={item.codigo}>
                                            <TableCell>{item.codigo}</TableCell>
                                            <TableCell>{item.servico}</TableCell>
                                            <TableCell>{formatNumber(item.valor)}</TableCell>
                                            <TableCell>
                                                {formatarData(item.data_pagamento_banco)}
                                            </TableCell>
                                            <TableCell>
                                                {formatarData(item.data_validacao)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}