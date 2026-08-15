
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    desvincularUnidadeCurricular,
    DesvincularResponse,
} from "@/services/departamento/fetch-vinculos-grade.service";

interface UseDesvincularUCOptions {
    onSuccess?: (data: DesvincularResponse) => void;
}

export function useDesvincularUC(options?: UseDesvincularUCOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (codigoVinculo: number) =>
            desvincularUnidadeCurricular(codigoVinculo),
        onSuccess: (data) => {
            toast.success(data.message ?? "Unidade curricular desvinculada com sucesso.");


            queryClient.invalidateQueries({ queryKey: ["vinculos-grade"] });

            options?.onSuccess?.(data);
        },
        onError: (error: any) => {
            console.log(error);


        },
    });
}