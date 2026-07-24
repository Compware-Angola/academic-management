import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryDraftAcademicYear } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

export type PeriodoForm = {
    designacao: string;
    dataInicioPrimeiroSemestre: string;
    dataFimPrimeiroSemestre: string;
    dataInicioSegundoSemestre: string;
    dataFimSegundoSemestre: string;
};

export type PeriodoStepProps = {
    periodosForm: PeriodoForm;
    setPeriodosForm: React.Dispatch<React.SetStateAction<PeriodoForm>>;
};

const PERIODOS_VALUES = [
    { key: "dataInicioPrimeiroSemestre", label: "Início 1º Semestre" },
    { key: "dataFimPrimeiroSemestre", label: "Fim 1º Semestre" },
    { key: "dataInicioSegundoSemestre", label: "Início 2º Semestre" },
    { key: "dataFimSegundoSemestre", label: "Fim 2º Semestre" },
];

export function PeriodoStep({
    periodosForm,
    setPeriodosForm,
}: PeriodoStepProps) {
    const { data: draft, isLoading } = useQueryDraftAcademicYear();

    const ano = draft?.ano_lectivo;

    const isDraft = useMemo(() => !!ano, [ano]);
    useEffect(() => {

    }, [draft]);
    useEffect(() => {
        if (!ano) return;

        setPeriodosForm((prev) => ({
            designacao: ano.designacao ?? prev.designacao,
            dataInicioPrimeiroSemestre:
                ano.dataInicioPrimeiroSemestre ?? prev.dataInicioPrimeiroSemestre,
            dataFimPrimeiroSemestre:
                ano.dataFimPrimeiroSemestre ?? prev.dataFimPrimeiroSemestre,
            dataInicioSegundoSemestre:
                ano.dataInicioSegundoSemestre ?? prev.dataInicioSegundoSemestre,
            dataFimSegundoSemestre:
                ano.dataFimSegundoSemestre ?? prev.dataFimSegundoSemestre,
        }));
    }, [ano, setPeriodosForm]);


    if (isLoading) {
        return (
            <div className="p-6 space-y-3 ">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5" />
                Períodos Letivos
            </h3>

            {/* DESIGNACAO */}
            <div className="space-y-2">
                <Label>Designação (automática)</Label>
                <Input
                    value={periodosForm.designacao}
                    disabled={isDraft}
                    className="bg-muted"
                />
            </div>

            {/* DATAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PERIODOS_VALUES.map((periodo) => (
                    <div key={periodo.key} className="space-y-2">
                        <Label>{periodo.label} *</Label>

                        <Input
                            type="date"
                            value={periodosForm[periodo.key as keyof PeriodoForm]}
                            disabled={isDraft}
                            onChange={(e) =>
                                setPeriodosForm((prev) => ({
                                    ...prev,
                                    [periodo.key]: e.target.value,
                                }))
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}