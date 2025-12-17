import { useMutation } from "@tanstack/react-query";
import { createSchedulePermission } from "@/services/horario/schedule-permission.service";
import { useToast } from "@/hooks/use-toast";

export function useSchedulePermission() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createSchedulePermission,
    onSuccess: (data) => {
      toast({
        title: "Permissão criada com sucesso",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar permissão",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    },
  });
}
