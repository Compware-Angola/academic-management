import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryVacancies } from "@/hooks/queries/use-query-vacancies";
import { useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";
import { useQueryDraftAcademicYear } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useMutationConfigureAcademicCalendar } from "@/hooks/academiccalendar/configureAcademicCalendar";

import {
    EMPTY_PERIODOS_FORM,
    PeriodosForm,
    Step,
} from "../types";

import {
    deriveAnoLectivo,
    isPeriodoCompleto,
    validatePeriodoDatas,
} from "../validation";

const STEP_ORDER: Step[] = [
    "periodos",
    "mensalidades",
];

interface UseAcademicCalendarFormArgs {
    onSuccess?: () => void;
    onClose: () => void;
    tipo_candidatura: number;
}
export function useAcademicCalendarForm({
    onSuccess,
    onClose,
    tipo_candidatura,
}: UseAcademicCalendarFormArgs) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [currentStep, setCurrentStep] = useState<Step>("periodos");

    const [periodosForm, setPeriodosForm] =
        useState<PeriodosForm>(EMPTY_PERIODOS_FORM);

    const [anoInicioDefinido, setAnoInicioDefinido] =
        useState<number>();

    const [anoFimDefinido, setAnoFimDefinido] =
        useState<number>();

    const [mensalidadesEditadas, setMensalidadesEditadas] =
        useState<any[]>([]);

    const [isSuccess, setIsSuccess] = useState(false);

    const { data: draft } = useQueryDraftAcademicYear();

    useQueryVacancies();

    const currentIndex = STEP_ORDER.indexOf(currentStep);

    useEffect(() => {
        const inicio1 = periodosForm.dataInicioPrimeiroSemestre;
        const fim2 = periodosForm.dataFimSegundoSemestre;

        if (!inicio1 || !fim2) return;

        if (
            anoInicioDefinido !== undefined ||
            anoFimDefinido !== undefined
        )
            return;

        const {
            designacao,
            anoInicio,
            anoFim,
        } = deriveAnoLectivo(inicio1, fim2, tipo_candidatura);

        setPeriodosForm((prev) => ({
            ...prev,
            designacao,
        }));

        setAnoInicioDefinido(anoInicio);
        setAnoFimDefinido(anoFim);
    }, [
        periodosForm.dataInicioPrimeiroSemestre,
        periodosForm.dataFimSegundoSemestre,
        anoInicioDefinido,
        anoFimDefinido,
    ]);

    const {
        data: mesesTemp,
        isLoading: loadingMeses,
        error: errorMeses,
    } = useQueryGenerateMesTemp(
        {
            anoInicial: anoInicioDefinido,
            anoFinal: anoFimDefinido,
            tipo_candidatura
        },
        {
            enabled:
                !!anoInicioDefinido &&
                !!anoFimDefinido &&
                anoFimDefinido > anoInicioDefinido,
        }
    );

    useEffect(() => {
        if (currentStep !== "mensalidades") return;

        if (!mesesTemp?.length) return;

        setMensalidadesEditadas(
            mesesTemp.map((item: any) => ({
                ...item,
                data_limite:
                    item.data_limite || item.data_final,
            }))
        );
    }, [currentStep, mesesTemp]);

    const isPeriodoValid = useCallback(
        () => isPeriodoCompleto(periodosForm),
        [periodosForm]
    );

    const {
        mutateAsync,
        isPending: isSubmitting,
    } = useMutationConfigureAcademicCalendar();

    const resetForm = useCallback(() => {
        setCurrentStep("periodos");
        setPeriodosForm(EMPTY_PERIODOS_FORM);
        setAnoInicioDefinido(undefined);
        setAnoFimDefinido(undefined);
        setMensalidadesEditadas([]);
        setIsSuccess(false);
    }, []);

    const buildPayload = useCallback(() => {
        return {
            periodo: {
                designacao: periodosForm.designacao,
                data_inicio_primeiro_semestre:
                    periodosForm.dataInicioPrimeiroSemestre,
                data_fim_primeiro_semestre:
                    periodosForm.dataFimPrimeiroSemestre,
                data_inicio_segundo_semestre:
                    periodosForm.dataInicioSegundoSemestre,
                data_fim_segundo_semestre:
                    periodosForm.dataFimSegundoSemestre,
                codigo_tipo_candidatura: tipo_candidatura,
            },

            meses: mensalidadesEditadas.map((mes) => ({
                designacao: mes.designacao,
                isencao: mes.isencao,
                ordem_mes: mes.ordem_mes,
                prestacao: mes.prestacao,
                activo: mes.activo ? 1 : 0,
                activo_posgraduacao:
                    mes.activo_posgraduacao ? 1 : 0,
                data_limite:
                    mes.data_limite || mes.data_final,
                data_inicial: mes.data_inicial,
                data_final: mes.data_final,
                data_final_desconto:
                    mes.data_final_desconto,
                semestre: mes.semestre,
                semestre_posgraduacao:
                    mes.semestre_posgraduacao,
            })),
        };
    }, [periodosForm, mensalidadesEditadas]);

    const handleSubmit = useCallback(async () => {
        try {
            await mutateAsync(buildPayload());

            toast({
                title:
                    "Parâmetros acadêmicos configurados com sucesso!",
            });

            queryClient.invalidateQueries({
                queryKey: ["academic-year-params"],
            });

            queryClient.invalidateQueries({
                queryKey: ["anosLetivos"],
            });

            if (draft?.ano_lectivo?.codigo) {
                queryClient.invalidateQueries({
                    queryKey: [
                        "generate-mes-temp",
                        draft.ano_lectivo.codigo,
                    ],
                });
            }

            onSuccess?.();


            setIsSuccess(true);
        } catch (error: any) {
            toast({
                title: "Erro ao salvar parâmetros",
                description:
                    error?.response?.data?.msgresposta ??
                    "Tente novamente.",
                variant: "destructive",
            });
        }
    }, [
        mutateAsync,
        buildPayload,
        toast,
        queryClient,
        draft,
        onSuccess,
    ]);

    const handleNext = useCallback(() => {
        if (currentStep === "periodos") {
            if (!isPeriodoValid()) {
                toast({
                    title:
                        "Preencha todas as datas dos semestres.",
                    variant: "destructive",
                });

                return;
            }

            const result =
                validatePeriodoDatas(periodosForm);

            if (!result.valid) {
                toast({
                    title: result.title,
                    description: result.description,
                    variant: "destructive",
                });

                return;
            }
        }

        const next = currentIndex + 1;

        if (next < STEP_ORDER.length) {
            setCurrentStep(STEP_ORDER[next]);
            return;
        }

        void handleSubmit();
    }, [
        currentStep,
        currentIndex,
        handleSubmit,
        isPeriodoValid,
        periodosForm,
        toast,
    ]);

    const handlePrev = useCallback(() => {
        const prev = currentIndex - 1;

        if (prev >= 0) {
            setCurrentStep(STEP_ORDER[prev]);
        }
    }, [currentIndex]);

    const handleClose = useCallback(
        (open: boolean) => {
            if (!open) {
                resetForm();
                onClose();
            }
        },
        [onClose, resetForm]
    );

    return {
        currentStep,
        currentIndex,

        periodosForm,
        setPeriodosForm,
        isPeriodoValid,

        mensalidadesEditadas,
        setMensalidadesEditadas,

        loadingMeses,
        errorMeses,

        handleNext,
        handlePrev,
        handleClose,

        isSubmitting,
        isSuccess,
    };
}