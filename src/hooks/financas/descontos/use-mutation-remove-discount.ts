import { removeAddDiscount } from "@/services/financas/descontos/descontos.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useMutationRemoveDiscount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (codigo: number) => removeAddDiscount(codigo),
        onSuccess: () => {
            toast.success("Desconto removido com sucesso");
            queryClient.invalidateQueries({ queryKey: ["descontosAdd"] });
        },
    });
}