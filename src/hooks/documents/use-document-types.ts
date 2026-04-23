
import { DocumentTypeFormatted, fetchDocumentTypes } from "@/services/documents/fetch-document-types.service";
import { useQuery } from "@tanstack/react-query";



/* =============================================
   Buscar tipos de documentos
   ============================================= */

export const useDocumentTypes = () => {
  return useQuery<DocumentTypeFormatted[], Error>({
    queryKey: ["document-types"],
    queryFn: fetchDocumentTypes,
     staleTime: 1000 * 60 * 5,
     gcTime: 1000 * 60 * 10,

    
  });
};