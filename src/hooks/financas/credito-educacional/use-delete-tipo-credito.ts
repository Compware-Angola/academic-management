import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DeleteTipoCreditoEducacionalBody, deleteTipoCreditoEducacional
} from "@/services/financas/credito-educacional/delete-tipo-credito-educacional.service";

export function useDeleteTipoCreditoEducacional() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: DeleteTipoCreditoEducacionalBody) =>
            deleteTipoCreditoEducacional(body),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["credito-educacional-tipo"],
            });
        },
    });
}
