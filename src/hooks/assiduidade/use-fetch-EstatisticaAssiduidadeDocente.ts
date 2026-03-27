

import {
    EstatisticaAssiduidadeDocentePayload,
    EstatisticaAssiduidadeDocenteResponse,
    estatisticaAssiduidadeDocenteService
} from "@/services/assiduidade/fetch-FindEstatisticaAssiduidadeDocente.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryEstatisticaAssiduidadeDocente = (
    filters: EstatisticaAssiduidadeDocentePayload,
    options?: {
        enabled?: boolean;
    },
) => {
    const {
        anoLectivo,
        semestre,
        curso,
        docente,
        dataInicial,
        dataFinal,
        naoCobrarFaltas = false,
        exigirPresencasConfirmadas = false,
        exigirSumariosInseridos = false,
        exigirSumariosValidos = false,
        search,

        page = 1,
        limit = 20,
    } = filters;

    const enabled =
        typeof options?.enabled === "boolean" ? options.enabled : true;

    return useQuery<EstatisticaAssiduidadeDocenteResponse>({
        queryKey: [
            "estatistica-assiduidade-docente",
            {
                anoLectivo,
                semestre,
                curso,
                docente,
                dataInicial,
                dataFinal,
                naoCobrarFaltas,
                exigirPresencasConfirmadas,
                exigirSumariosInseridos,
                exigirSumariosValidos,
                search,
                page,
                limit,
            },
        ],
        queryFn: () => estatisticaAssiduidadeDocenteService(filters),
        enabled,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 20,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};