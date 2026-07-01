import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AccessRestrictionByUser = {
  codigo_acesso: number;
  designacao: string;
  sigla: string;
  status: number;
};

export type AccessRestrictionByAccess = {
  codigo_acesso: number;
  codigo_utilizador: number;
  status: number;
};

export type AccessRestrictionPayload = {
  codigoAcesso: number;
  codigoUtilizador: number;
};

export type AccessRestrictionResponse = {
  message: string;
};

export async function fetchAccessRestrictionsByUser(
  codigoUtilizador: number,
): Promise<AccessRestrictionByUser[]> {
  const response = await axiosNestGa.get<AccessRestrictionByUser[]>(
    `/acess_management/restricao/user/${codigoUtilizador}`,
  );

  return response.data;
}

export async function fetchAccessRestrictionsByAccess(
  codigoAcesso: number,
): Promise<AccessRestrictionByAccess[]> {
  const response = await axiosNestGa.get<AccessRestrictionByAccess[]>(
    `/acess_management/restricao/access/${codigoAcesso}`,
  );

  return response.data;
}

export async function createAccessRestriction(
  payload: AccessRestrictionPayload,
): Promise<AccessRestrictionResponse> {
  const response = await axiosNestGa.post<AccessRestrictionResponse>(
    "/acess_management/restricao",
    payload,
  );

  return response.data;
}

export async function removeAccessRestriction(
  payload: AccessRestrictionPayload,
): Promise<AccessRestrictionResponse> {
  const response = await axiosNestGa.delete<AccessRestrictionResponse>(
    `/acess_management/restricao/${payload.codigoAcesso}/${payload.codigoUtilizador}`,
  );

  return response.data;
}
