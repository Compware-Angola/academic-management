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