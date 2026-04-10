import {
  getStudentNotesService,
  ListStudentNotesPayload,
  ListStudentNotesResponse,
} from "@/services/students/fetch-notes.service";
import { useQuery } from "@tanstack/react-query";

interface QueryStudentNotes {
  enabled?: boolean;
}

export function useQueryStudentNotes(
  payload: ListStudentNotesPayload,
  options?: QueryStudentNotes,
) {
  const { anoLectivo, codigoMatricula, page, limit } = payload;

  const defaultEnabled = !!anoLectivo && !!codigoMatricula;

  return useQuery<ListStudentNotesResponse>({
    queryKey: ["student-notes", anoLectivo, codigoMatricula, page, limit],
    queryFn: () => getStudentNotesService(payload),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
