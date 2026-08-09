import { axiosNestGa } from "@/lib/axios-nest-ga";
export interface FetchEstatisticaDeEstudantesAprovadosEReprovadosParams {
  curso?: number;
  genero?: string;
  anoLectivo?: number;
  search?: string;
  estadoMatricula?: number;
  anoCurricular?: number;
  estadoAprovacao?: number;
  page?: number;
}

export interface EstatisticaDeEstudante {
  matricula: number;
  nome: string;
  curso: string;
  genero: string;
  estadoMatricula: string;
  cor: string;
  anoLectivo: string;
  classe: number;
  estadoAprovacao: string;
}

export function fetchEstatisticaDeEstudantesAprovadosEReprovados({
  curso,
  genero,
  anoLectivo,
  search,
  estadoMatricula,
  anoCurricular,
  estadoAprovacao,
  page,
}: FetchEstatisticaDeEstudantesAprovadosEReprovadosParams) {
  return axiosNestGa.get<EstatisticaDeEstudante[]>("/enrollment/estatisticas", {
    params: {
      curso,
      genero,
      anoLectivo,
      search,
      estadoMatricula,
      anoCurricular,
      estadoAprovacao,
      limit:10, // pesquisa sempre de 10 em 10 pois essa query é muito pesada
      page,
    },
  }).then((response) => response.data);
}
export interface EstadoMatriculaDropdown {
  codigo: number;
  designacao: string;
}
export async function estadoMatriculaDropdown() {
  const data = await axiosNestGa.get<EstadoMatriculaDropdown[]>("/dropdown-filters/matricula/estado");
  return data.data;
}
