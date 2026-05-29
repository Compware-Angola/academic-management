import { useQuery } from "@tanstack/react-query";
import {
  getOcupacoes,
  getProfissoes,
  getNacionalidades,
  fetchDropDownBolsas,
  ParamsBolsa,
  getAnoLectivoConfirmados,
} from "@/services/dropdown-filters/dropdown-filters.service";
import { fetchEpocas } from "@/services/fetch-epoca";

export function useProfissoesDropdownFilter() {
  return useQuery({
    queryKey: ["profissoes"],
    queryFn: getProfissoes,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useOcupacoesDropdownFilter() {
  return useQuery({
    queryKey: ["ocupacoes"],
    queryFn: getOcupacoes,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useNacionalidadesDropdownFilter() {
  return useQuery({
    queryKey: ["nacionalidades"],
    queryFn: getNacionalidades,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useEpocasDropdownFilter() {
  return useQuery({
    queryKey: ["epocas"],
    queryFn: fetchEpocas,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useDropDownBolsas(params?: ParamsBolsa) {
  return useQuery({
    queryKey: ["bolsas-dropdown", params],
    queryFn: () => fetchDropDownBolsas(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useDropDownAnoLectivoConfirmados(codigoMatricula: number) {
  return useQuery({
    queryKey: ["ano-lectivo-confirmados", codigoMatricula],
    queryFn: () => getAnoLectivoConfirmados(codigoMatricula),
    enabled: !!codigoMatricula,
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}
