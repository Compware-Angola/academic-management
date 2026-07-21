// hooks/get-student-movements.ts

import { useQuery } from "@tanstack/react-query";
import { getStudentMovements as getStudentMovementsService } from "@/services/financas/movimentos-students/movimentos-students.service";

export function useGetStudentMovements({ matricula, page, limit }: { matricula: number; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["student-movements", matricula, page, limit],
        queryFn: () => getStudentMovementsService({ matricula, page, limit }),
        enabled: !!matricula,
    });
}

