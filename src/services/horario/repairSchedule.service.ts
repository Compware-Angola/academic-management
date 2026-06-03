import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface MoverEstudantesParams {
  toScheduleId: number;
  studentsCurriculumIds: number[];
}

export async function repairScheduleService(
  params: MoverEstudantesParams
) {
  const { data } = await axiosNestGa.post(
    `/schedule/repair-schedule`,
    params
  );

  return data;
}


