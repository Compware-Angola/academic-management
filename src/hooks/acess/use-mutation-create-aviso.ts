import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CreateAvisoRequest, createAvisoService } from "@/services/access/solicitacao/create-aviso.service";


export const useMutationCreateAviso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateAvisoRequest) =>
      createAvisoService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["avisos"], // importante bater com a query de listagem
      });

      toast({
        title: "Criado com sucesso!",
        description: "O aviso foi criado com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar aviso",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar criar o aviso.",
        variant: "destructive",
      });
    },
  });
};