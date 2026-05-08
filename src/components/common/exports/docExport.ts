import { format } from "date-fns";

export function buildExport({
  data,
  title,
  content,
  headers,
  subtitle,
  mapRow,
}: {
  data: any[];
  title: string;
  subtitle: string;
  content: any[];
  headers: {
    key: string;
    label: string;
    pdfWidth?: number;
    excelWidth?: number;
  }[];
  mapRow: (item: any) => any;
}) {
  if (!data?.length) return null;

  const rows = data.map(mapRow);
  const total = rows.length;

  return {
    pdfProps: {
      documentTitle: title,
      subtitle,
      infoSections: [
        {
          title: "Resumo",
          content: content,
        },
      ],
      mainTable: {
        headers: headers.map((h) => ({
          ...h,
          width: h.pdfWidth ? `${h.pdfWidth}%` : undefined,
        })),
        rows,
        headerBackground: "#0D1B48",
      },
      footerNotice: "Documento gerado automaticamente.",
    },

    excelProps: {
      documentTitle: title,
      subtitle,
      infoSections: [
        {
          title: "Resumo",
          content: content,
        },
      ],
      mainTable: {
        headers: headers.map((h) => ({
          ...h,
          width: h.excelWidth ? h.excelWidth : 100,
        })),
        rows,
      },
      footerNotice: "Documento gerado automaticamente.",
      primaryColor: "#0D1B48",
    },

    fileName: `${title.replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}`,
  };
}
