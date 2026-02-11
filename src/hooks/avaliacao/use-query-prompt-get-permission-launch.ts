import { promptGetPermissionLaunchService } from "@/services/avaliacao/prompt-get-permission-launch.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryPromptGetPermissionLaunch({
    anoLectivo,
    grade,
    tipoAvaliacao,
    utilizadorId,
}: {
    anoLectivo?: number;
    grade?: number;
    tipoAvaliacao?: number;
    utilizadorId?: number;
}) {
    return useQuery({
        queryKey: ["prompt-get-permission-launch", anoLectivo, grade, tipoAvaliacao, utilizadorId],
        queryFn: () =>
            promptGetPermissionLaunchService({
                anoLectivo,
                grade,
                tipoAvaliacao,
                utilizadorId,
            }),
        enabled: !!anoLectivo && !!grade && !!tipoAvaliacao && !!utilizadorId,
    });
}