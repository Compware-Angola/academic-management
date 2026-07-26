

import { fetchGrauAcademicoService } from "@/services/shared/fetch-grau-academico.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFetchGrauAcademico = () => {
    return useQuery({
        queryKey: ['grau-academico-dropdown'],
        queryFn: () => fetchGrauAcademicoService(),

    });
}