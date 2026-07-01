// constants/servicos.ts
export const CODIGOS_SERVICOS_COM_UC = [11481, 11482, 11490] as const;

export function servicoExigeSelecaoUC(codigo: number): boolean {
  return CODIGOS_SERVICOS_COM_UC.includes(codigo as any);
}
