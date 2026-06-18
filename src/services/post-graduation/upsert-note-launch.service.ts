import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpsertPostGraduationNoteItem = {
  studentCurricularGradeId: number;
  grade: number;
  observation?: string;
};

export type UpsertPostGraduationNotesPayload = {
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  periodId: number;
  courseId: number;
  curricularYearId: number;
  curricularGradeId: number;
  scheduleId: number;
  examTypeId: number;
  assessmentTypeId: number;
  termId: number;
  items: UpsertPostGraduationNoteItem[];
};

export type UpsertPostGraduationNotesResponse = {
  message: string;
  created: number;
  updated: number;
  total: number;
};



export async function upsertPostGraduationNotes(
  payload: UpsertPostGraduationNotesPayload,
) {
  const { data } =
    await axiosNestGa.put<UpsertPostGraduationNotesResponse>(
      '/post-graduation/assessments/note-launch',
      payload,
    );

  return data;
}