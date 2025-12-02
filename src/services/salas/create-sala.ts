import { axiosNestGa } from "@/lib/axios-nest-ga";


export type CreateSalaPayload = {
  designacao: string;
  tipo_sala: number;
  numero: string;
  estado: string;
  capacidade: number;
  polo_id: number;
  piso_id: number;
  edificio_id: number;
  comprimento: number;
  largura: number;
  area: number;
  num_ac: number;
  num_lampadas: number;
  num_janelas: number;
  area_aluno: number;
  utilizavel: string;
  capacidade_exame_acesso_prova: number;
};

export async function createSala(data: CreateSalaPayload) {
  const response = await axiosNestGa.post("/rooms", data);
  return response.data;
}
