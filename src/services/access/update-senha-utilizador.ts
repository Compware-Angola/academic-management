import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";


export type UpdatePasswordParams = {
    senhaAtual: string;
    novaSenha: string;
};

export async function updateUserPassword(params: UpdatePasswordParams): Promise<void> {
    const user = AuthStorage.getUser();

    if(!user) throw new Error("Usuário não autenticado")

     await axiosNestGa.put("acess_management/teacher-password",
        {
            senhaAtual: params.senhaAtual,
            novaSenha: params.novaSenha
        },
        {
            headers: {
                "x-user-logado-id": user.user_id
            }
        }
    )
}