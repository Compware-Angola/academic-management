import {axiosNestFinance} from "@/lib/axios-nest-finance.ts";

export type IsencaoServico = {
    codigo: number;
    codigo_matricula: number;
    nome_completo: string;
    bilhete_identidade: string;
    curso: string;
    grau_academico: string;
    codigo_servico: number;
    servico: string;
    codigo_preinscricao: number;
    data_isencao: string;
    codigo_anolectivo: string;
    ano_lectivo: string;
    estado_isensao: string;
};

export type PaginationResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type FetchIsencaoServicoPayloadPaginated = {
    codigoMatricula?: number;
    codigoServico?:number;
    estadoIsencao?: string;
    page?: number;
    limit?: number;
};

export async function fetchIsencaoServicoAll(payload: FetchIsencaoServicoPayloadPaginated): Promise<PaginationResponse<IsencaoServico>> {
    const { data } = await axiosNestFinance.get("/isencao", {
        params: {
            codigoMatricula: payload.codigoMatricula,
            codigoServico: payload.codigoServico,
            estadoIsencao: payload.estadoIsencao,
            page: payload.page ?? 1,
            limit: payload.limit ?? 10,
        },
    });

    return data;
}

export type CreateIsencaoServicoBody = {
    codigoMatricula: number;
    codigoServico: number;
    codigoAnoLectivo: number;
    dataIsencao: string;
};

export async function createIsencaoServico(body: CreateIsencaoServicoBody) {
    const { data } = await axiosNestFinance.post("/isencao", body);
    return data;
}

