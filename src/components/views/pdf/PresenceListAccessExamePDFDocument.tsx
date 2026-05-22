import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  pdf,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import React from "react";

// ──────────────────────────────────────────────
// Tipos e Configurações de Cabeçalho
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

// Estilos Base Otimizados para Retrato
const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 24,
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
  logo: { width: 100, height: 50 },
  entityInfo: { textAlign: "right" },
  entityName: { fontSize: 13, fontWeight: "bold" },
  entityDetail: { fontSize: 8, color: "#444", marginTop: 1 },
  title: {
    textAlign: "center",
    fontSize: 14,
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
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableCell: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 8.5,
  },
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

export interface AccessExamCandidateRow {
  numero: number;
  numeroInscricao: number;
  nome: string;
}

interface AccessExamPDFProps {
  anoLetivo?: string;
  curso?: string;
  sala?: string;
  dataRealizacao?: string;
  horaInicio?: string;
  total: number;
  rows: AccessExamCandidateRow[];
}

// Componente do Documento PDF
export function PresenceListAccessExamePDFDocument(props: AccessExamPDFProps) {
  const { anoLetivo, curso, sala, dataRealizacao, horaInicio, total, rows } =
    props;

  const documentTitle = "Lista de Presença — Exame de Acesso";
  const subtitle = "Universidade Metodista de Angola — Registo de Frequência";

  // Gerar linhas informativas condicionalmente
  const infoLines = [
    anoLetivo ? `Ano Lectivo: ${anoLetivo}` : null,
    curso ? `Curso: ${curso}` : null,
    sala ? `Sala: ${sala}` : null,
    dataRealizacao ? `Data da Prova: ${dataRealizacao}` : null,
    horaInicio ? `Hora de Início: ${horaInicio}` : null,
    total !== undefined ? `Total de Candidatos: ${total}` : null,
  ].filter(Boolean) as string[];

  // Configuração das colunas exatas (Soma exata = 100%)
  const headers = [
    { key: "numero", label: "Nº", width: "6%", align: "center" as const },
    {
      key: "numeroInscricao",
      label: "Nº Inscrição",
      width: "14%",
      align: "left" as const,
    },
    {
      key: "nome",
      label: "Nome Completo",
      width: "45%",
      align: "left" as const,
    },
    {
      key: "assinatura",
      label: "Assinatura",
      width: "27%",
      align: "left" as const,
    },
    { key: "nota", label: "Nota", width: "8%", align: "center" as const },
  ];

  const color = "#0D1B48";

  return (
    <Document>
      <Page size="A4" style={baseStyles.page} orientation="portrait">
        {/* Cabeçalho */}
        <View style={[baseStyles.header, { borderColor: color }]}>
          <Image style={baseStyles.logo} src={defaultHeader.logoSrc} />
          <View style={baseStyles.entityInfo}>
            <Text style={[baseStyles.entityName, { color }]}>
              {defaultHeader.name}
            </Text>
            {defaultHeader.details.map((line, i) => (
              <Text key={i} style={baseStyles.entityDetail}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <Text style={[baseStyles.title, { color }]}>{documentTitle}</Text>
        {subtitle && <Text style={baseStyles.subtitle}>{subtitle}</Text>}

        {/* Informações Gerais */}
        {infoLines.length > 0 && (
          <View style={{ marginBottom: 12, fontSize: 9 }}>
            {infoLines.map((line, i) => (
              <View key={i} style={{ marginBottom: 3, flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold" }}>
                  {line.split(":")[0]}:
                </Text>
                <Text>{line.split(":")[1]}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tabela - Cabeçalho */}
        <View
          style={[
            baseStyles.tableRow,
            { borderLeftWidth: 1, borderTopWidth: 1, borderColor: "#ccc" },
          ]}
        >
          {headers.map((col, i) => (
            <Text
              key={i}
              style={[
                baseStyles.tableHeaderCell,
                {
                  width: col.width,
                  textAlign: col.align || "left",
                  backgroundColor: color,
                  color: "white",
                  borderColor: "#ccc",
                },
              ]}
            >
              {col.label}
            </Text>
          ))}
        </View>

        {/* Tabela - Linhas */}
        {rows.map((row, rowIdx) => (
          <View
            style={[
              baseStyles.tableRow,
              { borderLeftWidth: 1, borderColor: "#ccc" },
            ]}
            key={rowIdx}
          >
            {headers.map((col, colIdx) => {
              let value = row[col.key as keyof AccessExamCandidateRow];

              if (col.key === "assinatura" || col.key === "nota") {
                value = "";
              } else if (
                value === undefined ||
                value === null ||
                value === ""
              ) {
                value = "";
              }

              return (
                <Text
                  key={colIdx}
                  style={[
                    baseStyles.tableCell,
                    {
                      width: col.width,
                      textAlign: col.align || "left",
                      borderColor: "#ccc",
                    },
                  ]}
                >
                  {String(value)}
                </Text>
              );
            })}
          </View>
        ))}

        {/* Rodapé institucional */}
        <Text style={baseStyles.footer}>
          {`Emitido em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })} — ${defaultHeader.name} © ${new Date().getFullYear()}`}
        </Text>
      </Page>
    </Document>
  );
}

// ──────────────────────────────────────────────
// Componente de Ações do PDF
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
      console.error("Erro ao preparar a impressão do PDF:", err);
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
