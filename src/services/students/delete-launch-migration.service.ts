import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DeleteEquivalenceMigrationTFCResponse = {
  message: string;
};

export async function deleteEquivalenceMigrationTFC(codigoGradeAluno: number) {
  const { data } =
    await axiosNestGa.delete<DeleteEquivalenceMigrationTFCResponse>(
      `/students/equivalence-migration-tfc/${codigoGradeAluno}`,
    );

  return data;
}
