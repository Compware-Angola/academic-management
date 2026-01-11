import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { addGroupAccessService } from "@/services/access/add-group-access.service";

type Params = {
  groupId: number;
};

export function useAddGroupAccess({ groupId }: Params) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accessId: string) =>
      addGroupAccessService({ groupId, accessId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-accesses", groupId],
      });
      toast({ title: "Permissão atribuída com sucesso" });
    },

    onError: () => {
      toast({
        title: "Erro ao atribuir permissão",
        variant: "destructive",
      });
    },
  });
}
