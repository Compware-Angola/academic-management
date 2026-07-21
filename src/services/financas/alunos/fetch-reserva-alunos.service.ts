import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface AlunoReservaResponse {
  saldo: number;
}

export async function fetchAlunoReserva(
  CodMatricula: number,
): Promise<AlunoReservaResponse> {
  const { data } = await axiosNestFinance.get(`alunos/${CodMatricula}/saldo`);

  return data;
}
