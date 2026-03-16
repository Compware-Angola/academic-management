import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CategoriaDocente = {
  value: number;
  label: string;
};

export async function fetchCategoriaDocente(): Promise<CategoriaDocente[]> {
  const { data } = await axiosNestGa.get("/dropdown-filters/categoria/docente");

  return data ?? [];
}
