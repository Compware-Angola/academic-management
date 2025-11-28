import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Sala = {
 "pk": string,
"descricao": string,
"capacidade": string,
"capacidade_exame_acesso_prova": string,
"utilizavel": string,
"tipo_sala": string
};


export async function fetchSalas({estado,tipoSala}:{tipoSala?: string, estado:string}): Promise<Sala[]> {
  const params = tipoSala ? { p_tipo_sala: tipoSala, p_estado:estado } : undefined;

  const { data } = await axiosApexGa.get<{items: Sala[]}>(
    "/uma/salas/all",
    { params }
  );


  return data.items ?? [];
}
