import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateAgendaValidationStatusPayload = {
  agendaId: number;
  statusId: 2 | 3;
};

export type UpdateAgendaValidationStatusResponse = {
  message: string;
  data: {
    id: number;
    statusId: 2 | 3;
    validatedById: number;
  };
};

export async function updateAgendaValidationStatus({
  agendaId,
  statusId,
}: UpdateAgendaValidationStatusPayload): Promise<UpdateAgendaValidationStatusResponse> {
  const { data } =
    await axiosNestGa.patch<UpdateAgendaValidationStatusResponse>(
      `/post-graduation/assessments/agenda-validation/${agendaId}/status`,
      { statusId },
    );

  return data;
}
