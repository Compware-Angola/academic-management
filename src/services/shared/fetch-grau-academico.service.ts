
import { axiosNestGa } from "@/lib/axios-nest-ga";


export type GrauAcademicoResponse = {
    codigo: number;
    label: string;
}[]

export const fetchGrauAcademicoService = async (): Promise<GrauAcademicoResponse> => {
    const { data } = await axiosNestGa.get<GrauAcademicoResponse>(
        '/dropdown-filters/grau-academico/dropdown'
    );
    return data;
}
