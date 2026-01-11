import { axiosApexGa } from "@/lib/axios-apex-ga";

export type Faculdade = {
  codigo: number;
  designacao: string;
};

type FetchFaculdadesResponse = {
  faculdades: Faculdade[];
};

export async function fetchFaculdadesService(): Promise<Faculdade[]> {
  const response = await axiosApexGa.get<FetchFaculdadesResponse>(
    "uma/faculdade/all"
  );
  return response.data.faculdades;
}
