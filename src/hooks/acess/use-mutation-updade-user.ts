import { UpdatePasswordParams, updateUserPassword } from "@/services/access/update-senha-utilizador";
import { useMutation } from "@tanstack/react-query";



export function useUpdateUserPassword(){
    return useMutation<void, Error, UpdatePasswordParams>({
        mutationFn: updateUserPassword
    })
}