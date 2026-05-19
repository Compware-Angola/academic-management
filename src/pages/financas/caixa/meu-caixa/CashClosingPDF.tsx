import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { formatCurrencyAOA } from "@/util/format-currency";
import { CashClosingPDFData } from "./CashClosingPDFData";

// ──────────────────────────────────────────────
// Utilitário nativo
function formatDateNative(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} às ${hh}:${min}`;
}

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
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingBottom: 72,
    paddingHorizontal: 45,
    color: "#111827",
  },

  // ─── Topo ───
  topBlock: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 52,
    marginBottom: 4,
  },
  orgName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  decree: {
    fontSize: 8,
    marginTop: 2,
    color: "#6B7280",
    textAlign: "right",
  },
  dividerLine: {
    borderBottomWidth: 2,
    borderBottomColor: "#0D1B48",
    marginBottom: 18,
  },

  // ─── Título ───
  titleBlock: {
    alignItems: "center",
    marginBottom: 22,
  },
  title: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  subTitle: {
    marginTop: 4,
    fontSize: 9.5,
    color: "#6B7280",
  },

  // ─── Info Card ───
  infoCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  infoCardHeader: {
    padding: "7 12",
  },
  infoCardHeaderText: {
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCardBody: {
    padding: "10 14",
  },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLineLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  label: {
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    fontSize: 9,
  },
  value: {
    color: "#111827",
    fontSize: 9,
  },

  // ─── Tabela ───
  tableContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    padding: "8 10",
    color: "#fff",
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "#F9FAFB",
  },
  cell: {
    padding: "8 10",
    fontSize: 9.5,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  cellRight: {
    padding: "8 10",
    fontSize: 9.5,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1.5,
    borderTopColor: "#0D1B48",
    backgroundColor: "#EEF2FF",
  },
  totalLabel: {
    padding: "9 10",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0D1B48",
  },
  totalValue: {
    padding: "9 10",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#0D1B48",
  },

  // ─── Assinatura ───
  signatureSection: {
    marginTop: 8,
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 8.5,
    color: "#6B7280",
    marginBottom: 36,
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    marginBottom: 6,
  },
  signatureRole: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#111827",
  },

  // ─── Nota ───
  docNote: {
    position: "absolute",
    bottom: 44,
    left: 45,
    right: 45,
    padding: "7 12",
    backgroundColor: "#F9FAFB",
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: "#D1D5DB",
  },
  docNoteText: {
    fontSize: 7.5,
    color: "#9CA3AF",
    textAlign: "center",
  },

  // ─── Footer ───
  footer: {
    position: "absolute",
    bottom: 20,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    paddingTop: 5,
  },
  footerText: {
    fontSize: 7.5,
    color: "#9CA3AF",
  },
});

const W = { method: "70%", total: "30%" };

// ──────────────────────────────────────────────
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
        {/* ───── LOGO + NOME ───── */}
        <View style={S.topBlock}>
          <Image style={S.logo} src={header.logoSrc} />
          <Text style={S.orgName}>{header.name}</Text>
          {header.decree && <Text style={S.decree}>{header.decree}</Text>}
        </View>

        <View style={S.dividerLine} />

        {/* ───── TÍTULO ───── */}
        <View style={S.titleBlock}>
          <Text style={[S.title, { color }]}>
            Relatório de Fechamento de Caixa
          </Text>
          <Text style={S.subTitle}>Movimento #{data.movementId}</Text>
        </View>

        {/* ───── INFO DO OPERADOR ───── */}
        <View style={S.infoCard}>
          <View style={[S.infoCardHeader, { backgroundColor: color }]}>
            <Text style={S.infoCardHeaderText}>Informações do Movimento</Text>
          </View>
          <View style={S.infoCardBody}>
            <View style={S.infoLine}>
              <Text style={S.label}>Operador</Text>
              <Text style={S.value}>{data.operator}</Text>
            </View>

            <View style={S.infoLine}>
              <Text style={S.label}>Caixa</Text>
              <Text style={S.value}>{data.cashRegisterName}</Text>
            </View>

            <View style={S.infoLine}>
              <Text style={S.label}>Data de Abertura</Text>
              <Text style={S.value}>{data.openedAt}</Text>
            </View>

            <View style={S.infoLine}>
              <Text style={S.label}>Data de Fechamento</Text>
              <Text style={S.value}>{data.closedAt}</Text>
            </View>

            <View style={S.infoLineLast}>
              <Text style={S.label}>Valor de Abertura</Text>
              <Text style={[S.value, { fontFamily: "Helvetica-Bold" }]}>
                {formatCurrencyAOA(data.openingAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* ───── TABELA ───── */}
        <View style={S.tableContainer}>
          <View style={[S.tableHeader, { backgroundColor: color }]}>
            <Text style={[S.tableHeaderCell, { width: W.method }]}>
              Forma de Pagamento
            </Text>
            <Text
              style={[
                S.tableHeaderCell,
                { width: W.total, borderRightWidth: 0, textAlign: "right" },
              ]}
            >
              Total
            </Text>
          </View>

          {data.summary.map((item, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? S.tableRow : S.tableRowAlt}
            >
              <Text style={[S.cell, { width: W.method }]}>
                {item.paymentMethod}
              </Text>
              <Text style={[S.cellRight, { width: W.total }]}>
                {formatCurrencyAOA(item.total)}
              </Text>
            </View>
          ))}

          <View style={S.totalRow}>
            <Text style={[S.totalLabel, { width: W.method }]}>TOTAL GERAL</Text>
            <Text style={[S.totalValue, { width: W.total }]}>
              {formatCurrencyAOA(data.total)}
            </Text>
          </View>
        </View>

        {/* ───── ASSINATURA DO OPERADOR ───── */}
        <View style={S.signatureSection}>
          <Text style={S.signatureLabel}>
            Declaro que os valores acima conferem com o movimento de caixa
            efectuado.
          </Text>
          <View style={S.signatureLine} />
          <Text style={S.signatureRole}>Assinatura do Operador</Text>
          <Text style={S.signatureName}>{data.operator}</Text>
        </View>

        {/* ───── NOTA ───── */}
        <View style={S.docNote}>
          <Text style={S.docNoteText}>
            Documento gerado automaticamente pelo sistema · Pendente de
            validação administrativa
          </Text>
        </View>

        {/* ───── FOOTER ───── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Movimento #{data.movementId}</Text>
          <Text style={S.footerText}>
            Emitido em {formatDateNative(new Date())}
          </Text>
          <Text style={S.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
}
