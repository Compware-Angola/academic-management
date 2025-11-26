
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { createDiscipline, CreateDisciplinePayload } from "@/services/study_plan/fect-discipline.serice";

export function useMutationCreateDiscipline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDisciplinePayload) => createDiscipline(data),
    onSuccess: (data) => {
      toast({
        title: "Disciplina criada!",
        description: `${data.designacao || "Nova disciplina"} foi adicionada com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar disciplina",
        description:
          error?.response?.data?.message ||
          "Ocorreu um erro ao tentar criar a disciplina.",
        variant: "destructive",
      });
    },
  });
}