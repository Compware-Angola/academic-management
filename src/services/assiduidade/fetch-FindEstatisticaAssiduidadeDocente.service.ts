import { axiosNestGa } from "@/lib/axios-nest-ga";

// 🔽 PAYLOAD
export interface EstatisticaAssiduidadeDocentePayload {
    anoLectivo?: number;
    semestre?: number;
    curso?: number;
    docente?: number;
    dataInicial?: string;
    dataFinal?: string;
    search?:string;
    naoCobrarFaltas?: boolean;
    exigirPresencasConfirmadas?: boolean;
    exigirSumariosInseridos?: boolean;
    exigirSumariosValidos?: boolean;

    page?: number;
    limit?: number;
}

// 🔽 ITEM
export interface EstatisticaAssiduidadeDocenteItem {
    n_mecanografico: string;
    nome: string;
    grau_academico: string;
    escalao: string;
    categoria: string;

    total_aulas_previstas: number;
    aulas_semanais: number;
    aulas_mensais: number;

    tm: number;
    ts: number;
    ta: number;

    total_horas_efetivas: number;
    total_horas_salarial: number;

    total_faltas: number;

    ap_total: number;
    ap_presenca: number;
    ap_falta: number;

    av_total: number;
    av_presenca: number;
    av_falta: number;

    total_presencas: number;
    total_faltas_geral: number;
    total_geral: number;
}

// 🔽 RESPONSE
export interface EstatisticaAssiduidadeDocenteResponse {
    data: EstatisticaAssiduidadeDocenteItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
function cleanParams(obj: any) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined),
    );
}
// 🔽 SERVICE
export async function estatisticaAssiduidadeDocenteService(
    payload: EstatisticaAssiduidadeDocentePayload,
): Promise<EstatisticaAssiduidadeDocenteResponse> {
    const {
        anoLectivo,
        semestre,
        curso,
        docente,
        dataInicial,
        dataFinal,
        search,
        naoCobrarFaltas = false,
        exigirPresencasConfirmadas = false,
        exigirSumariosInseridos = false,
        exigirSumariosValidos = false,

        page = 1,
        limit = 20,
    } = payload;

    const { data } =
        await axiosNestGa.get<EstatisticaAssiduidadeDocenteResponse>(
            "assiduidade/estatistica-assiduidade-docente",
            {
                params: cleanParams({
                    anoLectivo,
                    semestre,
                    curso,
                    docente,
                    dataInicial,
                    search,
                    dataFinal,
                    naoCobrarFaltas,
                    exigirPresencasConfirmadas,
                    exigirSumariosInseridos,
                    exigirSumariosValidos,
                    page,
                    limit,
                })
            },
        );

    return data;
}