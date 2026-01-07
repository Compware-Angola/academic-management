import { axiosNestGa } from "@/lib/axios-nest-ga";


export type tipoDocumento = {
    codigo: number;
    designacao: string;
}

export default async function fetchTipoDocumento():Promise<tipoDocumento[]>{
    const res = await axiosNestGa("referencias/tipo-documentos")

    return res.data
}