import { axiosApexGa } from "@/lib/axios-apex-ga";

export type DocenteUc = {
  codigo_docente: number;
  nome_docente: string;
};

type FetchTeacherUcParams = {
  anoLectivo: number;
  unidadeCurricular: number;
};

export async function fetchTeacherByUc(
  params: FetchTeacherUcParams
): Promise<DocenteUc[]> {
  const { anoLectivo, unidadeCurricular } = params;

  const { data } = await axiosApexGa.get(
    `ga/teacher-uc/${anoLectivo}/${unidadeCurricular}`
  );

  return data.data ?? [];
}
