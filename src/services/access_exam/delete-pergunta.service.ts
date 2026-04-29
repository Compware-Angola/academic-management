
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { MessageResponse } from "./topic-exam.service";


export async function deletePergunta(id: number): Promise<MessageResponse> {
    const { data } = await axiosNestGa.delete(
        `/exames-de-acesso/perguntas/${id}`
    );
    return data;
}
