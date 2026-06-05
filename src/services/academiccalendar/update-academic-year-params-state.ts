import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function updateAcademicYearParamsState(
  codigoAno: number,
  payload: {
    estado: 0 | 1;
  }
) {
  const { data } = await axiosNestGa.put(
    `/academic-calendar/academic-year/${codigoAno}`,
    payload
  );

  return data;
}
