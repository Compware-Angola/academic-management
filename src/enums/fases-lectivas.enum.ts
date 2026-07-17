export enum EstadoAnoLectivoType {
  RASCUNHO = "RASCUNHO",
  CONFIGURAVEL = "CONFIGURAVEL",
  USAVEL = "USAVEL",
  ENCERRADO = "ENCERRADO",
}

export enum TipoCandidaturaType {
  LICENCIATURA = 1,
  MESTRADO = 2,
  DOUTORAMENTO = 3,
}

export const TIPO_CANDIDATURA_LABEL: Record<TipoCandidaturaType, string> = {
  [TipoCandidaturaType.LICENCIATURA]: "Licenciatura",
  [TipoCandidaturaType.MESTRADO]: "Mestrado",
  [TipoCandidaturaType.DOUTORAMENTO]: "Doutoramento",
};
