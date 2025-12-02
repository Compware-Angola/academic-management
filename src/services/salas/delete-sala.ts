import { axiosNestGa } from "@/lib/axios-nest-ga";
export type DeleteResponse = {message:string, success:boolean}
export async function DeleteSala(id:string) {


  const { data } = await axiosNestGa.delete<DeleteResponse>(
    `rooms/${id}`);


  return data;
}
