import { getInstitutionalContractAlertas } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryInstitutionalContractAlertas() {
    return useQuery({
        queryKey: ["contratos-estatisticas"],
        queryFn: getInstitutionalContractAlertas,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}