import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AdmissaoManualCandidato = {
    candidatoId: number;
    provaId: number;
    nota: number;
};

export type AdmissaoManualParams = {
    candidatos: AdmissaoManualCandidato[];
};

export type AdmissaoManualResultado = {
    candidatoId: number;
    provaId: number;
    nota: number;
    erro?: string;
};

export type AdmissaoManualResponse = {
    message: string;
    total: number;
    processados: number;
    erros: number;
    resultados: AdmissaoManualResultado[];
};

export async function postAdmissaoManual(
    params: AdmissaoManualParams,
): Promise<AdmissaoManualResponse> {
    const { data } = await axiosNestGa.post(
        "/exames-de-acesso/admissao-manual",
        params,
    );
    return data;
}