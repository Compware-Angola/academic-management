import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface DocenteCadeirasPayload {
  docenteId: number | undefined;
  cursoId: number | undefined;
  classeId: number | undefined;
  semestreId: number | undefined;
  anoLectivo: number | undefined;
}

export type CadeiraItem = {
  codigo: number;
  nome_cadeira: string;
  codigo_classe: string;
};

export type CadeirasResponse = {
  data: CadeiraItem[];
};

export async function getDocenteCadeirasService(
  payload: DocenteCadeirasPayload,
): Promise<CadeirasResponse> {
  const { docenteId, cursoId, classeId, anoLectivo, semestreId } = payload;

  const { data } = await axiosNestGa.get<CadeirasResponse>(
    `docentes/cadeiras`,
    {
      params: {
        docenteId,
        cursoId,
        classeId,
        anoLectivo,
        semestreId,
      },
    },
  );

  return data;
}
