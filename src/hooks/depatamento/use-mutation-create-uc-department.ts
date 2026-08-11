import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import {
  DisciplinaDepartamentoPayload,
  createDisciplinasDepartamento,
} from "@/services/departamento/create-uc-department.service";

export const useMutationCreateUcDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: DisciplinaDepartamentoPayload) =>
      createDisciplinasDepartamento(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departamento-uc"],
      });

      toast({
        title: "UC criada!",
        description:
          "As unidades curriculares foram vinculadas ao departamento com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar Unidade curricular",
        description:
          error?.response?.data?.message ||
          "Não foi possível criar a Unidade curricular.",
        variant: "destructive",
      });
    },
  });
};
