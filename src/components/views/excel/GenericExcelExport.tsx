// GenericExcelDocument.tsx
// Usa ExcelJS (gratuita) para suporte completo de estilos + logo.
// Instala: npm install exceljs file-saver
// Tipos:   npm install -D @types/file-saver

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// ──────────────────────────────────────────────
// Tipos (idênticos ao PDF)
export interface EntityHeader {
  logoSrc?: string; // caminho público ou URL da imagem
  logoExtension?: "png" | "jpeg" | "gif"; // default: 'png'
  name: string;
  details: string[];
  primaryColor?: string;
}

export const defaultHeader: EntityHeader = {
  logoSrc: "/logo_uma.png",
  logoExtension: "png",
  name: "Universidade Metodista de Angola",
  details: [
    "Luanda - Angola",
    "Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi",
    "NIF: 5401150865",
    "Tel: +244 912 131 138 | +244 947 716 133",
    "Email: geral@uma.co.ao",
  ],
  primaryColor: "#0D1B48",
};

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: (value: any, row: any) => string | number;
}

export interface TableData {
  headers: TableColumn[];
  rows: Record<string, any>[];
  headerBackground?: string;
}

// ──────────────────────────────────────────────
// Props
export interface GenericExcelProps {
  header?: EntityHeader;
  documentTitle: string;
  subtitle?: string;
  infoSections?: Array<{
    title?: string;
    content: string | string[];
  }>;
  mainTable?: TableData;
  totals?: Array<{ label: string; value: string | number }>;
  footerNotice?: string;
  customFooter?: string;
  primaryColor?: string;
}

// ──────────────────────────────────────────────
// Helpers internos
function argb(hex: string): string {
  return "FF" + hex.replace("#", "").toUpperCase();
}

function baseFont(
  overrides: Partial<ExcelJS.Font> = {},
): Partial<ExcelJS.Font> {
  return { name: "Arial", size: 10, ...overrides };
}

function solidFill(hex: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: argb(hex) } };
}

function thinBorder(color = "CCCCCC"): Partial<ExcelJS.Borders> {
  const s: Partial<ExcelJS.Border> = {
    style: "thin",
    color: { argb: "FF" + color },
  };
  return { top: s, bottom: s, left: s, right: s };
}

function medBorder(
  sides: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean },
  hex: string,
): Partial<ExcelJS.Borders> {
  const med = (on?: boolean): Partial<ExcelJS.Border> =>
    on ? { style: "medium", color: { argb: argb(hex) } } : { style: undefined };
  return {
    top: med(sides.top),
    bottom: med(sides.bottom),
    left: med(sides.left),
    right: med(sides.right),
  };
}

function applyStyle(
  cell: ExcelJS.Cell,
  opts: {
    font?: Partial<ExcelJS.Font>;
    fill?: ExcelJS.Fill;
    alignment?: Partial<ExcelJS.Alignment>;
    border?: Partial<ExcelJS.Borders>;
  },
) {
  if (opts.font) cell.font = opts.font as ExcelJS.Font;
  if (opts.fill) cell.fill = opts.fill;
  if (opts.alignment) cell.alignment = opts.alignment as ExcelJS.Alignment;
  if (opts.border) cell.border = opts.border as ExcelJS.Borders;
}

