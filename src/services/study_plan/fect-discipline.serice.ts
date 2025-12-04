// src/services/disciplineService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";
// src/types/discipline.types.ts
export type Discipline = {
  codigo: number;
  desginacao: string; // notei que vem "desginacao" no JSON (erro de digitação no backend)
  tipo_unidade_curricular: string;
  natureza_unidade_curricular: string;
  sigla: string;
  codigo_disciplina: string;
};

export type DisciplinesResponse = {
  disciplinas: Discipline[];
};
export async function fetchDisciplines(): Promise<Discipline[]> {
  try {
    const { data } = await axiosApexGa.get<DisciplinesResponse>(
      "/ga/disciplines"
    );
    return data.disciplinas ?? [];
  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
    return [];
  }
}
export interface CreateDisciplinePayload {
  designacao: string;
  pk_utilizador: number;
  tipo_unidade_curricular: "S" | "MIC" | string;
  natureza_unidade_curricular: "TP" | "T" | "P";
  codigo_disciplina: string;
  cAbbr: string;
}

export async function createDiscipline(
  payload: CreateDisciplinePayload
): Promise<any> {
  const response = await axiosApexGa.post("/ga/disciplines", payload);
  return response.data;
}
