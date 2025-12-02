import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { updateSala, UpdateSalaPayload } from "@/services/salas/update-sala";

export const useMutationUpdateSala = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateSalaPayload) =>
      updateSala(id, data),

    onSuccess: () => {
      toast({
        title: "Sala atualizada com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["salas-new"] });
   
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar sala",
        description: error?.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });
};