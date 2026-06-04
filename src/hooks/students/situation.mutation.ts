import { setSituationStudent } from "@/services/students/situation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useMutationSetSituationStudent() {
    return useMutation({
        mutationFn: setSituationStudent,
        onSuccess: () => {
            toast.success("Situação do estudante atualizada com sucesso");
        },
    });
}