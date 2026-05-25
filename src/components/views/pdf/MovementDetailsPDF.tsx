import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrencyAOA } from "@/util/format-currency";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { defaultCashClosingHeader, UniversityHeader } from "./UniversityHeader";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontFamily: "Helvetica-Bold",
  },
});

export function MovementDetailsPDF({
  movement,
}: {
  movement: CashRegisterMovement;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <UniversityHeader header={defaultCashClosingHeader} />
        <Text style={styles.title}>
          Movimento de Caixa #{String(movement.code).padStart(3, "0")}
        </Text>

        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Status: </Text>
            {movement.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Valor de Abertura: </Text>
            {formatCurrencyAOA(movement.opening_amount)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Total Arrecadado: </Text>
            {formatCurrencyAOA(movement.total_collected_amount)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Observação: </Text>
            {movement.observation || "-"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
