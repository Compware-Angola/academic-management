import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface AddGradeCurricularPlanoMassaItem {
  codigoGradeCurricular: number;
  pesoPrimeiraFreq: number;
  pesoSegundaFreq: number;
  pesoPratica: number;
  notaMinPrimeiraFreq: number;
  notaMinSegundaFreq: number;
  notaMinPratica: number;
}

export interface AddGradeCurricularPlanoMassaPayload {
  codigoCurso: number;
  codigoAnoLectivo: number;
  itens: AddGradeCurricularPlanoMassaItem[];
}

export interface PlanoMassaDuplicado {
  codigoGradeCurricular: number;
  motivo: string;
}

export interface PlanoMassaErro {
  codigoGradeCurricular: number;
  motivo: string;
}

export interface AddGradeCurricularPlanoMassaResponse {
  message: string;
  codigoPlanoCurso: number;
  totalItens: number;
  totalAdicionadas: number;
  totalDuplicadas: number;
  totalErros: number;
  adicionados: number[];
  duplicados: PlanoMassaDuplicado[];
  erros: PlanoMassaErro[];
}

export const addGradeCurricularPlanoMassa = async (
  payload: AddGradeCurricularPlanoMassaPayload,
): Promise<AddGradeCurricularPlanoMassaResponse> => {
  const { data } = await axiosNestGa.post(
    "/discipline/add-grade-curricular-plano-massa",
    payload,
  );

  return data;
};
