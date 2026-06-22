import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
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
import { useListarPagamentoBolsa } from "@/hooks/financas/bolsa/pagamento-bolsa";
import { parseFilter } from "@/util/parse-filter";
import { Edit, Eye, Plus, RefreshCcw, Trash } from "lucide-react";
import { useState } from "react";
import { ModalUpsertPagamentoBolsa } from "./ModalUpsertPagamentoBolsa";
import { PagamentoBolsa } from "@/services/financas/bolsa/pagamento-bolsa.service";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DeletePagamentoBolsaDialog } from "./DeletePagamentoBolsaDialog";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ModalDetalhePagamentoBolsa } from "./ModalDetalhePagamentoBolsa";

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v);

export function RepoortByTableInstSemPagamentos() {
    const [filters, setFilters] = useState({
        anoLectivo: "all",
        semestre: "all",
        codigoBolsa: "all",
        codigoInstituicao: "all",
        apenasSemPagamento: "0", // ✅ string para ficar consistente com o Select
        page: 1,
        limit: 5,
    });

    const [openModalUpsert, setOpenModalUpsert] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedPagamentoBolsa, setSelectedPagamentoBolsa] = useState<PagamentoBolsa | null>(null);
    const [openDetalhe, setOpenDetalhe] = useState<PagamentoBolsa | null>(null);

    const handleOpenUpsert = () => {
        setSelectedPagamentoBolsa(null);
        setOpenModalUpsert(true);
    };

    const handleOpenDelete = (pagamentoBolsa: PagamentoBolsa) => {
        setSelectedPagamentoBolsa(pagamentoBolsa);
        setOpenModalDelete(true);
    };

    const { data, isLoading, isFetching, refetch } = useListarPagamentoBolsa({
        anoLectivo: parseFilter(filters.anoLectivo),
        semestre: parseFilter(filters.semestre),
        codigoBolsa: parseFilter(filters.codigoBolsa),
        codigoInstituicao: parseFilter(filters.codigoInstituicao),
        apenasSemPagamento: Number(filters.apenasSemPagamento), // ✅ converte só na hora de enviar
        page: filters.page,
        limit: filters.limit,
    });

    const pagamentoBolsa = data?.data ?? [];
    const meta = data?.meta;

    const handleClearFilters = () => {
        setFilters({
            anoLectivo: "all",
            semestre: "all",
            codigoBolsa: "all",
            codigoInstituicao: "all",
            apenasSemPagamento: "0", // ✅ consistente
            page: 1,
            limit: 10,
        });
    };

    const handleSetPage = (page: number) => {
        setFilters((f) => ({ ...f, page }));
    };

    const handleSetLimit = (limit: number) => {
        setFilters((f) => ({ ...f, limit, page: 1 }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-4">

                <Button variant="outline" onClick={handleClearFilters}>Limpar Filtros</Button>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                    Atualizar
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <AcademicYearSelect
                            onChangeValue={(v) => {
                                setFilters((f) => ({ ...f, anoLectivo: v }));
                                handleSetPage(1);
                            }}
                            value={filters.anoLectivo}
                            enableDefaultSelectItem
                        />

                        <SemestreSelect
                            onChangeValue={(v) => {
                                setFilters((f) => ({ ...f, semestre: v }));
                                handleSetPage(1);
                            }}
                            value={filters.semestre}
                            enableDefaultSelectItem
                        />




                    </div>
                </CardContent>
            </Card>

            <div className="space-y-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Bolsa</TableHead>
                                <TableHead>Instituição</TableHead>
                                <TableHead>Ano Letivo</TableHead>
                                <TableHead>Semestre</TableHead>
                                <TableHead>Nº Bolseiros</TableHead>

                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : pagamentoBolsa.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground py-10"
                                    >
                                        Nenhum registo encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagamentoBolsa.map((r) => (
                                    <TableRow
                                        key={r.codigo_pagamento}
                                        className={isFetching ? "opacity-50" : ""}
                                    >
                                        <TableCell className="font-medium">{r.codigo_pagamento}</TableCell>
                                        <TableCell className="font-medium">{r.bolsa}</TableCell>
                                        <TableCell>{r.instituicao}</TableCell>
                                        <TableCell>{r.ano_letivo ?? "N/A"}</TableCell>
                                        <TableCell>{r.semestre ?? "N/A"}</TableCell>
                                        <TableCell>{r.qtd_estudantes}</TableCell>
                                        <TableCell className="text-right">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        aria-label="Detalhes"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setOpenDetalhe(r)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Detalhes</p></TooltipContent>
                                            </Tooltip>


                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        {meta?.total ?? 0} registos · Página {meta?.page ?? 1} de{" "}
                        {meta?.totalPages ?? 1}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={filters.page <= 1 || isFetching}
                            onClick={() => handleSetPage(filters.page - 1)}
                        >
                            Anterior
                        </Button>

                        <Select
                            value={String(filters.limit)}
                            onValueChange={(value) => handleSetLimit(Number(value))}
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 15, 20, 50, 100].map((value) => (
                                    <SelectItem key={value} value={String(value)}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={
                                filters.page >= (meta?.totalPages ?? 1) ||
                                isFetching
                            }
                            onClick={() => handleSetPage(filters.page + 1)}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            </div>

            <ModalUpsertPagamentoBolsa
                open={openModalUpsert}
                setOpen={setOpenModalUpsert}
                selected={selectedPagamentoBolsa}
            />
            <DeletePagamentoBolsaDialog
                open={openModalDelete}
                onOpenChange={setOpenModalDelete}
                selected={selectedPagamentoBolsa}
            />
            <ModalDetalhePagamentoBolsa
                openDetalhe={openDetalhe}
                setOpenDetalhe={(o) => !o && setOpenDetalhe(null)}
                selected={openDetalhe}
            />
        </div>
    );
}