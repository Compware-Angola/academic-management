import { axiosApexGa } from "@/lib/axios-apex-ga";

// Definindo o tipo dos parâmetros que a função vai receber
export type UpdateInstituicaoParams = {
  instituicao: string;
  nif: string;
  contacto: string;
  endereco: string;
  sigla: string;
  tipo_instituicao: number;
};

// Função para atualizar os dados da instituição
export async function updateInstituicao(
  codigo: number,
  params: UpdateInstituicaoParams
): Promise<void> {
  
  await axiosApexGa.post(`/financa/instituicao/atualizar/${codigo}`,params)
}
