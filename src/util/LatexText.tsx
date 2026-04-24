import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* -----------------------------
   1. Corrigir encoding quebrado
------------------------------ */
function fixEncoding(text: string) {
  return text
    .replace(/\^\^e7/g, "ç")
    .replace(/\^\^e3/g, "ã")
    .replace(/\^\^c3/g, "Ã")
    .replace(/\^\^a7/g, "ç")
    .replace(/\^\^a3/g, "ã");
}

/* -----------------------------
   2. Detectar se parece matemática
------------------------------ */
function looksLikeMath(text: string) {
  return (
    /\\[a-zA-Z]/.test(text) || // comandos latex
    /[\^_=]/.test(text) ||     // matemática básica
    /\d\s*[\+\-\*\/=]\s*\d/.test(text) || // operações
    /sqrt|frac|operatorname/.test(text) // palavras latex comuns
  );
}

/* -----------------------------
   3. Normalizar matemática
------------------------------ */
function normalizeMath(text: string) {
  return text
    // corrige encoding primeiro
    .replace(/\^\^e7/g, "ç")
    .replace(/\^\^e3/g, "ã")

    // converte ponto como multiplicação
    .replace(/(\d)\s*\.\s*(?=\d|[a-zA-Z])/g, "$1 \\cdot ")

    // expoentes simples x^2 -> x^{2}
    .replace(/(\w)\s*\^\s*(\w+)/g, "$1^{$2}")

    // remove espaços inválidos em \text{}
    .replace(/\\text\{\s*\}/g, "\\text{ }");
}

/* -----------------------------
   4. Componente principal
------------------------------ */
export function LatexText({ text }: { text: string }) {
  const cleaned = fixEncoding(text);

  if (!looksLikeMath(cleaned)) {
    return <span>{cleaned}</span>;
  }

  const math = normalizeMath(cleaned);

  try {
    return <InlineMath math={math} />;
  } catch (e) {
    // fallback seguro (nunca quebra UI)
    return (
      <span style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {cleaned}
      </span>
    );
  }
}