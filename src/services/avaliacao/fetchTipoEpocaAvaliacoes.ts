import { axiosApexGa } from "@/lib/axios-apex-ga";

interface TipoEpocaAvaliacao {
  codigo: number;
  descricao: string;
}
export const fetchTipoEpocaAvaliacoes = async () => {
  const res = await axiosApexGa.get<{
    tipo_epoca_avaliacoes: TipoEpocaAvaliacao[];
  }>("uma/tipo-epoca-avaliacao/all");
  const data = res.data.tipo_epoca_avaliacoes || [];
  return data.filter((item) => typeof item.descricao === "string");
};
