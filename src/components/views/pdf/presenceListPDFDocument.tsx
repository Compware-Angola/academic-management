import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import React, { ReactElement } from "react";

// ──────────────────────────────────────────────
// Tipos (mantidos iguais)
export interface EntityHeader {
  logoSrc: string;
  name: string;
  details: string[];
  primaryColor?: string;
}

export const defaultHeader: EntityHeader = {
  logoSrc: "/logo_uma.png",
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
  width: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableData {
  headers: TableColumn[];
  rows: Record<string, any>[];
  headerBackground?: string;
}

// ──────────────────────────────────────────────
// Estilos base otimizados para Portátil / Retrato
const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5, // Diminuído o padrão para dar mais espaço
    padding: 24, // Margens laterais e verticais reduzidas de 40 para 24
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    paddingBottom: 8,
    marginBottom: 14,
  },
  logo: { width: 100, height: 50 }, // Logotipo levemente menor
  entityInfo: { textAlign: "right" },
  entityName: { fontSize: 13, fontWeight: "bold" },
  entityDetail: { fontSize: 8, color: "#444", marginTop: 1 },
  title: {
    textAlign: "center",
    fontSize: 15, // Mais compacto
    fontWeight: "bold",
    marginVertical: 8,
    textTransform: "uppercase" as const,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#555",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },
  tableRow: { flexDirection: "row" },
  tableHeaderCell: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9.5,
    fontWeight: "bold",
  },
  tableCell: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4.5, // Células mais compactas verticalmente
    fontSize: 9, // Fonte otimizada para modo retrato
  },
  noticeBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    textAlign: "center" as const,
  },
  noticeTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  noticeText: { fontSize: 9, color: "#444" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    fontSize: 8,
    textAlign: "center" as const,
    color: "#777",
  },
});

interface PresenceRow {
  numero: number;
  matricula: number;
  nome: string;
}

// ──────────────────────────────────────────────
// Props do documento
interface GenericPDFProps {
  anoLetivo: string;
  semestre: string;
  periodo: string;
  curso: string;
  unidadeCurricular: string;
  total: number;
  rows: PresenceRow[];
  horario: string;
  classes: string;
}

// ──────────────────────────────────────────────
// Componente PDF
export function PresenceListPDFDocument(props: GenericPDFProps) {
  const {
    anoLetivo,
    semestre,
    periodo,
    curso,
    unidadeCurricular,
    total,
    rows,
    horario,
    classes,
  } = props;
  const documentTitle = "Lista de Presença";
  const subtitle = "Universidade Metodista de Angola - Registo de Avaliação";

  const infoSections = [
    {
      content: [
        `Ano Lectivo: ${anoLetivo}`,
        `Curso: ${curso}`,
        `Ano Curricular: ${classes}`,
        `Semestre: ${semestre}`,
        `Período: ${periodo}`,
        `Horário: ${horario}`,
        `Unidade Curricular: ${unidadeCurricular}`,
        `Total de estudantes: ${total}`,
      ].filter(Boolean),
    },
  ];

  // Configuração ideal das colunas em modo Retrato (Total: 100%)
  const mainTable = {
    headerBackground: "#0D1B48",
    headers: [
      { key: "numero", label: "Nº", width: "4%", align: "center" as const },
      {
        key: "matricula",
        label: "Nº Matrícula",
        width: "13%",
        align: "left" as const,
      },
      {
        key: "nome",
        label: "Nome Completo",
        width: "38%",
        align: "left" as const,
      },
      {
        key: "assinatura",
        label: "Assinatura",
        width: "37%",
        align: "left" as const,
      }, // Bastante espaço reservado para assinar à mão
      { key: "nota", label: "Nota", width: "8%", align: "center" as const },
    ],
    rows,
  };
  const color = "#0D1B48";

  const dynamicStyles = {
    ...baseStyles,
    header: { ...baseStyles.header, borderColor: color },
    title: { ...baseStyles.title, color },
    noticeBox: { ...baseStyles.noticeBox, borderColor: color },
    noticeTitle: { ...baseStyles.noticeTitle, color },
  };

  return (
    <Document>
      <Page size="A4" style={dynamicStyles.page} orientation="portrait">
        {/* CABEÇALHO */}
        <View style={dynamicStyles.header}>
          <Image style={baseStyles.logo} src={defaultHeader.logoSrc} />
          <View style={baseStyles.entityInfo}>
            <Text style={{ ...baseStyles.entityName, color }}>
              {defaultHeader.name}
            </Text>
            {defaultHeader.details.map((line, i) => (
              <Text key={i} style={baseStyles.entityDetail}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <Text style={dynamicStyles.title}>{documentTitle}</Text>
        {subtitle && <Text style={baseStyles.subtitle}>{subtitle}</Text>}

        {/* INFORMAÇÕES GERAIS */}
        {infoSections.map((section, idx) => (
          <View key={idx} style={{ marginBottom: 10, fontSize: 9 }}>
            {Array.isArray(section.content) ? (
              section.content.map((line, i) => (
                <View
                  key={i}
                  style={{ marginBottom: 3, flexDirection: "row", gap: 4 }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {line.split(":")[0]}:
                  </Text>
                  <Text>{line.split(":")[1]}</Text>
                </View>
              ))
            ) : (
              <Text>{section.content}</Text>
            )}
          </View>
        ))}

        {/* HEADER DA TABELA */}
        <View style={baseStyles.tableRow}>
          {mainTable.headers.map((col, i) => (
            <Text
              key={i}
              style={[
                baseStyles.tableHeaderCell,
                {
                  width: col.width,
                  textAlign: col.align || "left",
                  backgroundColor: mainTable.headerBackground || color,
                  color: "white",
                },
              ]}
            >
              {col.label}
            </Text>
          ))}
        </View>

        {/* LINHAS DA TABELA */}
        {mainTable.rows.map((row, rowIdx) => (
          <View style={baseStyles.tableRow} key={rowIdx}>
            {mainTable.headers.map((col, colIdx) => {
              let value = row[col.key];

              if (col.key === "assinatura" || col.key === "nota") {
                value = "";
              } else if (value === undefined || value === null || value === "") {
                value = "—";
              }

              return (
                <Text
                  key={colIdx}
                  style={[
                    baseStyles.tableCell,
                    {
                      width: col.width,
                      textAlign: col.align || "left",
                    },
                  ]}
                >
                  {String(value)}
                </Text>
              );
            })}
          </View>
        ))}

        {/* ==================== ESPAÇO PARA ASSINATURAS ==================== */}
        <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center", width: "45%" }}>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>______________________________</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>Docente</Text>

          </View>

          <View style={{ alignItems: "center", width: "45%" }}>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>______________________________</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>Diretor do Curso</Text>

          </View>
        </View>



        {/* RODAPÉ */}
        <Text style={baseStyles.footer}>
          {`Emitido em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })} — ${defaultHeader.name} © ${new Date().getFullYear()}`}
        </Text>
      </Page>
    </Document>
  );
}

// ──────────────────────────────────────────────
// Ações (Download + Print)
interface PDFActionsProps {
  document: React.ReactElement;
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
      console.error("Erro ao preparar PDF:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <PDFDownloadLink document={document} fileName={fileName}>
          {({ loading }) => (
            <Button disabled={loading} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? "A gerar..." : "Exportar PDF"}
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
