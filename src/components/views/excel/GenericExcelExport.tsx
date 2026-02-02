// src/components/excel/GenericExcelDocument.tsx
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// ──────────────────────────────────────────────
// Tipos (mantidos o mais próximo possível do PDF)
export interface EntityHeader {
  logoSrc?: string;           // opcional – não usado diretamente no Excel
  name: string;
  details: string[];
  primaryColor?: string;
}

export const defaultHeader: EntityHeader = {
  logoSrc: '/logo_uma.png',
  name: 'Universidade Metodista de Angola',
  details: [
    'Luanda - Angola',
    'Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi',
    'NIF: 5401150865',
    'Tel: +244 912 131 138 | +244 947 716 133',
    'Email: geral@uma.co.ao',
  ],
  primaryColor: '#0d1b48',
};

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: any) => string | number;
}

export interface TableData {
  headers: TableColumn[];
  rows: Record<string, any>[];
  headerBackground?: string;
}

// ──────────────────────────────────────────────
// Configurações base (inspiradas no PDF)
const baseExcelConfig = {
  entityNameSize: 16,
  entityDetailSize: 11,
  titleSize: 18,
  subtitleSize: 12,
  sectionTitleSize: 13,
  headerFontSize: 10,
  primaryColorDefault: '#0d1b48',
};

// ──────────────────────────────────────────────
// Props (quase idênticas ao PDF)
interface GenericExcelProps {
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
  fileName?: string;
}

// ──────────────────────────────────────────────
// Geração do Excel
export function generateGenericExcel(props: GenericExcelProps): XLSX.WorkBook {
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

  const colorHex = (primaryColor || header.primaryColor || baseExcelConfig.primaryColorDefault)
    .replace('#', '')
    .toUpperCase();

  const emittedDate = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  const year = new Date().getFullYear();

  const wb = XLSX.utils.book_new();
  const wsData: any[][] = [];

  // Cabeçalho entidade (dados brutos primeiro)
  wsData.push([header.name]);
  header.details.forEach(line => wsData.push([line]));
  wsData.push([]);

  // Título
  wsData.push([documentTitle.toUpperCase()]);
  if (subtitle) wsData.push([subtitle]);
  wsData.push([]);

  // Secções de informação
  infoSections.forEach(section => {
    if (section.title) wsData.push([section.title]);
    if (Array.isArray(section.content)) {
      section.content.forEach(line => wsData.push([line]));
    } else {
      wsData.push([section.content]);
    }
    wsData.push([]);
  });

  let tableStartRow = wsData.length;

  // Tabela principal
  if (mainTable) {
    wsData.push(mainTable.headers.map(col => col.label));

    mainTable.rows.forEach(row => {
      const rowData = mainTable.headers.map(col => {
        const value = row[col.key];
        return col.format ? col.format(value, row) : (value ?? '—');
      });
      wsData.push(rowData);
    });

    wsData.push([]);
  }

  // Totais
  totals.forEach(t => wsData.push([`${t.label}: ${t.value}`]));
  if (totals.length) wsData.push([]);

  // Aviso
  if (footerNotice) {
    wsData.push(['Aviso']);
    wsData.push([footerNotice]);
    wsData.push([]);
  }

  // Rodapé
  const footerText = customFooter ||
    `Emitido em ${emittedDate} — ${header.name} © ${year}`;
  wsData.push([footerText]);

  // Cria o worksheet APENAS AGORA
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ─── ESTILOS (depois de ws existir) ───────────────────────────────

  // 1. Nome da entidade – grande, negrito, com cor primária
  const entityNameRow = 0;
  const nameCellAddr = XLSX.utils.encode_cell({ r: entityNameRow, c: 0 });
  ws[nameCellAddr] = {
    v: header.name,
    t: 's',
    s: {
      font: {
        sz: baseExcelConfig.entityNameSize,
        bold: true,
        color: { rgb: colorHex },
      },
      alignment: { horizontal: 'left', vertical: 'center' },
    },
  };

  // 2. Detalhes da entidade – menor, cinza
  header.details.forEach((_, i) => {
    const row = 1 + i;
    const cellAddr = XLSX.utils.encode_cell({ r: row, c: 0 });
    if (ws[cellAddr]) {
      ws[cellAddr].s = {
        font: {
          sz: baseExcelConfig.entityDetailSize,
          color: { rgb: '444444' },
        },
        alignment: { horizontal: 'left', vertical: 'center' },
      };
    }
  });

  // 3. Título com merge e estilo
  const titleRowIdx = header.details.length + 2;
  if (wsData[titleRowIdx]?.[0] === documentTitle.toUpperCase()) {
    ws['!merges'] = ws['!merges'] || [];
    ws['!merges'].push({
      s: { r: titleRowIdx, c: 0 },
      e: { r: titleRowIdx, c: 6 },
    });

    const titleCell = XLSX.utils.encode_cell({ r: titleRowIdx, c: 0 });
    ws[titleCell].s = {
      font: { sz: baseExcelConfig.titleSize, bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  }

  // 4. Cabeçalho da tabela
  if (mainTable) {
    for (let c = 0; c < mainTable.headers.length; c++) {
      const cellAddr = XLSX.utils.encode_cell({ r: tableStartRow, c });
      if (ws[cellAddr]) {
        ws[cellAddr].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: colorHex } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        };
      }
    }

    ws['!cols'] = mainTable.headers.map(col => ({ wch: col.width || 15 }));

    // Alinhamento das células de dados
    for (let r = tableStartRow + 1; r < tableStartRow + 1 + mainTable.rows.length; r++) {
      for (let c = 0; c < mainTable.headers.length; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r, c });
        if (ws[cellAddr]) {
          const col = mainTable.headers[c];
          ws[cellAddr].s = {
            ...ws[cellAddr].s,
            alignment: { horizontal: col.align || 'left', vertical: 'center' },
          };
        }
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');

  return wb;
}

// ──────────────────────────────────────────────
// Ações – apenas download
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
  const handleExport = () => {
    try {
      const wb = generateGenericExcel(excelProps);
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      saveAs(blob, fileName);
    } catch (err) {
      console.error('Erro ao gerar Excel:', err);
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