import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import {
  CreateUcDepartmentPayload,
  createUcDepartmentService,
} from "@/services/departamento/create-uc-department.service";

export const useMutationCreateUcDepartment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateUcDepartmentPayload) =>
      createUcDepartmentService(payload),

    onSuccess: () => {
      // Atualiza lista das UC
      queryClient.invalidateQueries({
        queryKey: ["departamento-uc"],
      });

      toast({
        title: "UC criada!",
        description: "A unidade curricular foi criada com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar Unidade curricular",
        description:
          error?.response?.data?.message ||
          "Não foi possível criar a Unidade curricular",
        variant: "destructive",
      });
    },
  });
};
