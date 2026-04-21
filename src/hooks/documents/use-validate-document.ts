// src/hooks/queries/use-validate-document.ts
import { useQuery } from "@tanstack/react-query";

import {
  validateDocument,
  ValidateDocumentResponse,
} from "@/services/documents/validate-document.service";

/* =============================================
   Validar documento por código (GET)
   ============================================= */
export const useValidateDocument = (code: string) => {
  return useQuery<ValidateDocumentResponse, Error>({
    queryKey: ["validate-document", code],
    queryFn: () => validateDocument(code),

    enabled: !!code,

   
  });
};