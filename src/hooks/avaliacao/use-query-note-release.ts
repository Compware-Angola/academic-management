import { fetchNoteReleases, NoteRelease } from "@/services/featch-note-release";
import { useQuery } from "@tanstack/react-query";

interface UseQueryNoteReleasesParams {
  anoLectivoId: number;
  gradeCurricularId: number;
  tipoProvaId: number;
  tipoAvaliacao: number;
  classe: number;
  turno:number
  
}

export function useQueryNoteReleases(params: UseQueryNoteReleasesParams) {
  return useQuery<NoteRelease[]>({
    queryKey: ["note-releases", params],
    queryFn: () => fetchNoteReleases(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    enabled: false, // NÃO buscar automaticamente
  });
}
