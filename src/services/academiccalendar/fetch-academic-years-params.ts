// src/services/academiccalendar/fetch-academic-years-params.ts

import { axiosApexGa } from "@/lib/axios-apex-ga";

export type AcademicYear = {
  codigo: number;
  designacao: string;
  dataInicioPrimeiroSemestre: string;
  dataFimPrimeiroSemestre: string;
  dataInicioSegundoSemestre: string;
  dataFimSegundoSemestre: string;
  estado: string;
};

export type AcademicYearParamsResponse = {
  ano_lectivo: AcademicYear[];
};

// MUDANÇA AQUI: devolve o response completo, não o array
export async function fetchAcademicYearParams(codigo: number = 23): Promise<AcademicYearParamsResponse> {
  const { data } = await axiosApexGa.get<AcademicYearParamsResponse>(
    `/ga/teaching-parameters/academic-year/${codigo}`
  );
  return data; // ← agora devolves o objeto inteiro { ano_lectivo: [...] }
}