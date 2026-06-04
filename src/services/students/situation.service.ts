import { axiosNestGa } from "@/lib/axios-nest-ga";
export type ParamsSetSituationStudent = {
    enrollmentCode: number;
    reasonSituationCode: number;
    academicYearCode: number;
}

export async function setSituationStudent(payload: ParamsSetSituationStudent) {
    const { data } = await axiosNestGa.post<{
        message: string
    }>(`students/situation`, payload)
    return data
}