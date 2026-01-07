import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ScheduleParams = {
  anoLectivo: number;
  semestre?: number;
  periodo?: number;
  curso?: number;
  anoCurricular?: number;
  unidadeCurricular?: number;
  estado?: number;
  afetacaoDocente?: number;
  page?: number;
  limit?: number;
};

export type Schedule = {
  codigo: number;
  designacao: string;
  unidadecurricularid: number;
  unidadecurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: string;
  estado: string;
  estadocor: any;
  estadoid: number;
  disponibilidade: string;
  criadopor: string;
  atualizadopor: string;
  dataultimaatualizacao: string;
  datacriacao: string;
};
type ScheduleResponse = {
  data: Schedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const fetchSchedule = async (
  params: ScheduleParams
): Promise<ScheduleResponse> => {
  const queryParams = new URLSearchParams({
    anoLectivo: params.anoLectivo.toString(),
    page: (params.page || 1).toString(),
    limit: (params.limit || 25).toString(),
  });

  if (params.semestre)
    queryParams.append("semestre", params.semestre.toString());
  if (params.periodo) queryParams.append("periodo", params.periodo.toString());
  if (params.curso) queryParams.append("curso", params.curso.toString());
  if (params.anoCurricular)
    queryParams.append("anoCurricular", params.anoCurricular.toString());
  if (params.unidadeCurricular)
    queryParams.append(
      "unidadeCurricular",
      params.unidadeCurricular.toString()
    );
  if (params.estado) queryParams.append("estado", params.estado.toString());
  if (params.afetacaoDocente)
    queryParams.append("afetacaoDocente", params.afetacaoDocente.toString());

  const response = await axiosNestGa.get<ScheduleResponse>("schedule", {
    params: queryParams,
  });
  return response.data;
};
