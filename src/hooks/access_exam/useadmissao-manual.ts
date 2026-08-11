import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    postAdmissaoManual,
    AdmissaoManualParams,
} from "@/services/access_exam/post-admissao-manual.service";

export function useAdmissaoManual() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: AdmissaoManualParams) => postAdmissaoManual(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resultado-prova"] });
            queryClient.invalidateQueries({ queryKey: ["nota-prevista"] });
        },
    });
}