import { fetchAlunoReserva } from "@/services/financas/alunos/fetch-reserva-alunos.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryReservaEstudante(codigoEstudante?: string | number) {
    return useQuery({
        queryKey: ["reserva-estudante", codigoEstudante],
        queryFn: async () => {
            return await fetchAlunoReserva(Number(codigoEstudante));
        },
        enabled: !!codigoEstudante,
    });
}