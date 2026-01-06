import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

export type AcessosUtilizadorResponse = {
    id: number;
    designacao: string;
    sigla: string;
    moduloId: number;
    moduloNome: string;
    tipoAcessO: string;
    ativo: boolean;
    dataAtivacao: string
}


export async function fetchAcessosUtilizador(){
    const user = AuthStorage.getUser();
    const id = Number(user.user_id)

    const {data} = await axiosNestGa.get(`/acess_management/utilizador/${id}`);

    return data;
}