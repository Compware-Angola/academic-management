import { axiosNestGa } from "@/lib/axios-nest-ga";

export type HorarioDisponivelInscricao = {
  CODIGO: number | string;
  DESIGNACAO: string;
};

export type FetchHorariosDisponiveisInscritosPorUcParams = {
  anoLectivo?: number;
  curso?: number;
  anoCurricular?: number;
  semestre?: number;
  periodo?: number;
  cadeira?: number;
};

export async function fetchHorariosDisponiveisInscritosPorUcService({
  anoLectivo = 0,
  curso = 0,
  anoCurricular = 0,
  semestre = 0,
  periodo = 0,
  cadeira = 0,
}: FetchHorariosDisponiveisInscritosPorUcParams): Promise<
  HorarioDisponivelInscricao[]
> {
  const { data } = await axiosNestGa.get<HorarioDisponivelInscricao[]>(
    "/registration/horarios-disponiveis-inscritos-por-uc",
    {
      params: {
        anoLectivo,
        curso,
        anoCurricular,
        semestre,
        periodo,
        cadeira,
      },
    }
  );

  return data;
}