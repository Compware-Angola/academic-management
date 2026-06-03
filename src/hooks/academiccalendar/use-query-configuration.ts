import { getConfigurationGeral } from "@/services/academiccalendar/configuration-geral.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryConfigurationGeral = () => {
    return useQuery({
        queryKey: ["configuration-geral"],
        queryFn: () => getConfigurationGeral(),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}