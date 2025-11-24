// src/services/academiccalendar/fetch-academic-year-vacancies.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

export type Vacancy = {
  numeroVagas: number;
  cursoDescricao: string;
  codigoCurso: number;
  periodoDescricao: string; // "Diurno" | "Pós-Laboral"
};

export type VacanciesResponse = {
  vagas: Vacancy[];
};

/**
 * Busca as vagas disponíveis por ano letivo e tipo de candidatura
 * @param codigoAno - ex: 22, 23, 24...
 * @param tipoCandidatura - ex: 1 (Licenciatura), 2 (Mestrado), etc.
 */
export async function fetchAcademicYearVacancies(
  codigoAno: number,
  tipoCandidatura: number
): Promise<VacanciesResponse> {
  const { data } = await axiosApexGa.get<VacanciesResponse>(
    `/ga/teaching-parameters/vacancies/${codigoAno}/${tipoCandidatura}`
  );
  return data; // { vagas: [...] }
}