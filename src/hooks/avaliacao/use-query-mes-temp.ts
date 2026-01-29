import { fetchMesTemp } from "@/services/avaliacao/fetch-mes-temp.service";
import { useQuery } from "@tanstack/react-query";

type MesTempParams = {
  id?: number | undefined;
};

export function useQueryMesTemp(params: MesTempParams) {
  const enabled = !!params.id;

  return useQuery({
    queryKey: ["mes-temp", params.id],
    queryFn: () =>
      fetchMesTemp({
        id: params.id!,
      }),
    enabled,
  });
}
