import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
    CreditCard,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { MonthlyFee } from "@/services/academiccalendar/fetch-academic-year-monthly-fees";


type Props = {
    yearLabel?: string;
    monthlyFees: MonthlyFee[];
    paginatedMonthlyFees: MonthlyFee[];
    isLoading?: boolean;
    isFetching?: boolean;

    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;

    currentPage: number;
    setCurrentPage: (value: number | ((p: number) => number)) => void;

    totalPages: number;

    formatarData: (date: string) => string;
};

export function MonthlyFeesTableCard({
    yearLabel,
    monthlyFees,
    paginatedMonthlyFees,
    isLoading,
    isFetching,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    formatarData,
}: Props) {
    const isBusy = isLoading || isFetching;

    const overdueCount = monthlyFees.filter(
        (f) => new Date(f.dataLimite) < new Date()
    ).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Calendário de Mensalidades — {yearLabel}
                </CardTitle>

                <CardDescription>
                    Total de prestações: {monthlyFees.length} • Vencidas: {overdueCount}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isBusy ? (
                    <div className="space-y-3">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : monthlyFees.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">
                            Nenhum calendário de mensalidades encontrado para este ano letivo.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Tabela */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-32">Mês</TableHead>
                                        <TableHead>Prestação</TableHead>
                                        <TableHead>Semestre</TableHead>
                                        <TableHead>Data Limite</TableHead>
                                        <TableHead className="text-center w-32">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {paginatedMonthlyFees.length > 0 ? (
                                        paginatedMonthlyFees.map((fee, i) => {
                                            const isOverdue = new Date(fee.dataLimite) < new Date();

                                            return (
                                                <TableRow
                                                    key={i}
                                                    className={`hover:bg-muted/50 transition-colors ${isOverdue ? "opacity-70" : ""
                                                        }`}
                                                >
                                                    <TableCell className="font-medium">
                                                        {fee.designacao}
                                                    </TableCell>
                                                    <TableCell>{fee.prestacao}ª Prestação</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {fee.semestre}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatarData(fee.dataLimite.split("T")[0])}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {isOverdue ? (
                                                            <Badge variant="destructive">Vencido</Badge>
                                                        ) : (
                                                            <Badge className="bg-primary/10 text-primary">
                                                                Pendente
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-10 text-muted-foreground"
                                            >
                                                Nenhuma prestação nesta página.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginação */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Itens por página:</span>
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(v) => setItemsPerPage(Number(v))}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[6, 12, 24].map((size) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                                {Math.min(currentPage * itemsPerPage, monthlyFees.length)} de{" "}
                                {monthlyFees.length}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>

                                <span className="px-3 text-sm font-medium">
                                    {currentPage} / {totalPages || 1}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Próximo
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages || 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}