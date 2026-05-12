import { axiosNestGa } from "@/lib/axios-nest-ga";

export type IsentarColisaoMatriculaPayload = {
  matricula: number;
};

export type IsentarColisaoCursoPayload = {
  curso: number;
  turno: number;
};

export type IsentarColisaoResponse = {
  message: string;
};

export async function isentarColisaoMatriculaService(
  payload: IsentarColisaoMatriculaPayload
): Promise<IsentarColisaoResponse> {
  const { data } = await axiosNestGa.post<IsentarColisaoResponse>(
    "/registration/colisoes/matricula2",
    payload
  );

  return data;
}

export async function isentarColisaoCursoService(
  payload: IsentarColisaoCursoPayload
): Promise<IsentarColisaoResponse> {
  const { data } = await axiosNestGa.post<IsentarColisaoResponse>(
    "/registration/colisoes/curso2",
    payload
  );

  return data;
}