import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface RoleResponse {
  id: string;
  name: string;
}

export async function listarRolesService(): Promise<RoleResponse[]> {
  const { data } = await axiosNestGa.get("/solicitacoa/roles");

  return data;
}