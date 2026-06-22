import { axiosNestGa } from "@/lib/axios-nest-ga";
import { axiosNestJob } from "@/lib/axios-nest-job";

export type CorrigirProvasResponse = {
  message: string;
  taskId: number;
};

/**
 * Serviço para processar a correção automática das provas do Exame de Acesso
 * Endpoint: POST /exames-de-acesso/corrigir-provas
 */
export async function corrigirProvas(): Promise<CorrigirProvasResponse> {
  const { data } = await axiosNestGa.post<CorrigirProvasResponse>(
    "/exames-de-acesso/corrigir-provas"
  );

  return data;
}

/**
 * Serviço para verificar o status da correção das provas do Exame de Acesso
 * Endpoint: GET /jobs/results_final_exam/:taskId/status
 */
type StatusJobResponse = {
  queue: string;
  message: string;
  success: boolean;
  status: string;
};

export async function getStatusJob(queueName: string, taskId: string) {
  const { data } = await axiosNestJob.get<StatusJobResponse>(
    `/jobs/${queueName}/${taskId}/status`
  );

  return data;
}
