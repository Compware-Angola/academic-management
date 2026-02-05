import { axiosNestFinance } from "@/lib/axios-nest-finance";

 export interface DataResponse {
  id: number;
  observacao: string;
  designacao: string;
}

export async function fetchPoloDropdown(): Promise<DataResponse[]> {
  const { data } = await axiosNestFinance.get<DataResponse[]>(
    "/shared/polo-dropdown"
  );
  return data;
}
