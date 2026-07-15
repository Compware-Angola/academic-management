import { useMutation } from "@tanstack/react-query";
import { deleteInstitutionalContract } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

export function useDeleteInstitutionalContract() {
    return useMutation({
        mutationFn: deleteInstitutionalContract,
        onSuccess: () => {
            toast.success("Contrato de crédito educacional criado com sucesso");
            queryClient.invalidateQueries({ queryKey: ["institutional-contracts"] });
            queryClient.invalidateQueries({ queryKey: ["contract-estatisticas"] });
        },
        onError: (error: any) => {
            if (error?.statusCode === 409) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao criar contrato");
            }
        },
    });
}