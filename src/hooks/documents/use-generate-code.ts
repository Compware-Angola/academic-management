import { GeneratedCode, generateDocumentCode, GenerateDocumentCodeDto } from "@/services/documents/generate-code.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/* =============================================
   Gerar código de documento
   ============================================= */
export const useGenerateDocumentCode = () => {
  return useMutation<GeneratedCode, Error, GenerateDocumentCodeDto>({
    mutationFn: (payload) => generateDocumentCode(payload),

    onError: () => {
      toast.error("Erro ao gerar código do documento");
    },
  });
};