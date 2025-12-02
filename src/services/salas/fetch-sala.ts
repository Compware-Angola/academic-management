import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
export type Sala = {
 "pk": string,
"descricao": string,
"capacidade": string,
"capacidade_exame_acesso_prova": string,
"utilizavel": string,
"tipo_sala": string
};


export async function fetchSalas({estado,tipoSala}:{tipoSala?: string, estado:string}): Promise<Sala[]> {
  const params = tipoSala ? { p_tipo_sala: tipoSala, p_estado:estado } : undefined;

  const { data } = await axiosApexGa.get<{items: Sala[]}>(
    "/uma/salas/all",
    { params }
  );


  return data.items ?? [];
}

export interface Room {
  designacao: string;
  tipo_sala: number;
  numero: string;
  estado: string;
  capacidade: number;
  polo_id: number;
  piso_id: number;
  edificio_id: number;
  deleted_at: string | null;
  updated_at: string;

  comprimento?: number | null;
  largura?: number | null;
  area?: number | null;
  num_ac?: number | null;
  num_lampadas?: number | null;
  num_janelas?: number | null;
  area_aluno?: number | null;

  utilizavel: string;
  capacidadeexameacessoprova: number;
  codigo: number;
}

export interface RoomsApiResponse {
  success: boolean;
  data: Room[];               // <-- a API devolve "data": [ ... ]
  // se houver paginação no futuro pode ter mais campos (total, page, etc.)
}



export async function getAllRooms(): Promise<Room[]> {
  try {
    const response = await axiosNestGa.get<RoomsApiResponse>('/rooms/list-all');

    // A API devolve { success: true, data: [...] }
    return response.data.data ?? [];
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    // Podes lançar novamente ou devolver array vazio – depende da tua política
    return [];
    // ou: throw error;
  }
}