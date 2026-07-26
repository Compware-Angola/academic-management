import {
  getListTeachersService,
  ListDocentesResponse,
  ListTeachersPayload,
} from "@/services/gestao-docente/fetch-list-teachers.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryListDocentes(payload: ListTeachersPayload) {
  const { area, search, page, limit, grauAcademico } = payload;

  return useQuery<ListDocentesResponse>({
    queryKey: ["docentes-list", area, search, page, limit, grauAcademico],
    queryFn: () => getListTeachersService(payload),
  });
}