import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, Home, X } from "lucide-react";
import { Link } from "react-router-dom";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useHorarioProva } from "@/hooks/access_exam/use-horario-prova";
import { parseFilter } from "@/util/parse-filter";

export default function HorariosPorCurso() {
    const [filters, setFilters] = useState<{
        codigoAnoLetivo: string;
        codigoCurso: string;
        codigoTurno: string;
        page: number;
        limit: number;
    }>({
        codigoAnoLetivo: "",
        codigoCurso: "",
        codigoTurno: "",
        page: 1,
        limit: 10,
    });

    const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
    const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
    const { data, isLoading, refetch } = useHorarioProva({
        codigoAnoLetivo: parseFilter(filters.codigoAnoLetivo),
        codigoCurso: parseFilter(filters.codigoCurso),
        codigoTurno: parseFilter(filters.codigoTurno),
        page: filters.page,
        limit: filters.limit,
    });

    const horarios = data?.data ?? [];
    const total = data?.total ?? 0;

    function handleLimitChange(value: string) {
        setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }));
    }

    function limparFiltros() {
        setFilters({
            codigoAnoLetivo: "",
            codigoCurso: undefined,
            codigoTurno: undefined,
            page: 1,
            limit: filters.limit,
        });
    }

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Horários por Curso</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Horários por Curso</h1>
                    <p className="text-muted-foreground mt-1">Horários das provas de exame de acesso organizados por curso.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />Atualizar
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />PDF
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />Imprimir
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={limparFiltros}>
                        <X className="h-4 w-4 mr-2" />
                        Limpar filtros
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <FormSelect
                            label="Ano Letivo"
                            disabled={isLoadingAcademicYear}
                            loading={isLoadingAcademicYear}
                            value={filters.codigoAnoLetivo?.toString() ?? ""}
                            onChange={(v) => setFilters({ ...filters, codigoAnoLetivo: v, page: 1 })}
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
                            value={filters.codigoCurso?.toString() ?? ""}
                            onChangeValue={(v) => setFilters({ ...filters, codigoCurso: v, page: 1 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <FormSelect
                            disabled={isLoadingPeriodos}
                            loading={isLoadingPeriodos}
                            label="Período"
                            value={filters.codigoTurno?.toString() ?? ""}
                            onChange={(v) => setFilters({ ...filters, codigoTurno: v, page: 1 })}
                            options={periodos}
                            map={(p) => ({
                                key: p.codigo,
                                label: p.designacao,
                                value: p.codigo,
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Horários de Provas
                        {total > 0 && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({total} registo{total !== 1 ? "s" : ""})
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : horarios.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Nenhum horário encontrado</p>
                            <p className="text-sm mt-1">Seleccione os filtros para pesquisar horários</p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Curso</TableHead>
                                        <TableHead>Ano Lectivo</TableHead>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Horário</TableHead>
                                        <TableHead>Sala</TableHead>
                                        <TableHead className="text-center">Capacidade</TableHead>
                                        <TableHead className="text-center">Candidatos</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {horarios.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.curso}</TableCell>
                                            <TableCell className="text-sm">{item.ano_lectivo}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.periodo}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{item.data_realizacao}</TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {item.hora_inicio} — {item.hora_fim}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.sala}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{item.capacidade_sala}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        item.quantidade_alunos === 0
                                                            ? "bg-muted text-muted-foreground"
                                                            : item.quantidade_alunos >= item.capacidade_sala
                                                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                                                : "bg-green-500/10 text-green-600 border-green-500/20"
                                                    }
                                                >
                                                    {item.quantidade_alunos}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Paginação */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm">Itens por página:</Label>
                                    <Select value={filters.limit.toString()} onValueChange={handleLimitChange}>
                                        <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-muted-foreground ml-2">
                                        {total} registo{total !== 1 ? "s" : ""} no total
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                                        disabled={filters.page === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="text-sm">
                                        Página {filters.page} de {data?.totalpages ?? 1}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                                        disabled={filters.page === (data?.totalpages ?? 1)}
                                    >
                                        Seguinte
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}