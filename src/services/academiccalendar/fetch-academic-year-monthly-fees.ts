// src/services/academiccalendar/fetch-academic-year-monthly-fees.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MonthlyFee = {
  designacao: string;        // ex: "OUT-2025"
  prestacao: number;         // 1, 2, 3...
  dataLimite: string;        // ISO string
  semestre: string;          // "1º Semestre" ou "2º Semestre"
};

export type MonthlyFeesResponse = {
  meses: MonthlyFee[];
};

/**
 * Busca o calendário de mensalidades/propinas por ano letivo
 * @param codigoAno - ex: 23, 24, 25...
 */
export async function fetchAcademicYearMonthlyFees(codigoAno: number): Promise<MonthlyFeesResponse> {
  const { data } = await axiosNestGa.get<MonthlyFeesResponse>(
    `/academic-calendar/monthly-fees/${codigoAno}`
  );
  return data; 
}
