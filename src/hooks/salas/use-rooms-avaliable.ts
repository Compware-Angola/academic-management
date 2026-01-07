import { useQuery } from "@tanstack/react-query";
import { availableRooms } from "@/services/salas/available-rooms";

type AvailableRoomsParams = {
  anoLectivo?: number;
  periodo?: number;
  tipoAula?: number;

};

export function useAvailableRooms(params?: AvailableRoomsParams) {
  const enabled = Boolean(
      params?.anoLectivo &&
      params?.periodo &&
      params?.tipoAula
  
  );

  return useQuery({
    queryKey: ["availableRooms", params],
    queryFn: () =>
      availableRooms({
        anoLectivo: params.anoLectivo,
        periodo: params.periodo,
        tipoAula: params.tipoAula,
      }),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
