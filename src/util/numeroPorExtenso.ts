import extenso from "extenso";

const unidades = [
  "ZERO",
  "UM",
  "DOIS",
  "TRÊS",
  "QUATRO",
  "CINCO",
  "SEIS",
  "SETE",
  "OITO",
  "NOVE",
];

const especiais = [
  "DEZ",
  "ONZE",
  "DOZE",
  "TREZE",
  "CATORZE",
  "QUINZE",
  "DEZASSEIS",
  "DEZASSETE",
  "DEZOITO",
  "DEZANOVE",
];

const dezenas = [
  "",
  "",
  "VINTE",
  "TRINTA",
  "QUARENTA",
  "CINQUENTA",
  "SESSENTA",
  "SETENTA",
  "OITENTA",
  "NOVENTA",
];

export const numeroPorExtenso = (n: number): string => {
  if (n < 10) return `${n} (${unidades[n]})`;
  if (n < 20) return `${n} (${especiais[n - 10]})`;
  if (n < 100) {
    const dez = Math.floor(n / 10);
    const uni = n % 10;

    const texto =
      uni === 0 ? dezenas[dez] : `${dezenas[dez]} E ${unidades[uni]}`;

    return `${n} (${texto})`;
  }

  return `${n} (NÃO SUPORTADO)`;
};

export const numeroPorExtensoMoeda = (n: number | undefined): string => {
  if (!n) return "-";
  const valor = extenso(n?.toString(), {
    mode: "number",
    locale: "pt",
  });
  return `${valor.charAt(0).toUpperCase() + valor.slice(1)} Kwanzas`;
};
