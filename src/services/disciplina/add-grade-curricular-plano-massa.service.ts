import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface AddGradeCurricularPlanoMassaItem {
  codigoGradeCurricular: number;
  temOral?: boolean;
  temPratica?: boolean;
}

export interface AddGradeCurricularPlanoMassaPayload {
  codigoCurso: number;
  codigoAnoLectivo: number;
  itens: AddGradeCurricularPlanoMassaItem[];
}

export interface PlanoMassaDuplicado {
  codigoGradeCurricular: number;
  nomeDisciplina?: string | null;
  motivo: string;
}
export interface Adicionados {
  codigoGradeCurricular: number;
  nomeDisciplina?: string | null;

}

export interface PlanoMassaErro {
  codigoGradeCurricular: number;
  nomeDisciplina?: string | null;
  motivo: string;
}

export interface AddGradeCurricularPlanoMassaResponse {
  message: string;
  codigoPlanoCurso: number;
  totalItens: number;
  totalAdicionadas: number;
  totalDuplicadas: number;
  totalErros: number;
  adicionados: Adicionados[];
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
