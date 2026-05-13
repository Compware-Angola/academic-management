import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FormSelect } from "@/components/common/FormSelect";

type SearchByType =
    | "codigoMatricula"
    | "nome"
    | "n_operacao_bancaria"
    | "n_operacao_bancaria2";

export type Filters = {
    anoLectivo: string;
    estado: string;
    factura: string;
    dataInicio: string;
    dataFim: string;
};

type PagamentosFiltrosProps = {
    filters: Filters;
    setFilters: (f: Filters) => void;
    searchBy: SearchByType;
    setSearchBy: (s: SearchByType) => void;
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    setPage: (p: number) => void;
    onSearch: () => void;
    onClear?: (clearedFilters: Filters, clearedSearchBy: SearchByType, clearedSearchTerm: string) => void;
};

const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "n_operacao_bancaria", label: "Número de Operação bancária" },
    { id: "n_operacao_bancaria2", label: "Número de Operação bancária 2" },
    { id: "nome", label: "Nome do Aluno" },
];

const tipoEstados = [
    { key: "all", label: "Todos" },
    { key: "2", label: "Pendente" },
    { key: "1", label: "Concluido" },
];

const placeholders: Record<SearchByType, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
    n_operacao_bancaria: "Pesquisar por número de operação bancária",
    n_operacao_bancaria2: "Pesquisar por segundo número de operação bancária",
};

export function PagamentosFiltros({
    filters,
    setFilters,
    searchBy,
    setSearchBy,
    searchTerm,
    setSearchTerm,
    setPage,
    onSearch,
    onClear,
}: PagamentosFiltrosProps) {
    const handleClear = () => {
        const clearedFilters: Filters = {
            anoLectivo: "23",
            estado: "all",
            factura: "",
            dataInicio: "",
            dataFim: "",
        };

        // Atualiza os filtros locais
        setFilters(clearedFilters);
        setSearchTerm("");
        setSearchBy("codigoMatricula");
        setPage(1);

        // 🔥 Importante: Chama a função de callback com os valores limpos
        onClear?.(clearedFilters, "codigoMatricula", "");
    };

    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                {/* Linha de pesquisa */}
                <div className="flex w-full gap-4 items-center">
                    <div className="min-w-[220px]">
                        <FormSelect
                            label="Pesquisar por"
                            value={searchBy}
                            onChange={(v) => {
                                setSearchBy(v as SearchByType);
                                setPage(1);
                            }}
                            options={searchOptions}
                            map={(o) => ({ key: o.id, label: o.label, value: o.id })}
                        />
                    </div>

                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10 w-full"
                            placeholder={placeholders[searchBy]}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Filtros principais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <AcademicYearSelect
                        value={filters.anoLectivo}
                        onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
                    />

                    <div>
                        <Label>Factura</Label>
                        <Input
                            type="number"
                            placeholder="Factura"
                            value={filters.factura}
                            onChange={({ target }) =>
                                setFilters({ ...filters, factura: target.value })
                            }
                        />
                    </div>

                    <FormSelect
                        label="Estado Pagamento"
                        value={filters.estado}
                        onChange={(v) => setFilters({ ...filters, estado: v })}
                        options={tipoEstados}
                        map={(a) => ({ key: a.key, label: a.label, value: a.key })}
                    />
                </div>

                {/* Intervalo de datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="data-inicio">Data Início</Label>
                        <Input
                            id="data-inicio"
                            type="date"
                            value={filters.dataInicio}
                            max={filters.dataFim || undefined}
                            onChange={({ target }) =>
                                setFilters({ ...filters, dataInicio: target.value })
                            }
                        />
                    </div>

                    <div>
                        <Label htmlFor="data-fim">Data Fim</Label>
                        <Input
                            id="data-fim"
                            type="date"
                            value={filters.dataFim}
                            min={filters.dataInicio || undefined}
                            onChange={({ target }) =>
                                setFilters({ ...filters, dataFim: target.value })
                            }
                        />
                    </div>
                </div>

                {/* Botões */}
                <div className="flex items-end gap-3">
                    <Button onClick={onSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Pesquisar
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleClear}
                        type="button"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}