// Carrega imagem como ArrayBuffer a partir de uma URL/caminho público
async function fetchImageAsBuffer(src: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Geração do workbook
export async function generateGenericExcel(
  props: GenericExcelProps,
): Promise<Blob> {
  const {
    header = defaultHeader,
    documentTitle,
    subtitle,
    infoSections = [],
    mainTable,
    totals = [],
    footerNotice,
    customFooter,
    primaryColor,
  } = props;

  const PRIMARY = primaryColor || header.primaryColor || "#0D1B48";
  const GRAY_TEXT = "#555555";
  const DARK_TEXT = "#222222";
  const NOTICE_BG = "#EEF2FA";
  const ZEBRA_BLUE = "#EEF3FB";
  const NUM_COLS = Math.max(mainTable?.headers.length ?? 0, 8);

  // Colunas reservadas para o logo (esquerda) e info entidade (direita)
  // Layout do cabeçalho: cols 1-2 = logo | cols 3-8 = info entidade
  const LOGO_COLS = 2;
  const INFO_START_COL = LOGO_COLS + 1;

  const emittedDate = format(new Date(), "dd/MM/yyyy 'às' HH:mm", {
    locale: pt,
  });
  const year = new Date().getFullYear();

  const wb = new ExcelJS.Workbook();
  wb.creator = header.name;
  wb.created = new Date();

  const ws = wb.addWorksheet("Relatório");

  // ── Larguras de colunas ──
  // A tabela é escrita a partir da coluna 1 (hRow.getCell(i+1)) — as mesmas
  // colunas usadas pelo cabeçalho/logo (que usa merge de células). Por isso
  // as larguras NÃO podem reservar colunas extra pro logo antes da tabela,
  // senão a largura de cada coluna fica desalinhada com os dados nela escritos.
  const colWidths: number[] = [];
  if (mainTable) {
    mainTable.headers.forEach((col) => {
      colWidths.push(col.width ?? 18);
    });
    while (colWidths.length < NUM_COLS) colWidths.push(10);
  } else {
    colWidths.push(14, 6);
    while (colWidths.length < NUM_COLS) colWidths.push(18);
  }
  ws.columns = colWidths.map((w) => ({ width: w }));

  let curRow = 1;

  // ── Helpers de linha ──
  const colorBar = (height = 5) => {
    const row = ws.getRow(curRow);
    row.height = height;
    for (let c = 1; c <= NUM_COLS; c++) {
      row.getCell(c).fill = solidFill(PRIMARY);
    }
    curRow++;
  };

  const addRow = (
    value: string | null,
    height: number,
    style: Parameters<typeof applyStyle>[1],
    fromCol = 1,
    toCol = NUM_COLS,
  ) => {
    const row = ws.getRow(curRow);
    row.height = height;
    const cell = row.getCell(fromCol);
    if (value !== null) cell.value = value;
    applyStyle(cell, style);
    if (toCol > fromCol) ws.mergeCells(curRow, fromCol, curRow, toCol);
    curRow++;
  };

  const gap = (h = 8) => {
    ws.getRow(curRow).height = h;
    curRow++;
  };

  // ════════════════════════════════════════════
  // 1. Barra superior
  colorBar(6);

  // ── Bloco cabeçalho: logo (esq) + info entidade (dir) ──
  // Reservamos linhas suficientes: 1 (nome) + N detalhes
  const HEADER_ROWS = 1 + header.details.length; // ex: 1 + 5 = 6 linhas

  // Altura de cada linha do cabeçalho
  const HEADER_ROW_HEIGHT = 16;
  const NAME_ROW = curRow;

  // Linha do nome da entidade — só nas colunas de info
  {
    const row = ws.getRow(curRow);
    row.height = 24;
    const cell = row.getCell(INFO_START_COL);
    cell.value = header.name;
    applyStyle(cell, {
      font: baseFont({ size: 14, bold: true, color: { argb: argb(PRIMARY) } }),
      alignment: { horizontal: "right", vertical: "middle" },
    });
    ws.mergeCells(curRow, INFO_START_COL, curRow, NUM_COLS);
    curRow++;
  }

  // Linhas dos detalhes
  header.details.forEach((line) => {
    const row = ws.getRow(curRow);
    row.height = HEADER_ROW_HEIGHT;
    const cell = row.getCell(INFO_START_COL);
    cell.value = line;
    applyStyle(cell, {
      font: baseFont({ size: 9, color: { argb: argb(GRAY_TEXT) } }),
      alignment: { horizontal: "right", vertical: "middle" },
    });
    ws.mergeCells(curRow, INFO_START_COL, curRow, NUM_COLS);
    curRow++;
  });

  // Coluna 1-2 (logo): merge vertical em todas as linhas do cabeçalho
  const headerLastRow = NAME_ROW + HEADER_ROWS - 1;
  if (LOGO_COLS < NUM_COLS) {
    ws.mergeCells(NAME_ROW, 1, headerLastRow, LOGO_COLS);
    // A célula do logo fica vazia por agora — a imagem é inserida abaixo
  }

  // ── Inserir logo ──
  if (header.logoSrc) {
    const imgBuffer = await fetchImageAsBuffer(header.logoSrc);
    if (imgBuffer) {
      const ext = header.logoExtension ?? "png";
      const imageId = wb.addImage({
        buffer: imgBuffer,
        extension: ext,
      });
      // tl/br em unidades de linha/coluna (0-indexed)
      ws.addImage(imageId, {
        tl: {
          col: 0,
          row: NAME_ROW - 1,
          nativeCol: 0,
          nativeColOff: 0,
          nativeRow: NAME_ROW - 1,
          nativeRowOff: 0,
        },
        br: {
          col: LOGO_COLS,
          row: headerLastRow,
          nativeCol: LOGO_COLS,
          nativeColOff: 0,
          nativeRow: headerLastRow,
          nativeRowOff: 0,
        },
        editAs: "oneCell",
      } as any);
    }
  }

  // 2. Linha divisória
  colorBar(4);

  // 3. Título
  addRow(documentTitle.toUpperCase(), 30, {
    font: baseFont({ size: 17, bold: true, color: { argb: argb(PRIMARY) } }),
    alignment: { horizontal: "center", vertical: "middle" },
  });

  // 4. Subtítulo
  if (subtitle) {
    addRow(subtitle, 18, {
      font: baseFont({ size: 11, color: { argb: argb(GRAY_TEXT) } }),
      alignment: { horizontal: "center", vertical: "middle" },
    });
  }

  gap();

  // 5. Secções de informação
  infoSections.forEach((section) => {
    if (section.title) {
      addRow(section.title, 18, {
        font: baseFont({
          size: 12,
          bold: true,
          color: { argb: argb(PRIMARY) },
        }),
        alignment: { horizontal: "left", vertical: "middle" },
      });
    }
    const lines = Array.isArray(section.content)
      ? section.content
      : [section.content];
    lines.forEach((line) =>
      addRow(line, 16, {
        font: baseFont({ size: 10, color: { argb: argb(DARK_TEXT) } }),
        alignment: { horizontal: "left", vertical: "middle" },
      }),
    );
    gap(6);
  });

  // 6. Tabela
  if (mainTable) {
    // Cabeçalho da tabela
    const hRow = ws.getRow(curRow);
    hRow.height = 22;
    mainTable.headers.forEach((col, i) => {
      const cell = hRow.getCell(i + 1);
      cell.value = col.label;
      applyStyle(cell, {
        font: baseFont({ size: 10, bold: true, color: { argb: "FFFFFFFF" } }),
        fill: solidFill(mainTable.headerBackground ?? PRIMARY),
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: thinBorder("446090"),
      });
    });
    curRow++;

    // Linhas de dados (zebra)
    mainTable.rows.forEach((row, ri) => {
      const dRow = ws.getRow(curRow);
      dRow.height = 18;
      const bg = ri % 2 === 0 ? ZEBRA_BLUE : "#FFFFFF";

      mainTable.headers.forEach((col, ci) => {
        const value = row[col.key];
        const cell = dRow.getCell(ci + 1);
        cell.value = col.format ? col.format(value, row) : (value ?? "—");
        applyStyle(cell, {
          font: baseFont({ size: 10, color: { argb: argb(DARK_TEXT) } }),
          fill: solidFill(bg),
          alignment: {
            horizontal: (col.align ??
              "left") as ExcelJS.Alignment["horizontal"],
            vertical: "middle",
            wrapText: true,
          },
          border: thinBorder("DDDDDD"),
        });
      });
      curRow++;
    });

    gap();
  }

  // 7. Totais
  if (totals.length > 0) {
    totals.forEach((t) => {
      const row = ws.getRow(curRow);
      row.height = 20;
      ws.mergeCells(curRow, 1, curRow, NUM_COLS - 1);
      const lCell = row.getCell(1);
      lCell.value = t.label;
      applyStyle(lCell, {
        font: baseFont({
          size: 12,
          bold: true,
          color: { argb: argb(PRIMARY) },
        }),
        alignment: { horizontal: "right", vertical: "middle" },
      });
      const vCell = row.getCell(NUM_COLS);
      vCell.value = t.value;
      applyStyle(vCell, {
        font: baseFont({ size: 12, bold: true, color: { argb: "FF111111" } }),
        alignment: { horizontal: "right", vertical: "middle" },
      });
      curRow++;
    });
    gap();
  }

  // 8. Aviso
  if (footerNotice) {
    addRow("Aviso", 20, {
      font: baseFont({ size: 11, bold: true, color: { argb: argb(PRIMARY) } }),
      fill: solidFill(NOTICE_BG),
      alignment: { horizontal: "center", vertical: "middle" },
      border: medBorder({ top: true, left: true, right: true }, PRIMARY),
    });
    addRow(footerNotice, 20, {
      font: baseFont({ size: 10, color: { argb: "FF444444" } }),
      fill: solidFill(NOTICE_BG),
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: medBorder({ bottom: true, left: true, right: true }, PRIMARY),
    });
    gap();
  }

  // 9. Rodapé
  const footerText =
    customFooter ?? `Emitido em ${emittedDate} — ${header.name} © ${year}`;
  addRow(footerText, 16, {
    font: baseFont({ size: 9, color: { argb: "FF888888" } }),
    alignment: { horizontal: "center", vertical: "middle" },
  });

  // ── Exporta para Blob ──
  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
}

// ──────────────────────────────────────────────
// Componente de acção — só download
interface ExcelActionsProps {
  excelProps: GenericExcelProps;
  fileName: string;
  showDownload?: boolean;
}

export function ExcelActions({
  excelProps,
  fileName,
  showDownload = true,
}: ExcelActionsProps) {
  const handleExport = async () => {
    try {
      const blob = await generateGenericExcel(excelProps);
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Erro ao gerar Excel:", err);
    }
  };

  if (!showDownload) return null;

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Exportar Excel
    </Button>
  );
}

export default ExcelActions;
