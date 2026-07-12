// types/gestao-docente/docente-wizard.types.ts

export interface PessoaWizardData {
  nomeCompleto: string;
  nomePai: string;
  nomeMae: string;
  dataDeNascimento?: string;
  numDocIdentificacao: string;
  tipoDocumentoId?: number;
  dataDeEmissaoDocumento?: string;
  dataDeExpiracaoDocumento?: string;
  sexoId?: number;
  nacionalidadeId?: number;
  endereco?: string;
  naturalidadeId?: number;
  estadoCivilId?: number;
  telefone1?: string;
  telefone2?: string;
  email: string;
}

export interface CandidaturaWizardData {
  apreciacao?: string;
  grauAcademico?: number;
  canal?: number;
  codigoMotivo?: number;
  fkEstadoCandidatura?: number;
  faculdade?: number;
  dataInicioExperiencia?: string;
  dataFimExperiencia?: string;
}

export interface DocenteWizardData {
  apreciacao?: string;
  fkEscalao?: number;
  tbCategoriaDocente?: number;
  faculdade?: number;
  valorHora?: number;
  mecanografico?: string;
  totalAnoExperiencia?: number;
  dataInicioDocencia?: string;
  propostaDeContratacao?: string;
  codContrato?: number;
}

export interface DocenteWizardState {
  pessoa: PessoaWizardData;
  candidatura: CandidaturaWizardData;
  docente: DocenteWizardData;
}

export const WIZARD_INITIAL_STATE: DocenteWizardState = {
  pessoa: { nomeCompleto: "", numDocIdentificacao: "", email: "" },
  candidatura: {},
  docente: {},
};

export interface CriarDocenteCompletoResponse {
  message: string;
  pessoaId: number;
  utilizadorId: number;
  candidaturaId: number;
  docenteId: number;
  username: string;
  senhaTemporariaGerada: boolean;
  observacao: string;
}
