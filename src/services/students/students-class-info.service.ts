import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * PARAMS - Classe Info do Aluno
 * ======================= */
export type StudentClassInfoParams = {
  numeroDeMatricula: number | string;
  anoLectivo?: number | string;
};

/* =======================
 * TIPO - Retorno da Classe Info
 * ======================= */
export type StudentClassInfo = {
  codigo_classe: number;
  classe: string;
  total_grades_inscritas: number;
  codigo_matricula: number;
  estado: string;
  nome_completo: string;
  bi: string;
  email: string | null;
  contacto: string | null;
  contacto_alternativo: string | null;
  data_nascimento: string;
  data_emissao_bi: string;
  data_validade_bi: string;
  pai: string;
  mae: string;
  naturalidade: string;
  estado_civil: string;
  sexo: string;
  morada: string;
  nacionalidade: string;
  curso_codigo: number;
  curso: string;
  faculdade: string;
  periodo_codigo: number;
  periodo: string;
  grau: string;
  regime: string;
  foto: string;
  ano_lectivo: string;
  status_lectivo: number;
  status_lectivo2: string;
};

/* =======================
 * FETCH - Classe Info do Aluno
 * ======================= */
export const fetchStudentClassInfo = async (
  params: StudentClassInfoParams,
): Promise<StudentClassInfo> => {
  const { numeroDeMatricula, anoLectivo } = params;

  const queryParams: Record<string, string | number> = {
    numeroDeMatricula: String(numeroDeMatricula).trim(),
  };

  if (anoLectivo !== undefined && anoLectivo !== null) {
    queryParams.anoLectivo = String(anoLectivo).trim();
  }

  const response = await axiosNestGa.get<StudentClassInfo>(
    `/students/classe-info`,
    { params: queryParams },
  );

  return response.data;
};