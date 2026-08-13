import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ---------------------------------------------------------------
   LatexText — versão SIMPLIFICADA para dados já normalizados.

   Pressupostos garantidos pelo pipeline de normalização
   (normalize_perguntas.py) para TODAS as perguntas de
   FK2_PERGUNTAS_normalizado.json:

     1. Texto normal aparece sempre FORA de $...$.
     2. Toda a matemática aparece sempre DENTRO de $...$
        (nunca $$...$$, nunca \text{...} sem $ à volta).
     3. Não há \lparen \rparen \textbraceleft \textbraceright
        \textbackslash \textasciicircum soltos.
     4. Não há escapes ^^xx / ^^^^xxxx por decodificar.
     5. Não há barras invertidas duplicadas.
     6. Cada string tem um número par de "$" (delimitadores sempre
        fechados) e as chavetas dentro de cada $...$ estão
        balanceadas.

   Por isso o componente já não precisa de:
     - decodeLegacyHexEscapes / decodeDoubleCaretUnicode (dados já
       vêm decodificados);
     - normalizeEscaping (dados já vêm com escapes normalizados);
     - classifyPlainChunk / o heurístico "parece matemática sem $"
       (dados já vêm sempre com $ explícito à volta da matemática);
     - TEXT_ESCAPE_MAP para \lparen/\rparen/etc. em segmentos de
       texto (já não existem no texto normalizado).

   O tokenizador fica reduzido a UMA regra: dividir a string por
   "$...$". O que estiver fora é texto; o que estiver dentro vai
   para o KaTeX. Isto elimina toda a superfície de bugs do
   tokenizador anterior (texto colado à matemática, \text{}
   aninhado dentro de $, ordem de decodificação, etc.) porque
   esses problemas já foram resolvidos uma vez, no momento da
   normalização, em vez de a cada render.
------------------------------------------------------------------ */

type Segment = { type: "text" | "math"; content: string };

const MATH_DELIM_RE = /\$([^$]*)\$/g;

function tokenize(raw: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MATH_DELIM_RE.lastIndex = 0;
  while ((match = MATH_DELIM_RE.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index);
      if (text) segments.push({ type: "text", content: text });
    }

    const mathContent = match[1].trim();
    if (mathContent) segments.push({ type: "math", content: mathContent });

    lastIndex = MATH_DELIM_RE.lastIndex;
  }

  if (lastIndex < raw.length) {
    const tail = raw.slice(lastIndex);
    if (tail) segments.push({ type: "text", content: tail });
  }

  return segments;
}

/* ---------------------------------------------------------------
   Rede de segurança: mesmo com dados normalizados, nunca custa
   nada manter throwOnError:false — se algum registo escapar à
   normalização (ex.: import futuro de dados novos ainda não
   passados pelo pipeline), o KaTeX desenha o erro a vermelho em
   vez de rebentar a árvore de componentes do React.
------------------------------------------------------------------ */
export function LatexText({ text }: { text: string }) {
  if (!text || !text.trim()) return null;

  const segments = tokenize(text);

  // Fallback: se por algum motivo não houver nenhum "$" na string
  // (não deveria acontecer com dados normalizados, mas protege
  // contra registos ainda não migrados), mostra o texto tal e qual.
  if (segments.length === 0) {
    return <span style={{ whiteSpace: "normal" }}>{text}</span>;
  }

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

        return (
          <span key={i} style={{ display: "inline-block" }}>
            <InlineMath
              math={segment.content}
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
