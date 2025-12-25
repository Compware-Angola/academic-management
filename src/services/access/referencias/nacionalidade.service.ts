import { axiosNestGa } from "@/lib/axios-nest-ga";


export type nacionalidade = {
    codigo: number;
    designacao: string;
}

export default async function fetchNacionalidade():Promise<nacionalidade[]>{
    const res = await axiosNestGa("referencias/nacionalidades")

    return res.data
}