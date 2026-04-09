import { useMutation } from "@tanstack/react-query";
import {
    updatePasswordService,
    UpdatePasswordPayload,
} from "@/services/auth/login.service";
import { toast } from "sonner";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (payload: UpdatePasswordPayload) =>
            updatePasswordService(payload),

        onSuccess: (data) => {
            toast.success(`Senha atualizada com sucesso`, {
                position: "top-right",
            });

            console.log(data.mensagem);
        },

        onError: (error: any) => {
            toast.error(`${error?.response?.data || error.message}`, {
                position: "top-right",
            });
            console.error(error?.response?.data || error.message);
        },
    });
};