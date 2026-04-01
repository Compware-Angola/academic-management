import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AdmitirCandidatoPayload = {
  nota: number;
};

export async function admitirCandidato(
  id: number,
  payload: AdmitirCandidatoPayload
) {
  const { data } = await axiosNestGa.post(
    `/exames-de-acesso/admitir-candidato-publico/${id}`,
    payload,
    {
      showSuccess: true, 
    }
  );

  return data;
}