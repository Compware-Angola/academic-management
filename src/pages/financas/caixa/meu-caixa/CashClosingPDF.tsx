import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { format } from "date-fns";
import { pt } from "date-fns/locale";

import { formatCurrencyAOA } from "@/util/format-currency";

import { CashClosingPDFData } from "./CashClosingPDFData";

// ──────────────────────────────────────────────
// Header
export interface CashClosingHeader {
  logoSrc: string;
  name: string;
  decree?: string;
  address: string;
  addressLine2?: string;
  phone: string;
  nif: string;
  primaryColor?: string;
}

export const defaultCashClosingHeader: CashClosingHeader = {
  logoSrc: "/logo_uma.png",
  name: "UNIVERSIDADE METODISTA DE ANGOLA",
  decree: "(Aprovado pelo Decreto nº 30/07 de 07/05)",
  address: "Rua Nossa Senhora da Muxima",
  addressLine2: "Nº10, C.P.-6739-Luanda",
  phone: "947716113",
  nif: "5401150865",
  primaryColor: "#0D1B48",
};

// ──────────────────────────────────────────────
// Styles
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingBottom: 60,
    paddingHorizontal: 45,
    color: "#111827",
  },
  topBlock: {
    alignItems: "flex-end",
    marginBottom: 14,
  },
  logo: {
    width: 90,
    height: 52,
    marginBottom: 4,
  },

  // ─────────────────────────────
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    paddingBottom: 14,
    marginBottom: 24,
  },

  headerRight: {
    alignItems: "flex-end",
    maxWidth: 320,
  },

  orgName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  decree: {
    fontSize: 8.5,
    marginTop: 2,
    color: "#4B5563",
    textAlign: "right",
  },

  orgLine: {
    fontSize: 8.5,
    marginTop: 2,
    color: "#374151",
    textAlign: "right",
  },

  // ─────────────────────────────
  // Title
  titleBlock: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  subTitle: {
    marginTop: 5,
    fontSize: 10,
    color: "#4B5563",
  },

  // ─────────────────────────────
  // Info card
  infoCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 24,
  },

  infoHeader: {
    padding: 8,
    backgroundColor: "#0D1B48",
  },

  infoHeaderText: {
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },

  infoBody: {
    padding: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  value: {
    color: "#374151",
  },

  // ─────────────────────────────
  // Table
  tableContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0D1B48",
  },

  tableHeaderCell: {
    padding: 8,
    color: "#fff",
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderRightColor: "#1E3A8A",
  },

  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },

  cell: {
    padding: 8,
    fontSize: 9.5,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },

  cellRight: {
    padding: 8,
    fontSize: 9.5,
    textAlign: "right",
  },

  totalRow: {
    flexDirection: "row",
    backgroundColor: "#E0E7FF",
    borderTopWidth: 1.5,
    borderTopColor: "#0D1B48",
  },

  totalLabel: {
    padding: 9,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0D1B48",
  },

  totalValue: {
    padding: 9,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#0D1B48",
  },

  // ─────────────────────────────
  // Signature
  signatureSection: {
    marginTop: 28,
    alignItems: "center",
  },

  signatureText: {
    marginBottom: 40,
    fontSize: 10,
  },

  signatureLine: {
    width: 180,
    borderTopWidth: 1,
    borderTopColor: "#111827",
    marginBottom: 4,
  },

  signatureName: {
    fontSize: 10,
    textAlign: "center",
  },

  // ─────────────────────────────
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#D1D5DB",
    paddingTop: 6,
  },

  footerText: {
    fontSize: 8,
    color: "#6B7280",
  },
});

// ──────────────────────────────────────────────
// Widths
const W = {
  method: "70%",
  total: "30%",
};

