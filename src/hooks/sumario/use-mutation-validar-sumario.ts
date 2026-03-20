import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { validarSumario } from "@/services/sumario/validar-sumario.service";

/* =========================
 * Hook - VALIDAR SUMÁRIO
 * ========================= */

export function useMutationValidarSumario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      codigo,
      estado,
    }: {
      codigo: number;
      estado: number;
    }) => validarSumario(codigo, estado),

    onSuccess: () => {
      toast({
        title: "Sumário validado",
        description: "O sumário foi validado com sucesso.",
       
      });

      // Invalida queries relacionadas para atualizar a listagem
      queryClient.invalidateQueries({ queryKey: ["sumario-agendamento-aula"] });
      queryClient.invalidateQueries({ queryKey: ["sumario"] });
      queryClient.invalidateQueries({ queryKey: ["controlo-geral-assiduidade"] });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao validar sumário",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar validar o sumário.",
        variant: "destructive",
      });
    },
  });
}