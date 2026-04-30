import { ListarDiplomadosPayload, listarEstudantesDiplomados } from "@/services/students/listar-estudantes-diplomados.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryEstudantesDiplomados(
  params: ListarDiplomadosPayload,
  enabled = true,
) {
  return useQuery({
    queryKey: ["estudantes-diplomados", params],
    queryFn: () => listarEstudantesDiplomados(params),
    enabled: enabled && !!params.anoLectivo,
  });
}