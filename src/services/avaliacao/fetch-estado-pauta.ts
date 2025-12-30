import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EstadoPautaResponse = {
  codigo: number;
  designacao: string;
};

export async function getEstadoPautaService(): Promise<EstadoPautaResponse[]> {
  const { data } = await axiosNestGa.get<EstadoPautaResponse[]>(
    "/assessment/estado-pauta"
  );

  return data;
}
