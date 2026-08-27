import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import {
  createTroncoComumService,
  CreateTroncoComumPayload,
  CreateTroncoComumResponse,
} from "@/services/departamento/create-tronco-comum.service";

export const useMutationCreateTroncoComum = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    CreateTroncoComumResponse,
    Error,
    CreateTroncoComumPayload
  >({
    mutationFn: createTroncoComumService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["departamento-uc"],
      });
      queryClient.invalidateQueries({
        queryKey: ["vinculos-grade"],
      });

      toast({
        title: "Sucesso!",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
