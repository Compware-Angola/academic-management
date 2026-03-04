import { axiosNestGa } from "@/lib/axios-nest-ga";
export type CursoItem = {
  codigo: number;
  designacao: string;
};

export type CursosResponse = {
  data: CursoItem[];
};

export interface DocenteCursoProps {
  docenteId?: number;
  anoLectivo?: number;
}

export async function getDocenteCursosService(
  props: DocenteCursoProps,
): Promise<CursosResponse> {
  const { anoLectivo, docenteId } = props;
  const { data } = await axiosNestGa.get<CursosResponse>(
    `docentes/${docenteId}/cursos`,
    {
      params: {
        anoLectivo,
      },
    },
  );

  return data;
}
