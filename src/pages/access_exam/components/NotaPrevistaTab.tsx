import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, X, Search } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

type Filters = {
    codigoAnoLetivo: string;
    codigoCurso: string;
    search: string;
};

const FILTERS_INITIAL: Filters = {
    codigoAnoLetivo: "",
    codigoCurso: "",
    search: "",
};

// TODO: substituir por dados reais quando o hook de "nota prevista" estiver pronto
// ex: const { data, isLoading, refetch } = useNotaPrevista({ ...filters })
const MOCK_CANDIDATOS: Array<{
    numero_inscricao: number;
    nome: string;
    curso: string;
    nota_prevista: number;
}> = [];

export function NotaPrevistaTab() {
    const [filters, setFilters] = useState<Filters>(FILTERS_INITIAL);
    const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();

    const isLoading = false;
    const candidatos = MOCK_CANDIDATOS;

    function limparFiltros() {
        setFilters(FILTERS_INITIAL);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => {/* TODO: refetch() */ }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={limparFiltros}>
                        <X className="h-4 w-4 mr-2" />
                        Limpar filtros
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <FormSelect
                            label="Ano Letivo"
                            disabled={isLoadingAcademicYear}
                            loading={isLoadingAcademicYear}
                            value={filters.codigoAnoLetivo}
                            onChange={(v) => setFilters((p) => ({ ...p, codigoAnoLetivo: v }))}
                            options={academicYear}
                            map={(a) => ({
                                key: a.codigo.toString(),
                                label: a.designacao,
                                value: a.codigo.toString(),
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <CourseSelect
                            value={filters.codigoCurso}
                            onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Pesquisar</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Pesquisar por nome"
                                value={filters.search}
                                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nº Inscrição</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead className="text-center">Nota Prevista</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <TableCell key={`skeleton-${i}-${j}`}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {!isLoading && candidatos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Nenhum registo encontrado
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && candidatos.map((item) => (
                            <TableRow key={item.numero_inscricao}>
                                <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                                <TableCell className="font-medium">{item.nome}</TableCell>
                                <TableCell className="text-sm">{item.curso}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline">{item.nota_prevista}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}