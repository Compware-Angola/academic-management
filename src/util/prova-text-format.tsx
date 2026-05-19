import { type ReactNode } from "react";

import { LatexText } from "@/util/LatexText";

function decodeHtml(value: string) {
  if (typeof document === "undefined") return value;

  let decoded = value;
  for (let i = 0; i < 8; i++) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = decoded;
    if (textarea.value === decoded) break;
    decoded = textarea.value;
  }

  return decoded;
}

function normalizeHtml(value?: string | null) {
  if (!value) return "";

  return decodeHtml(value)
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
}

export function plainTextFromHtml(value?: string | null) {
  if (!value) return "";

  if (typeof document === "undefined") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  return normalizeHtml(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeHtml(value?: string | null) {
  if (!value) return "";

  if (typeof document === "undefined") {
    return plainTextFromHtml(value);
  }

  const template = document.createElement("template");
  template.innerHTML = normalizeHtml(value);

  template.content
    .querySelectorAll("script, style, iframe, object, embed")
    .forEach((node) => node.remove());

  template.content.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const currentValue = attribute.value.toLowerCase();

      if (name.startsWith("on") || currentValue.includes("javascript:")) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return template.innerHTML;
}

function hasHtmlMarkup(value?: string | null) {
  return /<\/?[a-z][\s\S]*>/i.test(normalizeHtml(value));
}

export function HtmlContent({
  value,
  className = "",
}: {
  value?: string | null;
  className?: string;
}) {
  const html = sanitizeHtml(value);

  if (!html) {
    return <span className="text-muted-foreground">Sem conteúdo</span>;
  }

  return (
    <div
      className={`space-y-3 text-sm leading-7 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_br]:block [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:pl-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:m-0 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:ml-5 [&_ul]:list-disc ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderQuestionHtmlNode(node: Node, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    return text.trim() ? <LatexText key={key} text={text} /> : text;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const children = Array.from(element.childNodes).map((child, childIndex) =>
    renderQuestionHtmlNode(child, childIndex)
  );

  switch (element.tagName.toLowerCase()) {
    case "br":
      return <br key={key} />;
    case "p":
      return (
        <p key={key} className="mb-3 last:mb-0">
          {children}
        </p>
      );
    case "strong":
    case "b":
      return <strong key={key}>{children}</strong>;
    case "em":
    case "i":
      return <em key={key}>{children}</em>;
    case "u":
      return <u key={key}>{children}</u>;
    case "ul":
      return (
        <ul key={key} className="my-3 ml-5 list-disc space-y-1">
          {children}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="my-3 ml-5 list-decimal space-y-1">
          {children}
        </ol>
      );
    case "li":
      return (
        <li key={key} className="pl-1">
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-3 border-l-4 pl-3 text-muted-foreground"
        >
          {children}
        </blockquote>
      );
    case "table":
      return (
        <div key={key} className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      );
    case "thead":
      return <thead key={key}>{children}</thead>;
    case "tbody":
      return <tbody key={key}>{children}</tbody>;
    case "tr":
      return <tr key={key}>{children}</tr>;
    case "th":
      return (
        <th key={key} className="border bg-muted/40 p-2 text-left font-semibold">
          {children}
        </th>
      );
    case "td":
      return (
        <td key={key} className="border p-2 align-top">
          {children}
        </td>
      );
    case "sup":
      return <sup key={key}>{children}</sup>;
    case "sub":
      return <sub key={key}>{children}</sub>;
    default:
      return <span key={key}>{children}</span>;
  }
}

function LatexHtmlContent({ value }: { value?: string | null }) {
  const html = sanitizeHtml(value);

  if (!html) {
    return <span className="text-muted-foreground">Sem conteúdo</span>;
  }

  if (typeof document === "undefined") {
    return <LatexText text={plainTextFromHtml(value)} />;
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  return (
    <div className="text-[15px] leading-8 text-foreground">
      {Array.from(template.content.childNodes).map((node, index) =>
        renderQuestionHtmlNode(node, index)
      )}
    </div>
  );
}

export function QuestionContent({ value }: { value?: string | null }) {
  if (!value) {
    return <span className="text-muted-foreground">Sem conteúdo</span>;
  }

  if (hasHtmlMarkup(value)) {
    return <LatexHtmlContent value={value} />;
  }

  return (
    <div className="whitespace-pre-wrap text-[15px] leading-8 text-foreground">
      <LatexText text={plainTextFromHtml(value)} />
    </div>
  );
}
