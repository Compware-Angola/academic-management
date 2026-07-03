import { axiosNestGa } from "@/lib/axios-nest-ga";

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


export async function fetchAcademicYearParams(codigo: number = 23): Promise<AcademicYearParamsResponse> {
  const { data } = await axiosNestGa.get<AcademicYearParamsResponse>(
    `/academic-calendar/academic-year/${codigo}`
  );
  return data; 
}

export type AcademicYearDraftParamsResponse = {
  ano_lectivo: AcademicYear | null;
};

export async function fetchDraftAcademicYear() : Promise<AcademicYearDraftParamsResponse> {
  const { data } = await axiosNestGa.get<AcademicYearDraftParamsResponse>(
    `/academic-calendar/academic-year/draft`
  );
  return data;
}