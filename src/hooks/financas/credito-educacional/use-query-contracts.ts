import { getInstitutionalContracts, paramsGetInstitutionalContracts } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryContracts(params: paramsGetInstitutionalContracts, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["institutional-contracts", params],
        queryFn: () => getInstitutionalContracts(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        enabled: options?.enabled ?? true,
    });
}   