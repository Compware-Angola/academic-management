// src/components/pdf/GenericPDFDocument.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import React, { ReactElement } from 'react';

// ──────────────────────────────────────────────
// Tipos (mantidos iguais)
export interface EntityHeader {
  logoSrc: string;
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
  primaryColor: '#0D1B48',
};

export interface TableColumn {
  key: string;
  label: string;
  width: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableData {
  headers: TableColumn[];
  rows: Record<string, any>[];
  headerBackground?: string;
}

// ──────────────────────────────────────────────
// Estilos base
const baseStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: { width: 120, height: 60 },
  entityInfo: { textAlign: 'right' },
  entityName: { fontSize: 16, fontWeight: 'bold' },
  entityDetail: { fontSize: 9, color: '#444', marginTop: 2 },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    textTransform: 'uppercase' as const,
  },
  subtitle: { textAlign: 'center', fontSize: 12, color: '#555', marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  tableContainer: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: { flexDirection: 'row' },
  tableHeaderCell: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center' as const,
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 10,
  },
  noticeBox: {
    marginTop: 30,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 6,
    textAlign: 'center' as const,
  },
  noticeTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  noticeText: { fontSize: 10, color: '#444' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: 'center' as const,
    color: '#777',
  },
});

// ──────────────────────────────────────────────
// Props do documento
interface GenericPDFProps {
  header?: EntityHeader;
  documentTitle: string;
  subtitle?: string;
  infoSections?: Array<{
    title?: string;
    content: React.ReactNode | string[];
  }>;
  mainTable?: TableData;
  totals?: Array<{ label: string; value: string | number }>;
  footerNotice?: string | React.ReactNode;
  customFooter?: string;
  children?: React.ReactNode;
  primaryColor?: string;
}

// ──────────────────────────────────────────────
// Componente PDF
export function GenericPDFDocument(props: GenericPDFProps) {
  const {
    header = defaultHeader,
    documentTitle,
    subtitle,
    infoSections = [],
    mainTable,
    totals = [],
    footerNotice,
    customFooter,
    children,
    primaryColor,
  } = props;

  const color = primaryColor || header.primaryColor || '#0D1B48';

  const dynamicStyles = {
    ...baseStyles,
    header: { ...baseStyles.header, borderColor: color },
    title: { ...baseStyles.title, color },
    noticeBox: { ...baseStyles.noticeBox, borderColor: color },
    noticeTitle: { ...baseStyles.noticeTitle, color },
  };

  return (
    <Document>
      <Page size="A4" style={dynamicStyles.page}>
        <View style={dynamicStyles.header}>
          <Image style={baseStyles.logo} src={header.logoSrc} />
          <View style={baseStyles.entityInfo}>
            <Text style={{ ...baseStyles.entityName, color }}>{header.name}</Text>
            {header.details.map((line, i) => (
              <Text key={i} style={baseStyles.entityDetail}>{line}</Text>
            ))}
          </View>
        </View>

        <Text style={dynamicStyles.title}>{documentTitle}</Text>
        {subtitle && <Text style={baseStyles.subtitle}>{subtitle}</Text>}

        {infoSections.map((section, idx) => (
          <View key={idx} style={{ marginBottom: 12 }}>
            {section.title && <Text style={baseStyles.sectionTitle}>{section.title}</Text>}
            {Array.isArray(section.content) ? (
              section.content.map((line, i) => <Text key={i} style={{ marginBottom: 4 }}>{line}</Text>)
            ) : (
              <Text>{section.content}</Text>
            )}
          </View>
        ))}

        {children}

        {mainTable && (
          <View style={baseStyles.tableContainer}>
            <View style={baseStyles.tableRow}>
              {mainTable.headers.map((col, i) => (
                <Text
                  key={i}
                  style={[
                    baseStyles.tableHeaderCell,
                    { width: col.width, textAlign: col.align || 'left' },
                    { backgroundColor: mainTable.headerBackground || color, color: 'white' },
                  ]}
                >
                  {col.label}
                </Text>
              ))}
            </View>

            {mainTable.rows.map((row, rowIdx) => (
              <View style={baseStyles.tableRow} key={rowIdx}>
                {mainTable.headers.map((col, colIdx) => {
                  const value = row[col.key];
                  const rendered = col.render ? col.render(value, row) : (value ?? '—');
                  return (
                    <Text
                      key={colIdx}
                      style={[
                        baseStyles.tableCell,
                        { width: col.width, textAlign: col.align || 'left' },
                      ]}
                    >
                      {rendered}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {totals.length > 0 && (
          <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
            {totals.map((t, i) => (
              <Text key={i} style={{ fontSize: 12, fontWeight: 'bold', color, marginVertical: 4 }}>
                {t.label}: {t.value}
              </Text>
            ))}
          </View>
        )}

        {footerNotice && (
          <View style={dynamicStyles.noticeBox}>
            <Text style={dynamicStyles.noticeTitle}>Aviso</Text>
            <Text style={baseStyles.noticeText}>{footerNotice}</Text>
          </View>
        )}

        <Text style={baseStyles.footer}>
          {customFooter ||
            `Emitido em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })} — ${header.name} © ${new Date().getFullYear()}`}
        </Text>
      </Page>
    </Document>
  );
}

// ──────────────────────────────────────────────
// Ações (Download + Print) – tipo corrigido aqui
interface PDFActionsProps {
  document: React.ReactElement;  // Solução: tipo flexível
  fileName: string;
  showDownload?: boolean;
  showPrint?: boolean;
}

export function PDFActions({
  document,
  fileName,
  showDownload = true,
  showPrint = true,
}: PDFActionsProps) {
  const handlePrint = async () => {
    try {
      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      if (win) {
        win.focus();
        win.print();
      }
    } catch (err) {
      console.error('Erro ao preparar PDF:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <PDFDownloadLink document={document} fileName={fileName}>
          {({ loading }) => (
            <Button disabled={loading} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? 'A gerar...' : 'Exportar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {showPrint && (
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      )}
    </div>
  );
}

export default PDFActions;