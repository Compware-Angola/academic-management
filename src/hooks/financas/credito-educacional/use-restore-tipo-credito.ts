import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    RestoreTipoCreditoEducacionalBody, restoreTipoCreditoEducacional
} from "@/services/financas/credito-educacional/restore-tipo-credito-educacional.service";

export function useRestoreTipoCreditoEducacional() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RestoreTipoCreditoEducacionalBody) =>
            restoreTipoCreditoEducacional(body),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["credito-educacional-tipo"],
            });
        },
    });
}
