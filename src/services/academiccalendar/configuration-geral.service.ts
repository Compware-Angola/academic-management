import { axiosNestGa } from "@/lib/axios-nest-ga";


export type TypeConfigurationGeralResponse = {
    anoLectivo: {
        id: number;
        designacao: string;
    };
    semestreAtual: {
        semestre: number | null;
        descricao: string;
        dataFim: string | null;
    };
    semestresConfigurados: {
        primeiroSemestre: {
            dataInicio: string;
            dataFim: string;
            descricao: string;
        } | null;
        segundoSemestre: {
            dataInicio: string;
            dataFim: string;
            descricao: string;
        } | null;
    };
}

export async function getConfigurationGeral(): Promise<TypeConfigurationGeralResponse | null> {
    const response = await axiosNestGa.get<TypeConfigurationGeralResponse>(
        "/academic-calendar/configuracao-geral",
    );

    return response.data ?? null;
}
