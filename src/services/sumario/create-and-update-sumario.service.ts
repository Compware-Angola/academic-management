import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreateSumarioPayload {
  fk_agendamento_aula: number;
  fk_estado_sumario: number;
  descricao: string;
  active_state?: number;
}
export interface UpdateSumarioPayload {
  fk_agendamento_aula: number;
  fk_estado_sumario: number;
  descricao: string;
  active_state?: number;
  justificacao_director?: string;
  
}

export interface Response {
  message: string;
  success?: boolean;
}

export async function createSumarioService(
  payload: CreateSumarioPayload,
): Promise<Response> {
  const { fk_agendamento_aula, fk_estado_sumario, descricao, active_state } = payload;

  const { data } = await axiosNestGa.post<Response>(
    "sumario",
    {
      fk_agendamento_aula,
      fk_estado_sumario,
      descricao,
      active_state,
    },
  );


  return data;
}
export async function updateSumarioService(
  payload: UpdateSumarioPayload,
  codigo: number,
): Promise<Response> {
  const {descricao, fk_agendamento_aula, fk_estado_sumario, active_state } = payload;

  const { data } = await axiosNestGa.put<Response>(
    `sumario/${codigo}`,
    {
      descricao,
      fk_agendamento_aula,
      fk_estado_sumario,
      active_state,
    },
  );

  return data;
}