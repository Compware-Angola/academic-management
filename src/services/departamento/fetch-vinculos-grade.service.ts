import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface VinculoGrade {
    codigoCurso: number;
    nomeCurso: string;
    codigoClasse: number;
    anoCurricular: string;
    codigoSemestre: number;
}

export interface VinculosGradeResponse {
    codigoGrade: number;
    anoLetivo: number;
    total: number;
    vinculos: VinculoGrade[];
}
export async function fetchVinculosGrade(params: {
    codigoGrade: number;
    anoLetivo: number;
    codigoCurso?: number;
}): Promise<VinculosGradeResponse> {
    const { data } = await axiosNestGa.get("/discipline/vincular/consultar", { params });
    return data;
}