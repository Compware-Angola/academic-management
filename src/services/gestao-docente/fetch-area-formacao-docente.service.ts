import { axiosNestGa } from "@/lib/axios-nest-ga";



export type AreaFormacaoItem = {
  codigo: number;
  designacao: string;
};

export type ListAreaFormacaoDocenteResponse = AreaFormacaoItem[];


export async function getAreaFormacaoDocenteService() {
   

  const { data } = await axiosNestGa.get<ListAreaFormacaoDocenteResponse>(
      "/docente-gestao/area-formacao-all");
  
    return data;
}