import React from "react";

export type Step = "periodos" | "vagas" | "mensalidades";

export interface StepConfig {
    id: Step;
    title: string;
    icon: React.ReactNode;
}

export interface PeriodosForm {
    designacao: string;
    dataInicioPrimeiroSemestre: string;
    dataFimPrimeiroSemestre: string;
    dataInicioSegundoSemestre: string;
    dataFimSegundoSemestre: string;
}

export interface Vaga {
    codigo_vaga?: number | null;
    codigo_periodo: number;
    codigoCurso: number;
    codigo_polo: number;
    numeroVagas: number;
}

export interface Mensalidade {
    designacao: string;
    isencao: boolean;
    ordem_mes: number;
    prestacao: number;
    activo: boolean;
    activo_posgraduacao: boolean;
    data_limite?: string;
    data_inicial: string;
    data_final: string;
    data_final_desconto?: string;
    semestre: number;
    semestre_posgraduacao: number;
}

export interface ParametersEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anoLetivo?: string;
    onSuccess?: () => void;
}

export const EMPTY_PERIODOS_FORM: PeriodosForm = {
    designacao: "",
    dataInicioPrimeiroSemestre: "",
    dataFimPrimeiroSemestre: "",
    dataInicioSegundoSemestre: "",
    dataFimSegundoSemestre: "",
};