export type TipoServicoFiltro = "TODOS" | "MENSALIDADE" | "OUTRO";

export const CANDIDATURAS = [
  { id: 1, label: "Licenciatura" },
  { id: 2, label: "Mestrado" },
  { id: 3, label: "Doutoramento" },
] as const;

export interface ServicoUI {
  codigo: number;
  descricao: string;
  sigla: string;
  grupo: "MENSALIDADE" | "OUTRO";
  estado: "ACTIVO" | "INACTIVO";
  poloId: number;
  codigoAnoLectivo: number;
  tipoCandidatura: number;
  estadoSolicitacao: number;
  disponibilizarAluno: boolean;
  mestrado: boolean;
  cacuaco: boolean;
  visualizarNoPortal: boolean;
  preco: number;
  precoAnterior: number;
  taxaIvaId: number;
  motivoIsencaoIvaCodigo: number;
  codigoGradeCurricular: number | null;
  canal: number;
  polo_designacao: string;
  data: string;
  anolectivo: string;
}
