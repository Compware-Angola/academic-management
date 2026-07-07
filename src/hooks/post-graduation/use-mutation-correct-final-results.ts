import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  corrigirProvas,
  getStatusJob,
} from "@/services/access_exam/corrigir-provas.service";
import { POST_GRADUATION_FINAL_RESULTS_QUERY_KEY } from "./use-query-final-results";

const QUEUE_NAME = "results_final_exam";
const TASK_STORAGE_KEY = "results_final_exam_task_id";

export function useMutationCorrectPostGraduationFinalResults(
  setIsProcessing: (value: boolean) => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: corrigirProvas,
    onSuccess: (result) => {
      toast({
        title: "Correção de Provas",
        description: `Tarefa em processamento: ${result.taskId}`,
      });

      localStorage.setItem(TASK_STORAGE_KEY, String(result.taskId));
      setIsProcessing(true);

      const interval = window.setInterval(async () => {
        const taskId = localStorage.getItem(TASK_STORAGE_KEY);

        if (!taskId) {
          window.clearInterval(interval);
          setIsProcessing(false);
          return;
        }

        try {
          const job = await getStatusJob(QUEUE_NAME, taskId);
          const isFinished =
            !job ||
            job.success === false ||
            ["notfound", "completed", "failed"].includes(job.status);

          if (!isFinished) return;

          window.clearInterval(interval);
          localStorage.removeItem(TASK_STORAGE_KEY);
          setIsProcessing(false);
          await queryClient.invalidateQueries({
            queryKey: [POST_GRADUATION_FINAL_RESULTS_QUERY_KEY],
          });

          toast({
            title: "Correção de Provas",
            description:
              job?.status === "failed"
                ? "A correção das provas terminou com falha."
                : "Correção de provas concluída.",
            variant: job?.status === "failed" ? "destructive" : "default",
          });
        } catch {
          window.clearInterval(interval);
          localStorage.removeItem(TASK_STORAGE_KEY);
          setIsProcessing(false);
          toast({
            title: "Falha ao acompanhar a correção",
            description:
              "Não foi possível consultar o estado da tarefa de correção.",
            variant: "destructive",
          });
        }
      }, 3000);
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Falha na Correção",
        description:
          error.message || "Não foi possível iniciar a correção das provas.",
        variant: "destructive",
      });
    },
  });
}
