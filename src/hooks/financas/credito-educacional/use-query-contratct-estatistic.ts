import { getInstitutionalContractAlertas } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryInstitutionalContractAlertas() {
        return useQuery({
                queryKey: ["contract-estatisticas"],
                queryFn: getInstitutionalContractAlertas,
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 10,
        });
}