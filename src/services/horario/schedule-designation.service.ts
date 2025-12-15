import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetNextScheduleDesignationResponse = {
  success: boolean;
  data: { designacao: string }[];
};

export async function getNextScheduleDesignationService(base: string) {
  try {
    const { data } = await axiosNestGa.get<GetNextScheduleDesignationResponse>(
      `/schedule/designation/${encodeURIComponent(base + "-H")}`
    );
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { success: true, data: [] };
    }

    throw err;
  }
}

/**
 * Gera a designação final com base na resposta
 */
export function gerarDesignacao(
  base: string,
  response: GetNextScheduleDesignationResponse
) {
  if (!response.success || response.data.length === 0) {
    return `${base}-H1`;
  }

  const numeros = response.data
    .map((item) => {
      const match = item.designacao.match(/-H(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);

  const proximo = Math.max(...numeros) + 1;

  return `${base}-H${proximo}`;
}
