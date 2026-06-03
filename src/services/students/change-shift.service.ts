import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ChangeShiftStudentRequest = {
    codigoMatricula: number;
    novoPeriodoCodigo: number;
    anoLectivoId: number;
};

export type ChangeShiftStudentResponse = {
    success: boolean;
    message: string;
    aluno: string;
    turnoAnterior: string;
    turnoAtualizado: string;
    totalGrades: number;
    gradesComHorarioAtualizado: number;
    gradesSemHorarioEncontrado: number;
};

// ===================== FUNÇÃO CORRIGIDA =====================
export async function changeShiftStudent(
    data: ChangeShiftStudentRequest
): Promise<ChangeShiftStudentResponse> {
    try {
        const response = await axiosNestGa.post<ChangeShiftStudentResponse>(
            "/students/change-shift",
            data
        );

        // Como o backend retorna 201, garantimos que pegamos o .data
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            const err = error.response.data;
            throw new Error(
                err.error || err.message || "Erro ao alterar o turno do aluno"
            );
        }

    }
}