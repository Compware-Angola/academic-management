import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InactivateRegistrationPayload = {
  codigoMatricula: number;
  motivo?: string;
};

export type InactivateRegistrationResponse = {
  success: boolean;
  message: string;
  data: {
    codigoMatricula: number;
    estadoAnterior: string;
    estadoAtual: string;
    motivo: string | null;
  };
};

export async function inactivateRegistration(
  payload: InactivateRegistrationPayload,
): Promise<InactivateRegistrationResponse> {
  const { data } = await axiosNestGa.put<InactivateRegistrationResponse>(
    "/students/inactivate-registration",
    payload,
  );

  return data;
}
