import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryListPayments } from "@/hooks/financas/area-financeira/use-query-pagamentos";
import { parseFilter } from "@/util/parse-filter";
import { ListaPagamentoModal } from "./components/ListaPagamentoModal";
import { NotasPagamentoEstatisticas } from "./components/estatisticas";
import { PagamentosTab } from "./components/PagamentosTab";
import { ServicosPagosTab } from "./components/ServicosPagosTab";

type SearchByType =
    | "codigoMatricula"
    | "nome"
    | "n_operacao_bancaria"
    | "n_operacao_bancaria2";

const searchFieldMap: Record<SearchByType, string> = {
    codigoMatricula: "codigoMatricula",
    nome: "nome",
    n_operacao_bancaria: "n_operacao_bancaria",
    n_operacao_bancaria2: "n_operacao_bancaria2",
};

export default function ListarPagamentos() {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [facturaSelecionado, setFacturaSelecionado] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        anoLectivo: "23",
        estado: "",
        factura: "",
    });
    const [filtersApplied, setFiltersApplied] = useState(filters);

    const [searchBy, setSearchBy] = useState<SearchByType>("codigoMatricula");
    const [searchByApplied, setSearchByApplied] = useState<SearchByType>("codigoMatricula");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchApplied, setSearchApplied] = useState("");

    const searchParams = searchApplied
        ? {
            [searchFieldMap[searchByApplied]]:
                searchByApplied === "codigoMatricula"
                    ? parseFilter(searchApplied)
                    : searchApplied,
        }
        : {};

    const {
        data: paymentResponse,
        isLoading: loadingPayments,
        refetch,
    } = useQueryListPayments({
        anoLectivo: parseFilter(filtersApplied.anoLectivo),
        codigoFactura: parseFilter(filtersApplied.factura),
        estado: parseFilter(filtersApplied.estado),
        ...searchParams,
        page,
        limit,
    });

    const payments = paymentResponse?.data || [];
    const total = paymentResponse?.total;
    const totalPages = paymentResponse?.totalPages;

    const handleSearch = () => {
        setFiltersApplied(filters);
        setSearchApplied(searchTerm);
        setSearchByApplied(searchBy);
        refetch();
    };

    const handleVerDetalhes = (codigoFactura: number) => {
        setFacturaSelecionado(codigoFactura);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/">
                                <Home className="h-4 w-4" />
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Finanças</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Listagem de Pagamentos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold">Listagem de Pagamentos</h1>
                <p className="text-muted-foreground">
                    Todos os pagamentos registados no sistema com detalhes de caixa, forma
                    de pagamento e estado.
                </p>
            </div>

            <Tabs defaultValue="pagamentos" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                    <TabsTrigger value="servicos">Serviços pagos do aluno</TabsTrigger>
                    <TabsTrigger value="estatistica">Estatísticas</TabsTrigger>
                </TabsList>

                <TabsContent value="pagamentos" className="space-y-6">
                    <PagamentosTab
                        filters={filters}
                        setFilters={setFilters}
                        searchBy={searchBy}
                        setSearchBy={setSearchBy}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        payments={payments}
                        loadingPayments={loadingPayments}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        setLimit={setLimit}
                        total={total}
                        totalPages={totalPages}
                        onSearch={handleSearch}
                        onVerDetalhes={handleVerDetalhes}
                    />
                </TabsContent>

                <TabsContent value="servicos" className="space-y-6">
                    <ServicosPagosTab />
                </TabsContent>

                <TabsContent value="estatistica" className="space-y-6">
                    <NotasPagamentoEstatisticas />
                </TabsContent>
            </Tabs>

            <ListaPagamentoModal
                factureId={facturaSelecionado}
                isModalOpen={isModalOpen}
                setIsModalOpen={() => setIsModalOpen(false)}
            />
        </div>
    );
}