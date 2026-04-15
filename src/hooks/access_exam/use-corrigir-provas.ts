
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { corrigirProvas } from "@/services/access_exam/corrigir-provas.service";
import { useToast } from "@/hooks/use-toast";

export const useCorrigirProvas = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: corrigirProvas,
    onSuccess: (result) => {
      toast({
        title: "Correção de Provas Concluída",
        description: `${result.message}\nProcessados: ${result.processados} | Admitidos: ${result.admitidos} | Erros: ${result.erros}`,
        variant: result.erros > 0 ? "destructive" : "default",
      });

      // Atualiza listas relacionadas
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["provas"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
    },
    onError: (error: any) => {
      toast({
        title: "Falha na Correção",
        description: error?.message || "Não foi possível processar a correção das provas.",
        variant: "destructive",
      });
    },
  });
};