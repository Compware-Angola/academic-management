

import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function fetchDeleteActivity(id: string): Promise<any> {
  const { data } = await axiosNestGa.delete("/academic-activities/"+`${id}`);
  return data;
}
