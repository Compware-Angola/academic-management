import { PeriodosForm } from "../types";


export interface ValidationResult {
    valid: boolean;
    title?: string;
    description?: string;
}

export function isPeriodoCompleto(form: PeriodosForm): boolean {
    return [
        form.dataInicioPrimeiroSemestre,
        form.dataFimPrimeiroSemestre,
        form.dataInicioSegundoSemestre,
        form.dataFimSegundoSemestre,
    ].every((field) => field.trim() !== "");
}

/**
 * Valida as datas dos semestres apenas pela ORDEM cronológica entre elas,
 * sem amarrar a nenhum ano ou mês fixo. Isso permite configurar qualquer
 * ano letivo (passado, atual ou futuro, ex: 2027-2028, 2028-2029...),
 * desde que a sequência das datas faça sentido:
 *
 *   início 1º sem. < fim 1º sem. <= início 2º sem. < fim 2º sem.
 */
export function validatePeriodoDatas(form: PeriodosForm): ValidationResult {
    const inicio1 = new Date(form.dataInicioPrimeiroSemestre);
    const fim1 = new Date(form.dataFimPrimeiroSemestre);
    const inicio2 = new Date(form.dataInicioSegundoSemestre);
    const fim2 = new Date(form.dataFimSegundoSemestre);

    if (inicio1 >= fim1) {
        return {
            valid: false,
            title: "Data inválida",
            description: "A data de início do 1º semestre deve ser anterior à data de fim.",
        };
    }

    if (inicio2 >= fim2) {
        return {
            valid: false,
            title: "Data inválida",
            description: "A data de início do 2º semestre deve ser anterior à data de fim.",
        };
    }

    if (fim1 > inicio2) {
        return {
            valid: false,
            title: "Data inválida",
            description: "O 1º semestre deve terminar antes do 2º semestre começar.",
        };
    }

    return { valid: true };
}

/** Deriva "designação" (ex: "2026-2027") e os anos de início/fim a partir das datas. */
export function deriveAnoLectivo(
    dataInicioPrimeiroSemestre: string,
    dataFimSegundoSemestre: string,
    tipo_candidatura: number
): { designacao: string; anoInicio: number; anoFim: number } {
    const startYear = new Date(dataInicioPrimeiroSemestre).getFullYear();
    const endYear = new Date(dataFimSegundoSemestre).getFullYear();
    const finalYear = endYear >= startYear ? endYear : startYear + 1;
    const designacao = deriveDesignacao({ tipo_candidatura });
    return {
        designacao: designacao !== null ? `${designacao} ${startYear}-${finalYear}` : `${startYear}-${finalYear}`,
        anoInicio: startYear,
        anoFim: finalYear,
    };
}

function deriveDesignacao({ tipo_candidatura }: { tipo_candidatura: number }): string | null {
    switch (tipo_candidatura) {
        case 2:
            return "Ciclo Mestrado";
        case 3:
            return "Ciclo Doutoramento";
        default:
            return null;
    }
}
