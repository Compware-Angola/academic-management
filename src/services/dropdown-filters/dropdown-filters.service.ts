import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { axiosNestGa } from "@/lib/axios-nest-ga";
type DropdownFilter = {
  value: number | string;
  label: string;
};

export async function getOcupacoes(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/ocupacao",
  );
  return response.data;
}

export async function getProfissoes(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/profissao",
  );
  return response.data;
}

export async function getNacionalidades(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    "/dropdown-filters/nacionalidade",
  );
  return response.data;
}
export async function getAnoLectivoConfirmados(
  codigoMatricula: number,
): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    `/dropdown-filters/anolectivo-confirmado/${codigoMatricula}`,
  );
  return response.data;
}

type DropdownBolsa = {
  codigo: number;
  designacao: string;
};
export type ParamsBolsa = {
  designacao?: string;
};
export async function fetchDropDownBolsas(
  params?: ParamsBolsa,
): Promise<DropdownBolsa[]> {
  const response = await axiosNestFinance.get<DropdownBolsa[]>(
    "/bolsa/dropdown",
    {
      params,
    },
  );
  return response.data;
}

export async function getMotivoSituacao(
  estado: number,
): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    `/dropdown-filters/motivo-situacao`,
    {
      params: {
        estado,
      },
    },
  );
  return response.data;
}
export async function getEstadoSituacao(): Promise<DropdownFilter[]> {
  const response = await axiosNestGa.get<DropdownFilter[]>(
    `/dropdown-filters/situacao`,
  );
  return response.data;
}