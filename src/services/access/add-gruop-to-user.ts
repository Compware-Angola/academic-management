import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function addGruopToUser(userId: number, gruopId: number): Promise<void>{

    await axiosNestGa.put(
        `/acess_management/add-group-to-user/${userId}/${gruopId}`,
        {
        }
      );
}

///api/acess_management/add-group-to-user/{userId}/{groupId}