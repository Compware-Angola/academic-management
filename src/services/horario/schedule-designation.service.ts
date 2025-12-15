import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetNextScheduleDesignationResponse = {
  success: boolean;
  data: { designacao: string }[];
};

export async function getNextScheduleDesignationService(base: string) {
  const { data } = await axiosNestGa.get<GetNextScheduleDesignationResponse>(
    `/schedule/designation/${encodeURIComponent(base + "-H")}`
  );
  return data;
}

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
