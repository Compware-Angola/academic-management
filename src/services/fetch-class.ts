// src/services/classeService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface Classe {
  codigo: number;
  designacao: string; // ex: "1º ano", "2º ano", "Pós-Graduação", "Todos"
}

export interface ClasseResponse {
  classes: Classe[];
}

export async function getClasses(): Promise<Classe[]> {
  const response = await axiosApexGa.get<ClasseResponse>("/uma/classe/all");
  return response.data.classes;
}