import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AvailableRoomsParams = {
  anoLectivo: number;
  periodo: number;
  tipoAula: number;

};

export type AvailableRoomsResponse = {
  success: boolean;
  data: { salaid: number; sala: string }[];
};

export async function availableRooms(
  params: AvailableRoomsParams
): Promise<AvailableRoomsResponse["data"]> {
  const response = await axiosNestGa.get<AvailableRoomsResponse>(
    "/rooms/disponiveis",
    { params }
  );

  return response.data.data;
}
