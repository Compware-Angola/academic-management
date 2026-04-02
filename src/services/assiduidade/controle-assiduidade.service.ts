import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AgendamentosDocentePayload = {
  docente?: number;
  dataInicial: string;
  dataFinal: string;
  estado?: number;
  anoLectivo?: number;
  semestre?: number;
  curso?: string;
  gradeCurricular?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type AgendamentoDocenteItem = {
  codigo: number;
  curso: string;
  unidade_curricular: string;
  ordem_tempo: number;
  hora_inicio: string;
  hora_fim: string;
  data_aula: string;
  docente: string;
};

export type AgendamentosDocenteResumo = {
  marcacoesPendentes: number;
  presencasMarcadas: number;
  faltasMarcadas: number;
};

export type AgendamentosDocenteResponse = {
  data: AgendamentoDocenteItem[];
  resumo?: AgendamentosDocenteResumo;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export async function controleAssiduidadeService(
  payload: AgendamentosDocentePayload,
): Promise<AgendamentosDocenteResponse> {
  const {
    docente,
    dataInicial,
    dataFinal,
    estado,
    anoLectivo,
    semestre,
    gradeCurricular,
    search,
    page = 1,
    limit = 20,
  } = payload;

  const { data } = await axiosNestGa.get<AgendamentosDocenteResponse>(
    "/assiduidade/controle",
    {
      params: {
        docente,
        dataInicial,
        dataFinal,
        estado,
        anoLectivo,
        semestre,
        gradeCurricular,
        search,
        page,
        limit,
      },
    },
  );

  return data;
}