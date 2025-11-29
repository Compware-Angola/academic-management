import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Disciplina = {
"pk": number,
"descricao": string,
"codigo": string
}
 type FilterDisciplinaParams = {
  curso: string;
  semestre: string;
  classe: string;
 }

export async function fetchDisciplinaWithFilter(params: FilterDisciplinaParams): Promise<Disciplina[]> {
  const { curso,semestre,classe } = params;
  const { data } = await axiosApexGa.get("Disciplinas/filtros/horario_disciplinas", { params: { p_curso: curso, p_semestre: semestre, p_classe: classe } });

  return data.unidadesCurriculares ?? [];
}
