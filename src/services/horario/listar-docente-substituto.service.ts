
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

/* ---------- PAYLOAD ---------- */
export type ListarDocenteSubstitutoPayload = {
  anoLectivo: number | string;
  semestre?: number | string;
  periodo?: number | string;
  curso?: number | string;
  anoCurricular?: number | string;
  unidadeCurricular?: number | string;
  fkDocenteOriginal?: number | string;
  fkDocenteSubstituto?: number | string;
  fkHorario?: number | string;
  dataInicio?: string;
  dataTermino?: string;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ITEM ---------- */
export type DocenteSubstituto = {
  codigo: number;

  // Docente original
  fkdocenteoriginal: number;
  pkdocenteoriginal: string | null;
  nomedocenteoriginal: string | null;

  // Docente substituto
  fkdocentesubstituto: number;
  nomedocentesubstituto: string | null;

  // Horário / Aula
  fkhorario: number;
  designacaohorario: string | null;
  horainicio: string | null;
  horatermino: string | null;
  diasemana: number | null;
  refaula: string | null;
  refsala: string | null;

  // Grade / Unidade Curricular
  unidadecurricular: string | null;
  curso: string | null;
  anocurricular: string | null;
  semestre: string | null;

  // Período da substituição
  datainicio: string | null;
  datatermino: string | null;

  // Extra
  obs: string | null;
  activestate: number;

  // Auditoria
  criadopor: string | null;
  atualizadopor: string | null;
  datacriacao: string | null;
  dataatualizacao: string | null;
};

/* ---------- RESPONSE COMPLETO ---------- */
export type ListarDocenteSubstitutoResponse = {
  data: DocenteSubstituto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function listarDocenteSubstitutoService(
  payload: ListarDocenteSubstitutoPayload
): Promise<ListarDocenteSubstitutoResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    unidadeCurricular,
    fkDocenteOriginal,
    fkDocenteSubstituto,
    fkHorario,
    dataInicio,
    dataTermino,
    page = 1,
    limit = 25,
  } = payload;

  const params = {
    anoLectivo: normalizeParam(anoLectivo),
    semestre: normalizeParam(semestre),
    periodo: normalizeParam(periodo),
    curso: normalizeParam(curso),
    anoCurricular: normalizeParam(anoCurricular),
    unidadeCurricular: normalizeParam(unidadeCurricular),
    fkDocenteOriginal: normalizeParam(fkDocenteOriginal),
    fkDocenteSubstituto: normalizeParam(fkDocenteSubstituto),
    fkHorario: normalizeParam(fkHorario),
    dataInicio: dataInicio ?? undefined,
    dataTermino: dataTermino ?? undefined,
    page,
    limit,
  };

  const { data } = await axiosNestGa.get<ListarDocenteSubstitutoResponse>(
    "/docente-substituto",
    { params }
  );

  return data;
}