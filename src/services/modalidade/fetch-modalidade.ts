import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Modalidade = {
"pkModalidade": number,
"designacao": string,
"sigla": string,
"preferencial": number,
"ordem": number
}


export async function fetchModalidade(): Promise<Modalidade[]> {

  const { data } = await axiosApexGa.get("modalidade/modalidade_horario", );

  return data.modalidades ?? [];
}
