import { useMutation } from "@tanstack/react-query";
import { RemoveGruopUser } from "@/services/access/remove-gruop-from-user.service";

type RemoveGruopFromUserParams = {
  userId: number;
  gruopId: number;
};

export function useRemoveGruopFromUser() {
  return useMutation({
    mutationFn: ({ userId, gruopId }: RemoveGruopFromUserParams) =>
      RemoveGruopUser(userId, gruopId),
  });
}