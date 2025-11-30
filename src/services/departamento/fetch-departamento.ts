import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Departamento = {
"designacao": string,
"codigo": string
}

export async function fetchDepartamento(): Promise<Departamento[]> {

  const { data } = await axiosApexGa.get("uma/dept");

  return data.depts ?? [];
}
