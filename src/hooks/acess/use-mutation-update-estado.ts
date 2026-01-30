import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { updateEstadoAcessoService } from "@/services/access/update-estado-acesso.service";


export const useMutationUpdateEstadoAcesso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();




  return useMutation({
    mutationFn: updateEstadoAcessoService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accesses"],
      });

      toast({
        title: "Atualizado!",
        description: "O estado do acesso foi atualizado com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar atualizar o estado do acesso.",
        variant: "destructive",
      });
    },
  });
};
