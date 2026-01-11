import { axiosNestGa } from "@/lib/axios-nest-ga";

type AddGroupAccessParams = {
  groupId: number;
  accessId: string;
};

export async function addGroupAccessService({
  groupId,
  accessId,
}: AddGroupAccessParams): Promise<void> {
  const { data } = await axiosNestGa.post(
    `acess_management/grupo/${groupId}/acesso/${accessId}`,
    { accessId, groupId }
  );
  return data;
}
