import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Vacancy } from "@/services/academiccalendar/fetch-vacancies-per-course";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type VacanciesTableCardProps = {
    vacancies: Vacancy[];
    paginatedVacancies: Vacancy[];
    filteredVacancies: Vacancy[];
    loading?: boolean;
    tipoCandidaturaNome: string;
    anoLetivo?: string;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;

    onEdit: (vaga: Vacancy) => void;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: number) => void;
}


export function VacanciesTableCard({
    vacancies,
    paginatedVacancies,
    filteredVacancies,
    loading,
    tipoCandidaturaNome,
    anoLetivo,
    currentPage,
    totalPages,
    itemsPerPage,
    onEdit,
    onPageChange,
    onItemsPerPageChange,
}: VacanciesTableCardProps) {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Vagas Disponíveis — {tipoCandidaturaNome} (
                    {anoLetivo})
                </CardTitle>
                <CardDescription>
                    Total de vagas:{" "}
                    {vacancies
                        .reduce((acc, v) => acc + v.numeroVagas, 0)
                        .toLocaleString()}{" "}
                    • Cursos com vagas:{" "}
                    {vacancies.filter((v) => v.numeroVagas > 0).length}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Enquanto carrega ou está trocando de tipo/ano → mostra loading */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : vacancies.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">
                            Nenhuma vaga encontrada para este ano e tipo de candidatura.
                        </p>
                        <Button
                            onClick={() => {
                                navigate("/exame/configurar-vaga");
                            }}
                        >
                            Configurar vagas
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Força mostrar a tabela mesmo com poucas vagas */}
                        <div className="space-y-6">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Curso</TableHead>
                                            <TableHead>Período</TableHead>
                                            <TableHead className="text-right">Vagas</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {paginatedVacancies.length > 0 ? (
                                            paginatedVacancies.map((vaga, i) => (
                                                <TableRow
                                                    key={`${vaga.codigoCurso}-${vaga.periodoDescricao}`}
                                                    className="hover:bg-muted/50"
                                                >
                                                    {/* Curso */}
                                                    <TableCell className="font-medium">
                                                        {vaga.cursoDescricao}
                                                    </TableCell>

                                                    {/* Período */}
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                vaga.periodoDescricao === "Diurno"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {vaga.periodoDescricao}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Vagas */}
                                                    <TableCell className="text-right">
                                                        {vaga.numeroVagas > 0 ? (
                                                            <span className="font-bold text-primary">
                                                                {vaga.numeroVagas.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                Esgotado
                                                            </Badge>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onEdit(vaga)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    Não há vagas com mais de 0 para exibir nesta
                                                    página.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginação */}
                            {filteredVacancies.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Itens por página:</span>
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(v) => onItemsPerPageChange(Number(v))}
                                        >
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[10, 20, 50].map((size) => (
                                                    <SelectItem key={size} value={size.toString()}>
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredVacancies.length
                                        )}{" "}
                                        de {filteredVacancies.length} cursos
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onPageChange(currentPage - 1)
                                            }
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
                                                onPageChange(currentPage + 1)
                                            }
                                            disabled={currentPage === totalPages}
                                        >
                                            Próximo
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(totalPages || 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card >
    )
}