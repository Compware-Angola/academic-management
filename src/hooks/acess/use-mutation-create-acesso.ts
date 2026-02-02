import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CreateAcessoRequest, createAcessoService } from "@/services/access/create-acess.service";


export const useMutationCreateAcesso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateAcessoRequest) =>
      createAcessoService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["acessos"],
      });

      toast({
        title: "Criado com sucesso!",
        description: "O acesso foi criado com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar acesso",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar criar o acesso.",
        variant: "destructive",
      });
    },
  });
};
