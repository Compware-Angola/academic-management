import { useQuery } from "@tanstack/react-query";
import {
    getDebtsInformationService,
    DebtsInformationResponse,
} from "@/services/financas/dividas/get-deividas.service";

export const useGetDebtsInformation = (
    codigoMatricula: string,
    codAnoLectivo?: number,
) => {
    return useQuery<DebtsInformationResponse>({
        queryKey: ["debts-information", codigoMatricula, codAnoLectivo],
        queryFn: () => getDebtsInformationService(codigoMatricula, codAnoLectivo),
        enabled: !!codigoMatricula,
        retry: 0,
        staleTime: 0,
    });
};