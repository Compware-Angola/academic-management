import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface DebtMensalidade {
    mes_temp_id: number;
    mes: string;
    data_inicial: string;
    data_final: string;
    data_limite: string;
    id_item: number;
    codigo_matricula: number;
    ano_lectivo_fatura: number;
    estado_fatura: number;
    valorapagar: number;
    valorentregue: number;
    data_vencimento: string;
    desconto: number;
    codigo_factura: string | null;
    semestre: number;
    multa: number;
    total_item: number;
    valor_pago: number;
    mensalidade: number;
    codigo_servico: number;
    descricao_servico: string;
    total: number;
    total_preco: number;
    status_pagamento: number;
    data_operacao: string | null;
    data_pagamento: string | null;
    instituicao_pagou: boolean;
    codigo_bolseiro: string | null;
    observacao: string | null;
}

export interface DebtOutroServico {
    codgradecurricular: number;
    codfacturaoutrosservicos: number;
    valor: number;
    multa: number;
    total: number;
    servico: string;
    ano_lectivo: string;
    taxa_multa: number;
    taxa_desconto: number;
    codidigo_servico: number;
    codigo_anolectivo: number;
    desconto: number;
    incidencia: number;
    valor_iva: number;
    tipo_taxas: number;
    taxa_descricao: string;
}

export interface DebtsInformationResponse {
    Mensalidades: DebtMensalidade[];
    OutrosServicos: DebtOutroServico[];
    anoAtual: number;
    totalIVA: number;
    percentagem_retencao: number;
    totalDivida: number;
    total_incidencia: number;
    total_retencao: number;
    size: number;
    desconto: number;
    precoTotal: number;
}

export const getDebtsInformationService = async (
    codigoMatricula: string,
    codAnoLectivo?: number,
): Promise<DebtsInformationResponse> => {
    try {
        const params = new URLSearchParams({
            codigo_matricula: codigoMatricula,
            ...(codAnoLectivo && { codAnoLectivo: String(codAnoLectivo) }),
        });

        const response = await axiosNestFinance.get<DebtsInformationResponse>(
            `/debt-negotiation/get-debts-information?${params.toString()}`,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};