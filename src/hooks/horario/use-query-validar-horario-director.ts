import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { validarHorarioDirectorService } from "@/services/horario/validar-horario-director.service";

export const useMutationValidarHorarioDirector = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: validarHorarioDirectorService,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["horarios-existentes"],
      });

      toast({
        title: "Validado!",
        description: "O horário foi validado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao validar horário",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar validar o horário.",
        variant: "destructive",
      });
    },
  });
};
