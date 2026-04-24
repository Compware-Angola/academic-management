import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ---------------------------------------------------------
   1. Mapa de Limpeza e Conversão de Encodings/Símbolos
------------------------------------------------------------ */
const ENCODING_MAP: Record<string, string> = {
  // Acentuação e Caracteres Especiais (Formatos ^^xx)
  "\\^\\^e1": "á", "\\^\\^e9": "é", "\\^\\^ed": "í", "\\^\\^f3": "ó", "\\^\\^fa": "ú",
  "\\^\\^e0": "à", "\\^\\^e2": "â", "\\^\\^ea": "ê", "\\^\\^f4": "ô",
  "\\^\\^e3": "ã", "\\^\\^f5": "õ", "\\^\\^e7": "ç",
  "\\^\\^c1": "Á", "\\^\\^c9": "É", "\\^\\^cd": "Í", "\\^\\^d3": "Ó", "\\^\\^da": "Ú",
  "\\^\\^c3": "Ã", "\\^\\^c7": "Ç",
  
  // Símbolos Matemáticos Unicode Especiais que quebram o parser
  "\\^\\^\\^\\^221b": "\\sqrt[3]", // Raiz Cúbica Unicode
  "\\^\\^\\^\\^221c": "\\sqrt[4]", // Raiz Quarta Unicode
  "\\^\\^\\^\\^2061": "",           // Invisível (Function Application)
  
  // Operadores e formatações comuns
  "\\s\\.\\s": " \\cdot ",          // Ponto flutuante entre espaços vira multiplicação
};

function robustClean(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove delimitadores redundantes $...$ para evitar conflito com InlineMath
  // O componente InlineMath já espera o conteúdo interno, não o símbolo $
  cleaned = cleaned.replace(/^\$/, "").replace(/\$$/, "");

  // 2. Aplica o mapa de encodings
  Object.entries(ENCODING_MAP).forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(new RegExp(pattern, "g"), replacement);
  });

  // 3. Normalização de Sintaxe para KaTeX
  return cleaned
    // Corrige \sqrt[{3}]{x} para \sqrt[3]{x} (remove chaves desnecessárias no índice)
    .replace(/\\sqrt\[\{(\d+)\}\]/g, "\\sqrt[$1]")
    
    // Transforma \sqrt[3]8 em \sqrt[3]{8} e \surd64 em \sqrt{64}
    .replace(/\\sqrt\[(\d+)\](\d+)/g, "\\sqrt[$1]{$2}")
    .replace(/\\surd\s*(\d+)/g, "\\sqrt{$1}")
    
    // Garante blocos em expoentes e subscritos (x^2 -> x^{2}, a_i -> a_{i})
    .replace(/(\w|\})\s*\^\s*(\w+)/g, "$1^{$2}")
    .replace(/(\w|\})\s*_\s*(\w+)/g, "$1_{$2}")
    
    // Corrige comandos de parênteses literais
    .replace(/\\lparen/g, "(")
    .replace(/\\rparen/g, ")")
    
    // Remove barras invertidas triplas \\\ que podem vir de escapes errados
    .replace(/\\\\\\/g, "\\")
    
    // Limpeza final de espaços
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ---------------------------------------------------------
   2. Componente Principal
------------------------------------------------------------ */
export function LatexText({ text }: { text: string }) {
  // Se o texto vier vazio ou for apenas espaço
  if (!text.trim()) return null;

  const cleanedText = robustClean(text);

  // Critério de detecção: 
  // - Contém \ (comando latex)
  // - Contém ^ ou _ (expoente/subscrito)
  // - Contém chaves {} (estruturas complexas)
  // - Contém símbolos como ∞, ∫ ou √
  const looksLikeMath = /\\|[\^_={}]|[\d][+\-*/=]|√|∞|∫/.test(cleanedText);

  if (!looksLikeMath) {
    return <span>{cleanedText}</span>;
  }

  try {
    return <InlineMath math={cleanedText} />;
  } catch (error) {
    console.warn("KaTeX render issue for:", cleanedText, error);
    // Fallback: renderiza o texto limpo em fonte serifada (estilo acadêmico)
    return (
      <span style={{ fontFamily: "serif", whiteSpace: "pre-wrap", fontSize: "1.1em" }}>
        {cleanedText}
      </span>
    );
  }
}