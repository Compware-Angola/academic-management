import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrencyAOA } from "@/util/format-currency";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { UniversityHeader } from "./UniversityHeader";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },

  titleBlock: {
    marginTop: 10,
    marginBottom: 18,
    textAlign: "center",
  },

  title: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  subtitle: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 4,
  },

  // ───── CARD ─────
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 14,
    overflow: "hidden",
  },

  cardHeader: {
    backgroundColor: "#0D1B48",
    padding: "8 12",
  },

  cardHeaderText: {
    color: "#fff",
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  cardBody: {
    padding: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  label: {
    color: "#6B7280",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  value: {
    fontSize: 9,
    color: "#111827",
    textAlign: "right",
    maxWidth: "60%",
  },

  highlightValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0D1B48",
  },

  badge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    padding: "2 6",
    borderRadius: 4,
    color: "#fff",
  },
});

// ──────────────────────────────────────────────

export function MovementDetailsPDF({
  movement,
}: {
  movement: CashRegisterMovement;
}) {
  const statusColor =
    movement.status === "aberto"
      ? "#16A34A"
      : movement.status === "fechado"
        ? "#6B7280"
        : "#DC2626";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER UNIVERSIDADE */}
        <UniversityHeader />

        {/* TÍTULO */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            Movimento de Caixa #{String(movement.code).padStart(3, "0")}
          </Text>

          <Text style={styles.subtitle}>
            Relatório detalhado de movimentação financeira
          </Text>
        </View>

        {/* ───── CARD: INFORMAÇÕES GERAIS ───── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Informações Gerais</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.badge, { backgroundColor: statusColor }]}>
                {movement.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Código</Text>
              <Text style={styles.value}>
                #{String(movement.code).padStart(3, "0")}
              </Text>
            </View>

            <View style={styles.rowLast}>
              <Text style={styles.label}>Observação</Text>
              <Text style={styles.value}>{movement.observation || "-"}</Text>
            </View>
          </View>
        </View>

        {/* ───── CARD: VALORES ───── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Movimentação Financeira</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Valor de Abertura</Text>
              <Text style={styles.highlightValue}>
                {formatCurrencyAOA(movement.opening_amount)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Arrecadado</Text>
              <Text style={styles.highlightValue}>
                {formatCurrencyAOA(movement.total_collected_amount)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Depósitos</Text>
              <Text style={styles.value}>
                {formatCurrencyAOA(movement.collected_deposit_amount)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>TPA</Text>
              <Text style={styles.value}>
                {formatCurrencyAOA(movement.collected_tpa_amount)}
              </Text>
            </View>

            <View style={styles.rowLast}>
              <Text style={styles.label}>Facturado</Text>
              <Text style={styles.value}>
                {formatCurrencyAOA(movement.invoiced_payment_amount)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
