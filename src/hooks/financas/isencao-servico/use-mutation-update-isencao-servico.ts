import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useToast} from "@/hooks/use-toast";
import {AxiosError} from "axios";
import {updateIsencaoServico, UpdateIsencaoServicoBody} from "@/services/financas/isencao-servicos/isencao-servico.service.ts";

export function useMutationUpdateIsencaoServico() {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ codigo, body }: { codigo: number; body: UpdateIsencaoServicoBody }) =>
            updateIsencaoServico(codigo, body),
        onSuccess: () => {
            toast({ title: "Isenção atualizada com sucesso" });
            queryClient.invalidateQueries({ queryKey: ["isencao-servico"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast({
                title: error?.response?.data?.message ?? "Erro ao atualizar Isenção",
                variant: "destructive",
            });
        },
    });
}
