export const TIPO_AVALIACAO = {
  "1ª Frequência": 1,
  "2ª Frequência": 2,
  Prática: 3,
  "Nota da Avaliação Contínua": 4,
  Exame: 5,
  Recurso: 6,
  "Prova Oral": 7,
  "Época Especial": 8,
  NFC: 9,
  "Nota Final Lançada": 10,
  "Lançar nota da 1ª Frequência": 11,
  "Prova Oral de Recurso": 12,
  "Melhoria de Notas": 13,
  "2ª Frequência/Exame": 14,
};

export const TipoLancamentoPrazoMap: Record<number, number> = {
  2: 1, // FREQ_1
  3: 2, // FREQ_2
  4: 3, // PRATICA
  5: 4, // AVALIACAO_CONTINUA
  6: 5, // EXAME
  7: 6, // RECURSO
  9: 7, // PROVA_ORAL
  11: 8, // EPOCA_ESPECIAL
  13: 10, // NOTA_FINAL_LANCADA
  14: 11, // LANCAR_NOTA_1F
  22: 13, // MELHORIA_NOTAS
  23: 12,
};
