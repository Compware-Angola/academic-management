import { axiosNestGa } from "@/lib/axios-nest-ga";

export const TIPOS_CANDIDATURA = [
  "Licenciatura",
  "Mestrado",
  "Doutoramento",
];

export type PreInscrito = {
  id: number;
  name: string;
  email: string;
  telefone: string | null;
  grauacademico: string | null;
  tipo_de_documento: number | null;
  tipo_documento_descricao: string | null;
  numero_documento: string | null;
  foto: string | null;
  created_at: string | null;
  updated_at: string | null;
  status_: number | null;
};

export type PreInscritoFilters = {
  search?: string;
  grauacademico?: string;
  tipoDocumento?: number;
  anoLectivoId?: number;
  page?: number;
  limit?: number;
};

export type PreInscritoResponse = {
  data: PreInscrito[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreatePreInscritoPayload = {
  name: string;
  email: string;
  telefone?: string;
  grauacademico?: string;
  tipo_de_documento?: number;
  numero_documento?: string;
  password: string;
  foto?: string;
};

export type UpdatePreInscritoPayload = Partial<CreatePreInscritoPayload>;

export async function fetchPreInscritos(
  filters: PreInscritoFilters = {},
): Promise<PreInscritoResponse> {
  const { data } = await axiosNestGa.get("/pre-inscritos", {
    params: {
      ...filters,
      grauacademico: filters.grauacademico || undefined,
      tipoDocumento: filters.tipoDocumento || undefined,
      anoLectivoId: filters.anoLectivoId || undefined,
      search: filters.search || undefined,
    },
  });

  return data;
}

export async function createPreInscrito(
  payload: CreatePreInscritoPayload,
): Promise<PreInscrito> {
  const { data } = await axiosNestGa.post("/pre-inscritos", payload, {
    showSuccess: true,
  });

  return data;
}

export async function updatePreInscrito(
  id: number,
  payload: UpdatePreInscritoPayload,
): Promise<PreInscrito> {
  const { data } = await axiosNestGa.patch(`/pre-inscritos/${id}`, payload, {
    showSuccess: true,
  });

  return data;
}

export async function deletePreInscrito(id: number): Promise<void> {
  await axiosNestGa.delete(`/pre-inscritos/${id}`, {
    showSuccess: true,
  });
}
