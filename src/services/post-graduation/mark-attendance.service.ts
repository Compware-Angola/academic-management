import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MarkPostGraduationAttendancePayload = {
  codigoAgendamento: number;
  novoEstado: number;
};

export type MarkPostGraduationAttendanceResponse = {
  message: string;
  success?: boolean;
};

export async function markPostGraduationClassAttendance(
  payload: MarkPostGraduationAttendancePayload,
): Promise<MarkPostGraduationAttendanceResponse> {
  const { data } = await axiosNestGa.patch<MarkPostGraduationAttendanceResponse>(
    "/post-graduation/attendance/marcar-aula",
    {},
    { params: payload },
  );

  return data;
}

export async function markPostGraduationTestAttendance(
  payload: MarkPostGraduationAttendancePayload,
): Promise<MarkPostGraduationAttendanceResponse> {
  const { data } = await axiosNestGa.patch<MarkPostGraduationAttendanceResponse>(
    "/post-graduation/attendance/marcar-prova",
    {},
    { params: payload },
  );

  return data;
}
