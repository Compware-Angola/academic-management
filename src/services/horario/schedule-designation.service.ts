import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetNextScheduleDesignationResponse = {
  success: boolean;
  data: { designacao: string }[];
};

type GetNextScheduleDesignationParams = {
  base: string;        // ex: ACSP.1.QUIG
  periodo: number;    // ex: 5
  anoLectivo: number; // ex: 23
};

export async function getNextScheduleDesignationService({
  base,
  periodo,
  anoLectivo,
}: GetNextScheduleDesignationParams) {
  const { data } = await axiosNestGa.get<GetNextScheduleDesignationResponse>(
    "/schedule/designation",
    {
      params: {
        designation: `${base}-H`, // backend vai procurar ACSP.1.QUIG-H*
        periodo,
        ano_lectivo: anoLectivo,
      },
    }
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

  const numeros = response.data.length
    
    
  const proximo = numeros + 1;

  return `${base}-H${proximo}`;
}
