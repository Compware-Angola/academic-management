import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function updateDefinirOralStatus(payload: {
  codigoGrade: number;
  habilitar: boolean;
}) {
  const { data } = await axiosNestGa.patch(
    "assessment/definir/oral/status",
    payload
  );

  return data;
}
