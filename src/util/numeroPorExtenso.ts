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

export const numeroPorExtensoMoeda = (n: number | undefined | null): string => {
  if (n === undefined || n === null) return "-";
  if (n === 0) return "Zero Kwanzas";

  const negativo = n < 0;
  const absoluto = Math.abs(n);
  const inteiro = Math.floor(absoluto);
  const centavos = Math.round((absoluto - inteiro) * 100);

  try {
    const valorInteiro = extenso(inteiro.toString(), {
      mode: "number",
      locale: "pt",
    });

    const parteInteira = `${valorInteiro.charAt(0).toUpperCase() + valorInteiro.slice(1)} Kwanza${inteiro !== 1 ? "s" : ""}`;

    let parteCentavos = "";
    if (centavos > 0) {
      const valorCentavos = extenso(centavos.toString(), {
        mode: "number",
        locale: "pt",
      });
      parteCentavos = ` e ${valorCentavos} Cêntimo${centavos !== 1 ? "s" : ""}`;
    }

    const prefixo = negativo ? "Menos " : "";
    return `${prefixo}${parteInteira}${parteCentavos}`;
  } catch (e) {
    console.error("numeroPorExtensoMoeda: erro ao converter valor:", n, e);
    return `${n} Kwanzas`;
  }
};