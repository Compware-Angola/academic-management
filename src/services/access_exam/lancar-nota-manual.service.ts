import { axiosNestGa } from "@/lib/axios-nest-ga";

export type LancarNotaManualPayload = {
  nota: number | null;
};

export type LancarNotaManualResponse = {
  message: string;
  nota: number | null;
  status: "Admitido" | "Reprovado";
  codigoAdmissao?: number;
};

export async function lancarNotaManual(
  id: number,
  payload: LancarNotaManualPayload
) {
  const { data } = await axiosNestGa.post<LancarNotaManualResponse>(
    `/exames-de-acesso/lancar-nota-manual/${id}`,
    payload,
    {
      showSuccess: true,
    }
  );

  return data;
}
