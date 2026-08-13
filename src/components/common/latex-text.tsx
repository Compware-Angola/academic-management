import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ---------------------------------------------------------
   1. Decodificação de escapes legados ^^xx (Latin-1 / CP1252)
   -- Isto já estava correcto no teu ficheiro original.
------------------------------------------------------------ */
const CP1252_HIGH_RANGE: Record<number, number> = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178,
};

export function decodeLegacyHexEscapes(text: string): string {
  if (!text) return text;
  return text.replace(/\^\^([0-9a-fA-F]{2})/g, (match, hex: string) => {
    const byte = parseInt(hex, 16);
    const codePoint = CP1252_HIGH_RANGE[byte] ?? byte;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return match;
    }
  });
}

// Casos como "^^^^221b" (raiz cúbica unicode com 4 carets) e "^^^^2061"
// (invisível "function application") não são bytes CP1252 — são pontos
// de código Unicode directos, escapados com o dobro dos carets.
function decodeDoubleCaretUnicode(text: string): string {
  return text.replace(/\^\^\^\^([0-9a-fA-F]{4})/g, (match, hex: string) => {
    const code = parseInt(hex, 16);
    if (code === 0x2061) return ""; // function application — invisível
    if (code === 0x221b) return "\\sqrt[3]";
    if (code === 0x221c) return "\\sqrt[4]";
    try {
      return String.fromCodePoint(code);
    } catch {
      return match;
    }
  });
}

/* ---------------------------------------------------------
   2. Normalização de escapes redundantes
   -- Os dados vêm de um processo de export/import que, em
   parte dos registos, escapou strings mais do que uma vez.
   Isto produz coisas como:
     "\\\\\\sqrt{a^2+b^2}"   (6 barras em vez de 1)
     "\\$H3O+"                ($ escapado — não existe \$ em math mode)
   Nunca vimos "\\\\" (dupla barra) usado como quebra de linha
   nestas perguntas, por isso é seguro colapsar qualquer
   sequência de 2+ barras antes de uma letra para 1 barra.
------------------------------------------------------------ */
function normalizeEscaping(text: string): string {
  return (
    text
      // "\$" ou "\\\\$" etc. -> "$"  (o autor escapou o delimitador de
      // math por engano; tratamos sempre \$ como delimitador real)
      .replace(/\\+\$/g, "$")
      // colapsa 2+ barras seguidas de uma letra para 1 barra
      // (\\\\sqrt -> \sqrt, \\\\lparen -> \lparen, etc.)
      .replace(/\\{2,}(?=[A-Za-z])/g, "\\")
      // barra solta antes de uma letra que não forma nenhum comando
      // LaTeX conhecido (ex.: "\x^2" vindo de "$\\x^2-2x+4=0$") — não
      // dá para adivinhar todos os comandos válidos, por isso deixamos
      // o strict:false do KaTeX ignorar isto; ver renderMath() abaixo.
      .replace(/\s{2,}/g, " ")
  );
}

/* ---------------------------------------------------------
   3. Limpeza de sintaxe LaTeX/KaTeX
------------------------------------------------------------ */
function cleanMathSyntax(math: string): string {
  return math
    .replace(/\\sqrt\[\{(\d+)\}\]/g, "\\sqrt[$1]")
    .replace(/\\sqrt\[(\d+)\](\d+)/g, "\\sqrt[$1]{$2}")
    .replace(/\\surd\s*(\d+)/g, "\\sqrt{$1}")
    .replace(/(\w|\})\s*\^\s*(\w+)/g, "$1^{$2}")
    .replace(/(\w|\})\s*_\s*(\w+)/g, "$1_{$2}")
    .replace(/\\lparen/g, "(")
    .replace(/\\rparen/g, ")")
    .trim();
}

const RAW_MATH_MARKERS =
  /\\(operatorname|frac|sqrt|lim|sum|int|infty|cdot|times|div|pm|leq|geq|neq|approx|to|rightarrow|log|sin|cos|tan|alpha|beta|theta|pi|left|right)\b|\\:|[\^_]\{/;

function isFullyRawMath(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("\\")) return false; // só entra aqui quem começa mesmo por um comando LaTeX
  if (trimmed.includes("$")) return false; // se tem $, deixa o tokenizer normal tratar
  const outsideText = trimmed.replace(/\\text\{[^{}]*\}/g, " ");
  return RAW_MATH_MARKERS.test(outsideText); // sobrou algum comando matemático fora do \text{}?
}

