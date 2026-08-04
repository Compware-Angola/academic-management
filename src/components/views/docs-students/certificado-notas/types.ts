export type Notas = {
  codigo: number;
  disciplina: string;
  nota: number;
  horas_teoricas: number;
  horas_teorico_praticas: number;
  horas_praticas: number;
  duracao_nome: string;
  ano_lectivo_nome: string;
  semestre: number;
  classe: number;
};

export type Student = {
  nome: string;
  codigoMatricula: number;
  bi: string;
  dataNascimento: string;
  curso: string;
};

export type GerarCertidaoProps = {
  notas: Notas[];
  estudante: Student;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  showDownload?: boolean;
  showPrint?: boolean;
  onBeforeDownload: (onReady: (codigo: string) => void) => void;
  isGeneratingCode?: boolean;
  diretora: string;
};

export type PDFDocumentStudentProps = {
  notas: Notas[];
  estudante: Student;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  codigoValidacao: string;
  diretora: string;
};

export type GradeCurricularDuplicada = {
  codigo: number;
  codigo_grade_curricular: number;
  turma: number | null;
  codigo_confirmacao: number | null;
  codigo_matricula: number;
  estado: number;
  nota: number | null;
  created_at: string;
  codigo_status_grade_curricular: number;
  codigo_ano_lectivo: number;
  epoca: string | null;
  observacao: string | null;
  codigo_utilizador: number | null;
  updated_at: string | null;
  equivalencia: number | null;
  codigo_curso: number;
  codigo_disciplina: number;
  codigo_classe: number;
  codigo_semestre: number;
  disciplina: string;
  classe: string;
  semestre: string;
  numero_matricula: number;
  nome_completo: string;
  curso: string;
  qtd_duplicadas: number;
};
