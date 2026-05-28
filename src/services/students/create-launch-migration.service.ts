// services/students/equivalence-migration-tfc.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";

export type EquivalenceMigrationTFCItem = {
  anoLectivo: number;
  nota: number;
  codigoGrade: number;
  codigoGradeAluno: number;
};

export type CreateEquivalenceMigrationTFCBody = {
  matriculaId: number;
  equivalencia: number;
  itens: EquivalenceMigrationTFCItem[];
};

export async function createEquivalenceMigrationTFC(
  body: CreateEquivalenceMigrationTFCBody,
) {
  const { data } = await axiosNestGa.post(
    "/students/equivalence-migration-tfc",
    body,
  );

  return data;
}
