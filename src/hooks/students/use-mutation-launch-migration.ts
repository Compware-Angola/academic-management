import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  CreateEquivalenceMigrationTFCBody,
  createEquivalenceMigrationTFC,
} from "@/services/students/create-launch-migration.service";

export function useMutationCreateEquivalenceMigrationTFC() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEquivalenceMigrationTFCBody) =>
      createEquivalenceMigrationTFC(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["launch-migration"],
      });
      toast({ title: "Cadastro realizado com sucesso" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao cadastrar Equivalência, Migração e TFC",
        variant: "destructive",
      });
    },
  });
}
