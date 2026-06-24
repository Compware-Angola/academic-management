import { axiosNestGa } from "@/lib/axios-nest-ga";
export enum PostGraduationCandidateStatus {
  TODOS = 'TODOS',
  ADMITIDO = 'ADMITIDO',
  REJEITADO = 'REJEITADO',
  PENDENTE = 'PENDENTE',
}

export enum PostGraduationPaymentStatus {
  TODOS = 'TODOS',
  PAGO = 'PAGO',
  NAO_PAGO = 'NAO_PAGO',
}
export type PosGraduationCandidate = {
  codigo_preinscricao: number
  data: string
  nome_completo: string
  bilhete_identidade: string
  sexo: string
  contactos_telefonicos: string
  email?: string
  candidatura: string
  curso_candidatura: string
  estado: string
  pagamento_realizado: number
  ano_lectivo:string
}

export type PosGraduationCandidatesResponse = {
  data: PosGraduationCandidate[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PosGraduationCandidatesParams = {
  codigoTipoCandidatura?: number,
  codigoCurso?: number,
  sortBy?: string
  sortOrder?: string
  limit?: number
  codigoAnoLectivo?: number
  estado?: PostGraduationCandidateStatus
  pagamento?:PostGraduationPaymentStatus
  page?:number
  
}


export async function fetchPosGraduationCandidates(
  params: PosGraduationCandidatesParams,
): Promise<PosGraduationCandidatesResponse> {
  const { data } =
    await axiosNestGa.get<PosGraduationCandidatesResponse>(
      "/post-graduation/candidates",
      { params },
    );

  return data;
}


export type PosGraduationCandidateDocument = {
  nome_arquivo: string;
  descricao: string;
};

export async function fetchPosGraduationCandidateDocuments(
  codigoPreinscricao: number,
): Promise<PosGraduationCandidateDocument[]> {
  const { data } = await axiosNestGa.get<
    PosGraduationCandidateDocument[]
  >(
    `/post-graduation/candidates/${codigoPreinscricao}/documents`,
  );

  return data;
}