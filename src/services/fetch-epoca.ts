import { axiosApexGa } from "@/lib/axios-apex-ga";

export type Epoca = {
  id: number;
  designacao: string;
};

export async function fetchEpocas(): Promise<Epoca[]> {
  const { data } = await axiosApexGa.get("/auto/fk2_epoca");

  return data.items ?? [];
}
