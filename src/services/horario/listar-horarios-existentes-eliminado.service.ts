// src/services/horario/types.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DisponibilidadeHorario =
  | "Disponivel"
  | "Fechado"
  | "Pausa"
  | "Em atendimento";

export interface HorarioEliminado {
  codigo: number;
  designacao: string;
  unidadecurricularid: number;
  unidadecurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: "Sim" | "Não";
  semestre: string;
  estado: string;
  estadocor: string | null;
  estadoid: number;
  disponibilidade: DisponibilidadeHorario;
  criadopor: string;
  atualizadopor: string;
  dataultimaatualizacao: string;
  datacriacao: string;
}
// src/services/horario/listar-horarios-eliminados.payload.ts

export interface ListarHorariosEliminadosPayload {
  anoLectivo: number;
  anoCurricular?: number;
  page?: number;
  limit?: number;
}
// src/services/horario/listar-horarios-eliminados.response.ts

export interface ListarHorariosEliminadosResponse {
  data: HorarioEliminado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// src/services/horario/listar-horarios-eliminados.service.ts

export async function listarHorariosEliminadosService(
  payload: ListarHorariosEliminadosPayload
): Promise<ListarHorariosEliminadosResponse> {
  const { anoLectivo, anoCurricular, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<ListarHorariosEliminadosResponse>(
    "/schedule/eliminated",
    {
      params: {
        anoLectivo,
        anoCurricular,
        page,
        limit,
      },
    }
  );

  return data;
}
