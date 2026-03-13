import {
  fetchDepartamento,
  Departamento,
} from "@/services/departamento/fetch-departamento";
import { useQuery } from "@tanstack/react-query";
export function useQueryDepartamento() {
  return useQuery<Departamento[], Error>({
    queryKey: ["departamento"],
    queryFn: fetchDepartamento,
    staleTime: 5 * 60 * 1000,
  });
}
