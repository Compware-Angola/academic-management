import { axiosApexGa } from "@/lib/axios-apex-ga";

export type UpdateInstituicaoParams = {
  instituicao: string;
  nif: string;
  contacto: string;
  endereco: string;
  sigla: string;
  tipo_instituicao: number;
  codigo: number;
};

export async function updateInstituicao(
  params: UpdateInstituicaoParams,
): Promise<void> {
  await axiosApexGa.post(`/financa/instituicao/atualizar/${params.codigo}`, {
    instituicao: params.instituicao,
    nif: params.nif,
    contacto: params.contacto,
    endereco: params.endereco,
    sigla: params.sigla,
    tipo_instituicao: params.tipo_instituicao,
  });
}
