

import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface StudentMovement {
    referencia: number;
    data_movimento: string;
    credito: number;
    debito: number;
    estado: number;
    matricula: number;
    saldo_operacao: number;
    saldo_geral: number;
    codigotipomovimento: number;
    codigomotivo: string | null;
    codigoutilizador: string | null;
    observacao: string;
    factura: number;
    codigo: number;
    valor_excedente: number;
}

export interface StudentMovementsResponse {
    data: StudentMovement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface StudentMovementsParams {
    matricula: number;
    page?: number;
    limit?: number;
}

export async function getStudentMovements({
    matricula,
    page = 1,
    limit = 10,
}: StudentMovementsParams): Promise<StudentMovementsResponse> {
    const response = await axiosNestFinance.get<StudentMovementsResponse>(
        `/alunos/${matricula}/movimentos`,
        {
            params: {
                page,
                limit,
            },
        }
    );

    return response.data;
}