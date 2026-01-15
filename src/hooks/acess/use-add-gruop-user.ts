import { useMutation } from "@tanstack/react-query";
import { addGruopToUser } from "@/services/access/add-gruop-to-user";

type AddGruopUserParams = {
  userId: number;
  gruopId: number;
};

export function useAddUserGruop() {
  return useMutation({
    mutationFn: ({ userId, gruopId }: AddGruopUserParams) =>
      addGruopToUser(userId, gruopId),
  });
}