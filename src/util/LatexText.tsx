import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export function LatexText({ text }: { text: string }) {
  // Se contiver \text, \lparen, etc — renderiza como LaTeX
  const isLatex = /\\[a-zA-Z(]/.test(text);

  if (!isLatex) return <span>{text}</span>;

  try {
    return <InlineMath math={text} />;
  } catch {
    // fallback: mostra o texto limpo sem markup
    return <span>{text.replace(/\\[a-zA-Z]+\{?|\}|\^\^[a-z0-9]+/g, "")}</span>;
  }
}