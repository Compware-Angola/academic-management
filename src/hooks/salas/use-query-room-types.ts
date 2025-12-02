import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "@/services/salas/get-room-types";

export function useQueryRoomTypes() {
  return useQuery({
    queryKey: ["room-types"],
    queryFn: getRoomTypes,
  });
}
