import { useQuery } from "@tanstack/react-query";
import {
  getOcupacoes,
  getProfissoes,
  getNacionalidades,
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
