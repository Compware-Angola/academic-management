import { axiosNestGa } from "@/lib/axios-nest-ga";

// Tipo que representa exatamente o que vem do backend
export interface ParametrosDocenteItemRaw {
  codigo: number;
  designacao: string;
  descricao: string | null;
  sigla: string;
  args: string; 
  observacao: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ParametrosDocenteResponseRaw {
  data: ParametrosDocenteItemRaw[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipo convertido que usamos na aplicação
export interface ParametrosDocenteItem {
  codigo: number;
  designacao: string;
  descricao: string | null;
  sigla: string;
  args: { curso: string; state: string }[]; // <--- agora é array
  observacao: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ParametrosDocenteResponse {
  data: ParametrosDocenteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Função para buscar e converter args
export async function fetchParametrosDocente(
  search?: string,
  page = 1,
  limit = 25
): Promise<ParametrosDocenteResponse> {
  const { data } = await axiosNestGa.get<ParametrosDocenteResponseRaw>(
    'docente-gestao/parametros',
    { params: { search, page, limit } }
  );

  const convertedData: ParametrosDocenteItem[] = data.data.map(item => ({
    ...item,
    args: JSON.parse(item.args),
  }));

  return { ...data, data: convertedData };
}