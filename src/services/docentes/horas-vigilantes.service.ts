import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListHorariosVigilantePayload = {
  vigilanteId: number;
  prazoId: number;
  periodoId?: number;
  estado?: number;
  page?: number;
  limit?: number;
};

export type HorarioVigilanteItem = {
  horario: string;
  horatermino: string;
  horaprova: string;
  dataprova: string;
  disciplina: string;
  sala: string;
  docente: string;
  estado: string;
};

export type ListHorariosVigilanteResponse = {
  data: HorarioVigilanteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getHorariosVigilanteService(
  payload: ListHorariosVigilantePayload,
): Promise<ListHorariosVigilanteResponse> {
  const {
    vigilanteId,
    prazoId,
    periodoId,
    estado,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListHorariosVigilanteResponse>(
    "/docentes/horarios-vigilantes",
    {
      params: {
        vigilanteId,
        prazoId,
        periodoId,
        estado,
        page,
        limit,
      },
    },
  );

  return data;
}
