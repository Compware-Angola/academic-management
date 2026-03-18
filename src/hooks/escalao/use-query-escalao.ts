import {
  Escalao,
  fetchEscalao,
} from "@/services/escalao/fetch-escalao.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryEscalao() {
  return useQuery<Escalao[]>({
    queryKey: ["escalao"],
    queryFn: fetchEscalao,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
