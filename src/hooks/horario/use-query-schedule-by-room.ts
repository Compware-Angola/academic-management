// src/hooks/schedule/useQuerySchedulesByClassRoom.ts

import {
  GetSchedulesByClassRoomPayload,
  GetSchedulesByClassRoomResponse,
  getSchedulesByClassRoomService,
} from "@/services/horario/fetch-schedule-by-room.service";
import { useQuery } from "@tanstack/react-query";

export const useQuerySchedulesByClassRoom = (
  filters: GetSchedulesByClassRoomPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  },
) => {
  const {
    anoLectivo,
    semestre,
    periodo,
    anoCurricular,
    unidadeCurricular,
    curso,
    sala,
    page = 1,
    limit = 25,
  } = filters;

  // Só faz a chamada se todos os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo && !!sala;

  return useQuery<GetSchedulesByClassRoomResponse>({
    queryKey: [
      "schedules-by-class-room",
      {
        anoLectivo,
        semestre,
        periodo,
        curso,
        sala,
        page,
        unidadeCurricular,
        anoCurricular,
        limit,
      },
    ],
    queryFn: () => getSchedulesByClassRoomService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
