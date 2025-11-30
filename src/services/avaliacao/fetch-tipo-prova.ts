import { axiosApexGa } from "@/lib/axios-apex-ga";
export type TipoProva = {
"codigo": number,
"designacao": string,

}

export async function fetchTipoProva(): Promise<TipoProva[]> {

  const { data } = await axiosApexGa.get("auto/fk2_tb_tipo_prova",);

  return data.items ?? [];
}
