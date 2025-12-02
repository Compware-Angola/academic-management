
import { axiosNestGa } from "@/lib/axios-nest-ga";
type  RoomTypes = {
      "codigo": number,
      "descricao": string
    }
export async function getRoomTypes():Promise<RoomTypes[]> {
  const response = await axiosNestGa.get<{data:RoomTypes[]}>("/room/types");
  return response.data.data ?? [] ;
}
