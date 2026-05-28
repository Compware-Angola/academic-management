import { axiosNestGa } from "@/lib/axios-nest-ga";

export type LaunchMigrationItem = {
  codigo: number;
  nota: number;
  codigo_disciplina: number;
  disciplina: string;
  codigo_classe: number;
  classe: string;
  duracao: string;
  semestre: string;
  codigo_aluno: number;
  nome_utilizador: string | null;
};

export type LaunchMigrationResponse = {
  grades: LaunchMigrationItem[];
  totalGradesCurso: number;
  totalGrasesAluno: number;
};

export async function getLaunchMigrationService(
  codigoMatricula: number,
): Promise<LaunchMigrationResponse> {
  const { data } = await axiosNestGa.get<LaunchMigrationResponse>(
    `/students/equivalence-migration-tfc/${codigoMatricula}`,
  );

  return data;
}
