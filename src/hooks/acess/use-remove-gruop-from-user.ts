import { useMutation } from "@tanstack/react-query";
import { RemoveGruopUser } from "@/services/access/remove-gruop-from-user.service";
import { queryClient } from "@/lib/react-query";

type RemoveGruopFromUserParams = {
  userId: number;
  gruopId: number;
};

export function useRemoveGruopFromUser() {
  return useMutation({
    mutationFn: ({ userId, gruopId }: RemoveGruopFromUserParams) =>
      RemoveGruopUser(userId, gruopId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-groups"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users-by-group"],
      });
      queryClient.invalidateQueries({
        queryKey: ["group-accesses"],
      });
    },
  });
}
