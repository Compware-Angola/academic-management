
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { corrigirProvas, getStatusJob } from "@/services/access_exam/corrigir-provas.service";
import { useToast } from "@/hooks/use-toast";

export const useCorrigirProvas = (setIsProcessando: (value: boolean) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => corrigirProvas(),
    onSuccess: (result) => {
      toast({
        title: "Correção de Provas",
        description: `Tarefa em Processamento: ${result.taskId}`,
        variant: "default",
      });

      // Armazenar o taskId em localstorage /results_final_exam
      // chamar a função para ver como esta o estatus a cada 3 segundos

      localStorage.setItem("results_final_exam_task_id", result.taskId.toString());


      // criar um intervalor para chamar a função getStatusJob a cada 3 segundos
      //Se job nao for encontrado   entao para de mostrar   o muda staus da minha variavel de controlo para false
      setIsProcessando(true)
      const interval = setInterval(async () => {
        // Pegar o Job no local storage
        const taskId = localStorage.getItem("results_final_exam_task_id");
        if (!taskId) {
          setIsProcessando(false)
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["candidatos"] });
          queryClient.invalidateQueries({ queryKey: ["provas"] });
          queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
          //LIMPAR localstorage
          localStorage.removeItem("results_final_exam_task_id");
          toast({
            title: "Correção de Provas",
            description: `Correção de Provas concluída`,
            variant: "default",
          });
          return;
        }
        const jobStatus = await getStatusJob("results_final_exam", taskId);
        if (!jobStatus || jobStatus.status === 'notfound' || jobStatus.status === 'completed' || jobStatus.status === 'failed' || jobStatus.success === false) {
          setIsProcessando(false)
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["candidatos"] });
          queryClient.invalidateQueries({ queryKey: ["provas"] });
          queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
          //LIMPAR localstorage
          localStorage.removeItem("results_final_exam_task_id");
          toast({
            title: "Correção de Provas",
            description: `Correção de Provas concluída`,
            variant: "default",
          });
        }
      }, 3000);

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