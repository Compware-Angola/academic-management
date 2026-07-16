import { axiosNestFinance } from "@/lib/axios-nest-finance";



export type CreateInstitutionalContractBody = {
    codigoInstituicao: number;
    dataInicio: string;
    dataFim: string;
    bolsas: Array<{ codigoBolsa: number; numeroMaximoEstudante: number }>;
};

export async function createInstitutionalContract(
    body: CreateInstitutionalContractBody
) {
    const { data } = await axiosNestFinance.post("/institutional-contract", body);

    return data;
}






export type UpdateInstitutionalContractBody = {
    codigoInstituicao: number;
    dataInicio: string;
    dataFim: string;

    bolsas: Array<{ codigoBolsa: number; numeroMaximoEstudante: number }>;
};

export async function updateInstitutionalContract(
    id: string,
    body: UpdateInstitutionalContractBody
) {
    const { data } = await axiosNestFinance.patch(`/institutional-contract/${id}`, body);

    return data;
}

// Tipagem de uma Bolsa dentro do contrato
export type BolsaContrato = {
    codigoItem: number;
    codigoBolsa: number;
    numeroMaximoEstudante: number;
    status: number;
    designacao: string;
    createdAt: string;
    updatedAt: string;
    valorDesconto: number;
    tipoCredito: string;
    tipoDesconto: string;
};

// Tipagem de um Contrato Institucional
export type InstitutionalContract = {
    codigoContrato: number;
    codigoInstituicao: number;
    instituicao: string;
    dataInicio: string;
    dataFim: string;
    estado: number;
    bolsas: BolsaContrato[];
};

// Tipagem da resposta da listagem (com paginação)
export type GetInstitutionalContractsResponse = {
    data: InstitutionalContract[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type paramsGetInstitutionalContracts = {
    codigoInstituicao: string | number;
    page?: number;
    limit?: number;
    codigoContrato?: string;
    situacao?: number | null;
}

// ==================== LISTAGEM ====================
export const getInstitutionalContracts = async (params: paramsGetInstitutionalContracts) => {
    const { data } = await axiosNestFinance.get<GetInstitutionalContractsResponse>(
        "/institutional-contract",
        { params }
    );
    return data;
};


export type GetInstitutionalContractAlertasResponse = {
    ativos: number;
    aExpirar: number;
    expirados: number;
    total: number;
};

export const getInstitutionalContractAlertas = async () => {
    const { data } = await axiosNestFinance.get<GetInstitutionalContractAlertasResponse>(
        "/institutional-contract/estatisticas"
    );
    return data;
};


export async function toggleContractEstado(id: string) {
    const { data } = await axiosNestFinance.patch(`/institutional-contract/${id}/estado`);
    return data;
}

export async function deleteInstitutionalContract(id: string) {
    const { data } = await axiosNestFinance.delete(`/institutional-contract/${id}`);
    return data;
}

