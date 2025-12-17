import { useQuery } from "@tanstack/react-query";
import { availableRooms } from "@/services/salas/available-rooms";

type AvailableRoomsParams = {
  anoLectivo?: number;
  diaSemana?: number;
  tipoAula?: number;
  horaInicio?: string;
  horaFim?: string;
};

export function useAvailableRooms(params?: AvailableRoomsParams) {
  const enabled = Boolean(
    params?.anoLectivo &&
      params?.diaSemana &&
      params?.tipoAula &&
      params?.horaInicio &&
      params?.horaFim
  );

  return useQuery({
    queryKey: ["availableRooms", params],
    queryFn: () =>
      availableRooms({
        anoLectivo: params.anoLectivo,
        diaSemana: params.diaSemana,
        horaFim: params.horaFim,
        horaInicio: params.horaInicio,
        tipoAula: params.tipoAula,
      }),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
