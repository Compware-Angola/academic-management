import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CadeiraItem = {
  codigo: number;
  nome_cadeira: string;
  codigo_classe: string;
};

export type CadeirasResponse = {
  data: CadeiraItem[];
};


export type DocenteCadeirasPayload = {
  docenteId: number;
  cursoId: number;
  classId: number;
};

export async function getDocenteCadeirasService(
  payload: DocenteCadeirasPayload,
): Promise<CadeirasResponse> {
  const { docenteId, cursoId, classId } = payload;

  const { data } = await axiosNestGa.get<CadeirasResponse>(
    `docentes/${docenteId}/${cursoId}/${classId}/cadeiras`,
  );

  return data;
}
