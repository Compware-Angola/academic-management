import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

export type UpdatePasswordParams = {
    utilizadorId: number;
    novaSenha: string;
};

export async function updateUserPassword(params: UpdatePasswordParams): Promise<void> {
    const user = AuthStorage.getUser();

    if(!user) throw new Error("Usuário não autenticado")
        //teacher-password
     await axiosNestGa.put("/acess_management/teacher-password", params)
}