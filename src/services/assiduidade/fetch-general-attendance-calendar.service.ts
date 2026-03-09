import { axiosNestGa } from "@/lib/axios-nest-ga";
import { CalendarMode, GeneralAttendanceResponse } from "@/util/types";


export type FetchGeneralAttendanceParams = {
  modo: CalendarMode;
  dataReferencia?: string; // YYYY-MM-DD
  docenteId?: number; // preferível
  docenteNome?: string; // legado
};

export async function fetchGeneralAttendanceCalendar(
  params: FetchGeneralAttendanceParams
): Promise<GeneralAttendanceResponse> {
  const { modo, dataReferencia, docenteId, docenteNome } = params;

  const res = await axiosNestGa.get<GeneralAttendanceResponse>(
    "/assiduidade/controle-geral-docente",
    {
      params: {
        modo,
        dataReferencia,
        docenteId,
        docenteNome,
      },
    }
  );

  return res.data;
}