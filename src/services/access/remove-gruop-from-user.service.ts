
import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function RemoveGruopUser(
  userId: number,
  gruopId: number
): Promise<void> {

  await axiosNestGa.put(
    `/acess_management/remove-group-from-user/${userId}/${gruopId}`,
    {
    }
  );

}
