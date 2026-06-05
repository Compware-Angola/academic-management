// src/services/academiccalendar/fetch-academic-year-vacancies.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Vacancy = {
  codigo: number;
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
  const { data } = await axiosNestGa.get<VacanciesResponse>(
    `/academic-calendar/vacancies/${codigoAno}/${tipoCandidatura}`
  );
  return data; // { vagas: [...] }
}
