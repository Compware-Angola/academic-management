import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  updatePersonUser,
  UpdatePersonUserRequest,
} from "@/services/access/update-person-user.service";

type UpdatePersonUserMutationInput = {
  id: string | number;
  payload: UpdatePersonUserRequest;
};

export function useUpdatePersonUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePersonUserMutationInput) =>
      updatePersonUser(id.toString(), payload),

    onSuccess: () => {
      toast({
        title: "Utilizador atualizado com sucesso!",
      });
    },

    onError: (error) => {
      console.error(error);

      toast({
        title: "Erro ao atualizar utilizador",
        variant: "destructive",
      });
    },
  });
}
