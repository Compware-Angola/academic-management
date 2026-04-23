import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GerarDiplomaPayload = {
  codigoMatricula: number;
  segundaViaDiploma?: boolean;
};

export type GerarDiplomaResponse = {
  success: boolean;
  message: string;
  data: {
    codigoMatricula: number;
    nomeAluno: string;
    curso: string;
    dataNascimento: string;
    dataConclusao: string;
    dataEmissaoDocumento: string;
    naturalidade: string;
    nomePai: string;
    nomeMae: string;
    nivelAcademico: string;
    bilhete: string;
    notaFinal: string;
    notaFinalExtenso: string;
    genero: string;
    nomeDocumento: string;
    reitor: string;
    viaDiploma: string;
    tipoCandidaturaId: number | null;
    tipoCandidatura: string;
    template: string;
  };
};

export async function gerarDiploma(
  payload: GerarDiplomaPayload,
): Promise<GerarDiplomaResponse> {
  const { data } = await axiosNestGa.post(`/students/gerar-diploma`, payload);
  return data;
}