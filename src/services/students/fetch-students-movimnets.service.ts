import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface StudentMovement {
  referencia: number;
  data_movimento: string;

  credito: number;
  debito: number;

  estado: number;
  matricula: number;

  saldo_operacao: number;
  saldo_geral: number;

  codigotipomovimento: number;
  codigomotivo: number | null;
  codigoutilizador: number | null;

  observacao: string | null;

  factura: number | null;
  codigo: number;

  valor_excedente: number;
}

export interface StudentMovementsResponse {
  data: StudentMovement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetStudentMovementsParams {
  matricula: number;
  page?: number;
  limit?: number;
}

export const getStudentMovements = async ({
  matricula,
  page = 1,
  limit = 10,
}: GetStudentMovementsParams): Promise<StudentMovementsResponse> => {
  const { data } = await axiosNestGa.get<StudentMovementsResponse>(
    `/alunos/${matricula}/movimentos`,
    {
      params: { page, limit },
    },
  );

  return data;
};
