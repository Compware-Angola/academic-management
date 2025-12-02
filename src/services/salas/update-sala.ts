import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateSalaPayload = {
  designacao: string;
  tipo_sala: number | null;
  numero: string | null;
  estado?: string;
  capacidade: number;
  polo_id: number;
  piso_id: number;
  edificio_id: number;
  comprimento: number | null;
  largura: number | null;
  area: number | null;
  num_ac: number | null;
  num_lampadas: number | null;
  num_janelas: number | null;
  area_aluno: number | null;
  utilizavel: string; // "SIM" ou "NÃO"
  capacidade_exame_acesso_prova: number; // nome exato do backend
};

// Função de update (PUT ou PATCH – o teu backend aceita PUT em /rooms/:id)
export const updateSala = async (id: string, data: UpdateSalaPayload) => {
  const response = await axiosNestGa.put(`/rooms/${id}`, data);
  return response.data;
};