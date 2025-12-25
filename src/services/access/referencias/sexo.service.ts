import { axiosNestGa } from "@/lib/axios-nest-ga";


export type sexo = {
    codigo: number;
    designacao: string;
}

export default async function fetchSexo():Promise<sexo[]>{
    const res = await axiosNestGa("referencias/sexo")

    return res.data
}