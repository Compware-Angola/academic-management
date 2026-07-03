export enum TipoFluxoServico {
  NORMAL = "NORMAL",
  RECURSO = "RECURSO",
  EPOCA_ESPECIAL = "EPOCA_ESPECIAL",
}

const SIGLAS_RECURSO = ["IaEdRurso"]; // <- ajuste para os valores reais do seu projeto
const SIGLAS_EPOCA_ESPECIAL = ["IeEEF"]; // <- idem

export function getTipoFluxoServico(sigla: string): TipoFluxoServico {
  if (SIGLAS_RECURSO.includes(sigla)) return TipoFluxoServico.RECURSO;
  if (SIGLAS_EPOCA_ESPECIAL.includes(sigla))
    return TipoFluxoServico.EPOCA_ESPECIAL;
  return TipoFluxoServico.NORMAL;
}

// Mantém a função antiga se ainda for usada em outro lugar,
// mas agora ela pode delegar pra evitar duplicar a lista de siglas:
export function servicoExigeSelecaoUC(sigla: string): boolean {
  return getTipoFluxoServico(sigla) !== TipoFluxoServico.NORMAL;
}
