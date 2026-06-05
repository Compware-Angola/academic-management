

import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Vacancy = {
  numeroVagas: number;
  cursoDescricao: string;
  codigoCurso: number;
  periodoDescricao: string;
  codigo_periodo: number;
  codigo_polo: number;
};


export type VacanciesResponse = {
  vagas: Vacancy[];
};


export async function fetchVacancies(codigoPolo = 1): Promise<Vacancy[]> {
  const { data } = await axiosNestGa.get<VacanciesResponse>(
    `/academic-calendar/vacancies`
   
  );
  return data.vagas ?? [];
}
