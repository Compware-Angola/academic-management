import { axiosNestGa } from "@/lib/axios-nest-ga";
type DropdownFilter = {
  value: number | string;
  label: string;
};

export async function getOcupacoes(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/ocupacao"
  );
  return response.data;
}

export async function getProfissoes(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/profissao"
  );
  return response.data;
}

export async function getNacionalidades(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/nacionalidade"
  );
  return response.data;
}
