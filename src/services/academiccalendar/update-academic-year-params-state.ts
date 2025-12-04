import { axiosApexGa } from "@/lib/axios-apex-ga";

export async function updateAcademicYearParamsState(
  codigoAno: number,
  payload: {
    estado: 0 | 1;
  }
) {
  const { data } = await axiosApexGa.put(
    `ga/teaching-parameters/academic-year/${codigoAno}`,
    payload
  );

  return data;
}
