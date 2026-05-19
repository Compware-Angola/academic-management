import { axiosNestGa } from "@/lib/axios-nest-ga";


/* ---------- PAYLOAD ---------- */
export type GetSchedulesByUcPayload = {
  anoLectivo: number;      // ex: 22
  semestre: number;        // ex: 1
  periodo: number;         // ex: 5
  curso: number;           // ex: 18
  unidadeCurricular: number; // ex: 6
  docente?: number;
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type TurmaItem = {
  codigo: number;
  designacao: string;              // "AGT.1.TAS.D-H1"
  unidadecurricularid: number;
  unidadecurricular: string;       // "Território, Ambiente e Sociedade"
  curso: string;                   // "AGT"
  ano: string;                     // "1º ano"
  capacidade: number;
  reservado: string;               // "Não"
  periodo: string;                 // "5"
  semestre: string;                // "1"
  estado: string;                  // "Concluído/Disponível"
  estadocor: string | null;
  estadoid: number;
  disponibilidade: string;         // "Disponivel"
  criadopor: string;
  atualizadopor: string | null;
  dataultimaatualizacao: string;   // "23/09/2024 00:27"
  datacriacao: string;
};

export type GetSchedulesByUcResponse = {
  data: TurmaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ---------- SERVICE ---------- */
export async function getSchedulesByUcService(
  payload: GetSchedulesByUcPayload
): Promise<GetSchedulesByUcResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    unidadeCurricular,
    docente,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetSchedulesByUcResponse>(
    "/schedule/by-uc",
    {
      params: {
        anoLectivo,
        semestre,
        periodo,
        curso,
        unidadeCurricular: unidadeCurricular,
        docente,
        page,
        limit,
      },
    }
  );

  return data;
}