// ──────────────────────────────────────────────
// PDF
export function CashClosingPDF({
  header = defaultCashClosingHeader,
  data,
}: {
  header?: CashClosingHeader;
  data: CashClosingPDFData;
}) {
  const color = header.primaryColor || "#0D1B48";

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ───────────────── HEADER ───────────────── */}
        {/* ── TOPO: logo à direita ── */}
        <View style={S.topBlock}>
          <Image style={S.logo} src={header.logoSrc} />
          <Text style={S.orgName}>{header.name}</Text>
          {header.decree && <Text style={S.decree}>{header.decree}</Text>}
        </View>

        {/* ───────────────── TITLE ───────────────── */}
        <View style={S.titleBlock}>
          <Text
            style={{
              ...S.title,
              color,
            }}
          >
            Relatório de Fechamento de Caixa
          </Text>

          <Text style={S.subTitle}>Movimento #{data.movementId}</Text>
        </View>

        {/* ───────────────── INFO ───────────────── */}
        <View style={S.infoCard}>
          <View
            style={{
              ...S.infoHeader,
              backgroundColor: color,
            }}
          >
            <Text style={S.infoHeaderText}>Informações do Caixa</Text>
          </View>

          <View style={S.infoBody}>
            <View style={S.row}>
              <Text style={S.label}>Caixa</Text>
              <Text style={S.value}>{data.cashRegisterName}</Text>
            </View>

            <View style={S.row}>
              <Text style={S.label}>Operador</Text>
              <Text style={S.value}>{data.operator}</Text>
            </View>

            <View style={S.row}>
              <Text style={S.label}>Abertura</Text>
              <Text style={S.value}>{data.openedAt}</Text>
            </View>

            <View style={S.row}>
              <Text style={S.label}>Fechamento</Text>
              <Text style={S.value}>{data.closedAt}</Text>
            </View>

            <View style={S.row}>
              <Text style={S.label}>Valor abertura</Text>
              <Text style={S.value}>
                {formatCurrencyAOA(data.openingAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* ───────────────── TABLE ───────────────── */}
        <View style={S.tableContainer}>
          <View style={S.tableHeader}>
            <Text style={[S.tableHeaderCell, { width: W.method }]}>
              Forma de pagamento
            </Text>

            <Text
              style={[
                S.tableHeaderCell,
                {
                  width: W.total,
                  borderRightWidth: 0,
                  textAlign: "right",
                },
              ]}
            >
              Total
            </Text>
          </View>

          {data.summary.map((item, index) => {
            const rowStyle = index % 2 === 0 ? S.tableRow : S.tableRowAlt;

            return (
              <View key={index} style={rowStyle}>
                <Text
                  style={[
                    S.cell,
                    {
                      width: W.method,
                    },
                  ]}
                >
                  {item.paymentMethod}
                </Text>

                <Text
                  style={[
                    S.cellRight,
                    {
                      width: W.total,
                    },
                  ]}
                >
                  {formatCurrencyAOA(item.total)}
                </Text>
              </View>
            );
          })}

          <View style={S.totalRow}>
            <Text
              style={[
                S.totalLabel,
                {
                  width: W.method,
                },
              ]}
            >
              TOTAL GERAL
            </Text>

            <Text
              style={[
                S.totalValue,
                {
                  width: W.total,
                },
              ]}
            >
              {formatCurrencyAOA(data.total)}
            </Text>
          </View>
        </View>

        {/* ───────────────── SIGNATURE ───────────────── */}
        <View style={S.signatureSection}>
          <Text style={S.signatureText}>
            Documento emitido automaticamente pelo sistema
          </Text>

          <View style={S.signatureLine} />

          <Text style={S.signatureName}>{data.operator}</Text>
        </View>

        {/* ───────────────── FOOTER ───────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Movimento #{data.movementId}</Text>

          <Text style={S.footerText}>
            Emitido em{" "}
            {format(new Date(), "dd/MM/yyyy 'às' HH:mm", {
              locale: pt,
            })}
          </Text>

          <Text style={S.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
}
