// hooks/access-management/useCreatePersonUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { createPersonUser, CreatePersonUserRequest } from "@/services/access/create-person-user.service"


type CreatePersonUserMutationInput = {
  payload: CreatePersonUserRequest
}



export function useCreatePersonUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()


  return useMutation({
    mutationFn: ({ payload }: CreatePersonUserMutationInput) => createPersonUser(payload),

    onSuccess: () => {
      toast({
        title: "Utilizador criado com sucesso!",
      })

     
    },

    onError: (error) => {
      console.log(error);
      
      toast({
        title: "Erro ao criar utilizador",
        variant: "destructive",
      })
    },
  })
}
