import { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryVacancies } from "@/hooks/queries/use-query-vacancies";
import { useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";
import { useQueryDraftAcademicYear } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useMutationConfigureAcademicCalendar } from "@/hooks/academiccalendar/configureAcademicCalendar";
import { EMPTY_PERIODOS_FORM, PeriodosForm, Step } from "../types";
import { Mensalidade } from "@/services/financas/isencao-servicos/get-finance.service";
import { deriveAnoLectivo, isPeriodoCompleto, validatePeriodoDatas } from "../validation";
import { fetchVacancies, VacanciesResponse, Vacancy } from "@/services/academiccalendar/fetch-vacancies";



const STEP_ORDER: Step[] = ["periodos", "vagas", "mensalidades"];

interface UseAcademicCalendarFormArgs {
    onSuccess?: () => void;
    onClose: () => void;
}

export function useAcademicCalendarForm({
    onSuccess,
    onClose,
}: UseAcademicCalendarFormArgs) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [currentStep, setCurrentStep] = useState<Step>("periodos");
    const [periodosForm, setPeriodosForm] = useState<PeriodosForm>(EMPTY_PERIODOS_FORM);
    const [anoInicioDefinido, setAnoInicioDefinido] = useState<number | undefined>(undefined);
    const [anoFimDefinido, setAnoFimDefinido] = useState<number | undefined>(undefined);
    const [vagasEditadas, setVagasEditadas] = useState<any[]>([]);
    const [mensalidadesEditadas, setMensalidadesEditadas] = useState<any[]>([]);

    const { data: draft } = useQueryDraftAcademicYear();
    const { data: vagasOriginais, isLoading: loadingVagas } = useQueryVacancies();

    const currentIndex = STEP_ORDER.indexOf(currentStep);

    // Deriva designação + anos assim que as 2 datas-chave estiverem preenchidas.
    useEffect(() => {
        const inicio1 = periodosForm.dataInicioPrimeiroSemestre;
        const fim2 = periodosForm.dataFimSegundoSemestre;

        if (!inicio1 || !fim2) return;
        if (anoInicioDefinido !== undefined || anoFimDefinido !== undefined) return;

        const { designacao, anoInicio, anoFim } = deriveAnoLectivo(inicio1, fim2);

        setPeriodosForm((prev) => ({ ...prev, designacao }));
        setAnoInicioDefinido(anoInicio);
        setAnoFimDefinido(anoFim);
    }, [periodosForm.dataInicioPrimeiroSemestre, periodosForm.dataFimSegundoSemestre, anoInicioDefinido, anoFimDefinido]);

    // Popula vagas editáveis ao entrar no passo "vagas".
    // Importante: só roda quando vagasOriginais já chegou (evita setar undefined
    // enquanto a query ainda está em loading).
    useEffect(() => {
        if (currentStep !== "vagas") return;
        if (!vagasOriginais) return;
        if (vagasEditadas.length > 0) return;
        if (vagasOriginais.vagas.length === 0) return;

        setVagasEditadas(
            vagasOriginais.vagas.map((v: any) => ({ ...v, numeroVagas: v.numeroVagas || 0 })),
        );
    }, [currentStep, vagasOriginais, vagasEditadas.length]);

    const { data: mesesTemp, isLoading: loadingMeses, error: errorMeses } =
        useQueryGenerateMesTemp(
            { anoInicial: anoInicioDefinido, anoFinal: anoFimDefinido },
            {
                enabled:
                    !!anoInicioDefinido &&
                    !!anoFimDefinido &&
                    anoFimDefinido > anoInicioDefinido,
            },
        );

    // Popula mensalidades editáveis ao entrar no passo "mensalidades".
    useEffect(() => {
        if (currentStep !== "mensalidades") return;
        if (!mesesTemp || mesesTemp.length === 0) return;

        setMensalidadesEditadas(
            mesesTemp.map((item: any) => ({
                ...item,
                data_limite: item.data_limite || item.data_final || "",
            })),
        );
    }, [currentStep, mesesTemp]);

    const isPeriodoValid = useCallback(() => isPeriodoCompleto(periodosForm), [periodosForm]);

    const {
        mutateAsync: mutateAcademicCalendar,
        isPending: isSubmitting,
    } = useMutationConfigureAcademicCalendar();

    const resetForm = useCallback(() => {
        setPeriodosForm(EMPTY_PERIODOS_FORM);
        setVagasEditadas([]);
        setMensalidadesEditadas([]);
        setAnoInicioDefinido(undefined);
        setAnoFimDefinido(undefined);
        setCurrentStep("periodos");
    }, []);

    const buildPayload = useCallback(() => {
        return {
            periodo: {
                designacao: periodosForm.designacao,
                data_inicio_primeiro_semestre: periodosForm.dataInicioPrimeiroSemestre,
                data_fim_primeiro_semestre: periodosForm.dataFimPrimeiroSemestre,
                data_inicio_segundo_semestre: periodosForm.dataInicioSegundoSemestre,
                data_fim_segundo_semestre: periodosForm.dataFimSegundoSemestre,
                codigo_tipo_candidatura: 1,
            },
            vagas: vagasEditadas
                .filter((v) => v.numeroVagas > 0)
                .map((v) => ({
                    codigo_vaga: v.codigo_vaga ?? null,
                    codigo_periodo: v.codigo_periodo,
                    codigo_curso: v.codigoCurso,
                    polo_id: v.codigo_polo,
                    numero_vagas: v.numeroVagas,
                })),
            meses: mensalidadesEditadas.map((mes) => ({
                designacao: mes.designacao,
                isencao: mes.isencao,
                ordem_mes: mes.ordem_mes,
                prestacao: mes.prestacao,
                activo: mes.activo ? 1 : 0,
                activo_posgraduacao: mes.activo_posgraduacao ? 1 : 0,
                data_limite: mes.data_limite || mes.data_final,
                data_inicial: mes.data_inicial,
                data_final: mes.data_final,
                data_final_desconto: mes.data_final_desconto,
                semestre: mes.semestre,
                semestre_posgraduacao: mes.semestre_posgraduacao,
            })),
        };
    }, [periodosForm, vagasEditadas, mensalidadesEditadas]);

    const handleSubmit = useCallback(async () => {
        try {
            await mutateAcademicCalendar(buildPayload());

            toast({ title: "Parâmetros acadêmicos configurados com sucesso!" });
            queryClient.invalidateQueries({ queryKey: ["academic-year-params"] });
            queryClient.invalidateQueries({ queryKey: ["anosLetivos"] });
            if (draft?.ano_lectivo?.codigo) {
                queryClient.invalidateQueries({
                    queryKey: ["generate-mes-temp", draft.ano_lectivo.codigo],
                });
            }

            onSuccess?.();
            resetForm();
            onClose();
        } catch (error: any) {
            toast({
                title: "Erro ao salvar parâmetros",
                description:
                    error?.response?.data?.msgresposta || "Tente novamente",
                variant: "destructive",
            });
        }
    }, [mutateAcademicCalendar, buildPayload, toast, queryClient, draft, onSuccess, resetForm, onClose]);

    const handleNext = useCallback(() => {
        if (currentStep === "periodos") {
            if (!isPeriodoValid()) {
                toast({
                    title: "Preencha todas as datas dos semestres!",
                    variant: "destructive",
                });
                return;
            }

            const result = validatePeriodoDatas(periodosForm);
            if (!result.valid) {
                toast({
                    title: result.title,
                    description: result.description,
                    variant: "destructive",
                });
                return;
            }
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < STEP_ORDER.length) {
            setCurrentStep(STEP_ORDER[nextIndex]);
        } else {
            void handleSubmit();
        }
    }, [currentStep, currentIndex, isPeriodoValid, periodosForm, toast, handleSubmit]);

    const handlePrev = useCallback(() => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) setCurrentStep(STEP_ORDER[prevIndex]);
    }, [currentIndex]);

    const handleClose = useCallback(
        (isOpen: boolean) => {
            if (!isOpen) resetForm();
            onClose();
        },
        [resetForm, onClose],
    );

    const handleVagaChange = useCallback((index: number, newValue: number) => {
        setVagasEditadas((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], numeroVagas: newValue };
            return updated;
        });
    }, []);

    return {
        // estado de navegação
        currentStep,
        currentIndex,
        stepOrder: STEP_ORDER,

        // período
        periodosForm,
        setPeriodosForm,
        isPeriodoValid,

        // vagas
        vagasOriginais,
        loadingVagas,
        vagasEditadas,
        setVagasEditadas,
        handleVagaChange,

        // mensalidades
        mensalidadesEditadas,
        setMensalidadesEditadas,
        loadingMeses,
        errorMeses,

        // ações
        handleNext,
        handlePrev,
        handleClose,
        isSubmitting,
    };
}