/* ---------------------------------------------------------
   4. Tokenizador: separa PLAIN TEXT / \text{...} / MATH real
   -- Esta é a parte que faltava no ficheiro original. Cerca
   de 65 das ~1080 perguntas do teu FK2_PERGUNTAS misturam
   texto normal com "$...$" SEM nenhum \text{} a envolver o
   texto (ex.: 'Resolva a seguinte equação logarítmica: $log_4(5x-1)=2$').
   O parser antigo só sabia dividir por \text{}; quando isso
   não existia, a string inteira (incluindo as palavras em
   português) era empurrada para dentro do InlineMath como
   se fosse tudo matemática — e o KaTeX rebentava.
------------------------------------------------------------ */
type Segment = { type: "text" | "math"; content: string };

function tokenize(raw: string): Segment[] {
  if (isFullyRawMath(raw)) {
    return [{ type: "math", content: raw.trim() }];
  }

  const segments: Segment[] = [];
  // Captura $$...$$ ou $...$ (math real) OU \text{...} (texto explícito).
  // Tudo o resto é texto simples.
  const tokenRegex = /\$\$([\s\S]*?)\$\$|\$([^$]*?)\$|\\text\{([^{}]*)\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const plain = raw.slice(lastIndex, match.index);
      if (plain.trim()) segments.push({ type: "text", content: plain });
    }

    const [, blockMath, inlineMath, textBlock] = match;
    if (textBlock !== undefined) {
      if (textBlock.trim()) segments.push({ type: "text", content: textBlock });
    } else {
      const mathContent = (blockMath ?? inlineMath ?? "").trim();
      if (mathContent) segments.push({ type: "math", content: mathContent });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < raw.length) {
    const tail = raw.slice(lastIndex);
    if (tail.trim()) segments.push({ type: "text", content: tail });
  }

  // Nenhum delimitador encontrado: decide pelo conteúdo. Se "parece"
  // LaTeX puro (ex.: 'x^3+3x-4=0', sem nenhuma palavra em português),
  // trata como math; caso contrário é texto simples.
  if (segments.length === 0 && raw.trim()) {
    const looksLikePureMath =
      /^[\s\d+\-*/^_=(){}.,<>a-zA-Z\\√∞∫]*$/.test(raw) &&
      /[+\-*/^_=]/.test(raw);
    segments.push({ type: looksLikePureMath ? "math" : "text", content: raw });
  }

  return segments;
}

/* ---------------------------------------------------------
   Componente Principal
------------------------------------------------------------ */
export function LatexText({ text }: { text: string }) {
  if (!text.trim()) return null;

  let processed = decodeLegacyHexEscapes(text);
  processed = decodeDoubleCaretUnicode(processed);
  processed = normalizeEscaping(processed);

  const segments = tokenize(processed);

  return (
    <span style={{ whiteSpace: "normal" }}>
      {segments.map((segment, i) => {
        if (segment.type === "text") {
          return (
            <span key={i} style={{ whiteSpace: "normal" }}>
              {segment.content}
            </span>
          );
        }

        const mathContent = cleanMathSyntax(segment.content);
        const looksLikeMath = /\\|[\^_={}]|[\d][+\-*/=]|√|∞|∫/.test(
          mathContent,
        );

        if (!looksLikeMath) {
          return (
            <span key={i} style={{ whiteSpace: "normal" }}>
              {mathContent}
            </span>
          );
        }

        // IMPORTANTE: o try/catch do ficheiro original NÃO apanhava
        // erros do KaTeX, porque <InlineMath /> só é executado quando
        // o React o renderiza a seguir — fora deste try/catch síncrono.
        // A correcção real é dizer ao próprio KaTeX para nunca lançar
        // excepção (throwOnError:false) e desenhar o erro a vermelho
        // em vez de rebentar a árvore de componentes.
        return (
          <span key={i} style={{ display: "inline-block" }}>
            <InlineMath
              math={mathContent}
              settings={{
                throwOnError: false,
                strict: false,
                errorColor: "#cc0000",
              }}
            />
          </span>
        );
      })}
    </span>
  );
}
