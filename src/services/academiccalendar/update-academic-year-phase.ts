// services/academic-calendar/update-academic-year-phase.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

interface UpdateAcademicYearPhasePayload {
  faseLectiva: string;
}

export async function updateAcademicYearPhase(
  academicYearId: number,
  payload: UpdateAcademicYearPhasePayload,
) {
  const { data } = await axiosNestGa.put(
    `/academic-calendar/academic-year/${academicYearId}/fase`,
    payload,
  );

  return data;
}
