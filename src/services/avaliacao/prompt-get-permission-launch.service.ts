import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetAssessmentNotasPayload = {
    anoLectivo: number;
    grade: number
    tipoAvaliacao: number
    utilizadorId: number
};
export type GetAssessmentNotasItem = {
    "DOCENTE": string,
    "ANOLECTIVO": string,
    "GRADE": string,
    "DATAINICIAL": string,
    "DATAFIM": string,
    "ACTIVE_STATE": number,
    "TIPOAVALIACAO": number
}

export type GetAssessmentNotasResponse = {
    "data": GetAssessmentNotasItem[]
}

export async function promptGetPermissionLaunchService(
    payload: GetAssessmentNotasPayload
): Promise<GetAssessmentNotasResponse> {
    const {
        anoLectivo,
        grade,
        tipoAvaliacao,
        utilizadorId,

    } = payload;

    const { data } = await axiosNestGa.get<GetAssessmentNotasResponse>(
        "/assessment/prompt-get-permission-launch",
        {
            params: {
                anoLectivo,
                grade,
                tipoAvaliacao,
                utilizadorId,
            },
        }
    );

    return data;
}

