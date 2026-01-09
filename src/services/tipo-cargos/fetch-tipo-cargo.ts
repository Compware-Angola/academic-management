import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Cargo = {
  pk_tipo_cargo: number;
  descricao: string;
};
type fetchTipoCargoResponse = { cargos: Cargo[] };
export async function fetchTipoCargo(): Promise<Cargo[]> {
  const { data } = await axiosApexGa.get<fetchTipoCargoResponse>(
    "uma/tipo-cargos"
  );
  return data.cargos ?? [];
}
