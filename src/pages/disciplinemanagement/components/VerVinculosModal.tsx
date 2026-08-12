import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Link2Off, BookOpen, X } from "lucide-react";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryVinculosGrade } from "@/hooks/depatamento/use-query-vinculos-grade";

interface UcResumo {
    codigo_grade: number;
    unidade_curricular: string;
}

interface Filtro {
    anoLectivo: string;
    tipoCandidatura: string;
    curso: string;
}

const FILTROS_VAZIOS: Filtro = {
    anoLectivo: "",
    tipoCandidatura: "",
    curso: "",
};

interface VerVinculosModalProps {
    open: boolean;
    onClose: () => void;
    uc: UcResumo | null;
}

export function VerVinculosModal({ open, onClose, uc }: VerVinculosModalProps) {
    const [filters, setFilters] = useState<Filtro>(FILTROS_VAZIOS);

    const temFiltroAtivo =
        !!filters.anoLectivo || !!filters.tipoCandidatura || !!filters.curso;

    const { data: vinculosResponse, isLoading, isFetching } = useQueryVinculosGrade({
        codigoGrade: uc?.codigo_grade ?? 0,
        anoLetivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
        codigoCurso: filters.curso ? Number(filters.curso) : undefined,
        enabled: open && !!uc && !!filters.anoLectivo,
    });

    const vinculos = vinculosResponse?.vinculos ?? [];

    const handleClose = () => {
        setFilters(FILTROS_VAZIOS);
        onClose();
    };

    const handleClearFilters = () => {
        setFilters(FILTROS_VAZIOS);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="max-w-4xl!">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                            <DialogTitle>Vínculos da Disciplina</DialogTitle>
                            <DialogDescription className="mt-0.5">
                                Consulte os cursos e classes onde esta disciplina está vinculada.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {uc && (
                    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">
                            {uc.unidade_curricular}
                        </span>
                        <Badge variant="outline" className="ml-auto shrink-0">
                            {uc.codigo_grade}
                        </Badge>
                    </div>
                )}

                <div className="flex items-end gap-3">
                    <div className="grid flex-1 grid-cols-3 gap-3">
                        <TipoCandidaturaSelect
                            value={filters.tipoCandidatura?.toString()}
                            onChangeValue={(v) =>
                                setFilters({
                                    ...filters,
                                    tipoCandidatura: v,
                                })
                            }
                        />
                        <AcademicYearsAvailableForOperationSelect
                            label="Ano Letivo"
                            value={filters.anoLectivo}
                            onChangeValue={(v) =>
                                setFilters({
                                    ...filters,
                                    anoLectivo: v,
                                })
                            }
                            tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
                            onlyConfigurable={false}
                        />
                        <CourseSelect
                            params={{
                                tipoCandidaturaId: parseFilter(filters.tipoCandidatura) ?? 1,
                            }}
                            value={filters.curso}
                            onChangeValue={(v) =>
                                setFilters({
                                    ...filters,
                                    curso: v,
                                })
                            }
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!temFiltroAtivo}
                        onClick={handleClearFilters}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpar Filtros
                    </Button>
                </div>

                <div className="flex flex-col gap-3 py-1">
                    {!filters.anoLectivo ? (
                        <div className="text-center py-14 border rounded-md">
                            <p className="text-sm text-muted-foreground">
                                Selecione o ano letivo para ver os vínculos
                            </p>
                        </div>
                    ) : isLoading || isFetching ? (
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : vinculos.length === 0 ? (
                        <div className="text-center py-14 border rounded-md">
                            <Link2Off className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Nenhum vínculo encontrado para este ano letivo
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border max-h-[420px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Curso</TableHead>
                                        <TableHead>Ano Curricular</TableHead>
                                        <TableHead>Semestre</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vinculos.map((v, idx) => (
                                        <TableRow
                                            key={`${v.codigoCurso}-${v.codigoClasse}-${v.codigoSemestre}-${idx}`}
                                        >
                                            <TableCell className="font-medium">
                                                {v.nomeCurso}
                                            </TableCell>
                                            <TableCell>{v.anoCurricular}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {v.codigoSemestre}º Semestre
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {vinculosResponse && filters.anoLectivo && (
                        <p className="text-xs text-muted-foreground text-right">
                            {vinculosResponse.total} vínculo(s) encontrado(s)
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}