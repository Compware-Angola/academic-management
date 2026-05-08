import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { PagamentosFiltros } from "./PagamentosFiltros";
import { PagamentosTable } from "./PagamentosTable";
import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";

type SearchByType =
    | "codigoMatricula"
    | "nome"
    | "n_operacao_bancaria"
    | "n_operacao_bancaria2";

type Filters = {
    anoLectivo: string;
    estado: string;
    factura: string;
};


type PagamentosTabProps = {
    filters: Filters;
    setFilters: (f: Filters) => void;
    searchBy: SearchByType;
    setSearchBy: (s: SearchByType) => void;
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    payments: PaymentItem[];
    loadingPayments: boolean;
    page: number;
    setPage: (p: number) => void;
    limit: number;
    setLimit: (l: number) => void;
    total: number | undefined;
    totalPages: number | undefined;
    onSearch: () => void;
    onVerDetalhes: (codigoFactura: number) => void;
};

export function PagamentosTab({
    filters,
    setFilters,
    searchBy,
    setSearchBy,
    searchTerm,
    setSearchTerm,
    payments,
    loadingPayments,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    onSearch,
    onVerDetalhes,
}: PagamentosTabProps) {
    return (
        <div className="space-y-6">
            <PagamentosFiltros
                filters={filters}
                setFilters={setFilters}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setPage={setPage}
                onSearch={onSearch}
            />

            <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Exportar Excel
                </Button>
                <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
            </div>

            <PagamentosTable
                payments={payments}
                loading={loadingPayments}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                total={total}
                totalPages={totalPages}
                onVerDetalhes={onVerDetalhes}
            />
        </div>
    );
}