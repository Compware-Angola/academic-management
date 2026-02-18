function calcularDuracao(inicio?: string, fim?: string): string | undefined {
  if (!inicio || !fim) return undefined;

  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fim.split(":").map(Number);

  const minutosInicio = h1 * 60 + m1;
  const minutosFim = h2 * 60 + m2;

  const diferenca = minutosFim - minutosInicio;

  if (diferenca <= 0) return undefined;

  return diferenca.toString();
}
export { calcularDuracao };
