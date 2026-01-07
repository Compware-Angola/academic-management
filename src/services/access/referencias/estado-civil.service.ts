import { axiosNestGa } from "@/lib/axios-nest-ga";


export type estadoCivil = {
    codigo: number;
    designacao: string;
}

export default async function fetchEstadoCivil():Promise<estadoCivil[]>{
    const res = await axiosNestGa("referencias/estado-civil")

    return res.data
}