import { StyleSheet } from "@react-pdf/renderer";
const COR = {
  azul: "#0D1B48",
  ouro: "#C9A84C",
  preto: "#111111",
  branco: "#FFFFFF",
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: COR.branco,
    paddingTop: 22,
    paddingBottom: 50,
    paddingHorizontal: 28,
    fontSize: 8.5,
    color: COR.preto,
  },

  watermark: {
    position: "absolute",
    top: "28%",
    left: "15%",
    width: "70%",
    height: "40%",
    opacity: 0.05,
  },

  logoWrap: {
    alignItems: "flex-end" as const,
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 90,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COR.preto,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  studentInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,

    title: {
      fontSize: 10,
      fontWeight: "bold",
    },
    value: {
      fontSize: 10,
    },
  },

  institution: {
    fontSize: 7.5,
    color: COR.azul,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  dividerGold: { height: 2, backgroundColor: COR.ouro, marginVertical: 7 },
  dividerThin: { height: 0.5, backgroundColor: "#ccc", marginVertical: 5 },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 7,
    gap: 4,
  },

  infoItem: { flexDirection: "row", width: "48%", marginBottom: 2 },
  infoItemFull: { flexDirection: "row", width: "100%", marginBottom: 2 },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
    color: COR.azul,
    width: 80,
    fontSize: 8,
  },

  infoValue: { color: "#222", fontSize: 8 },

  sectionTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: COR.branco,
    backgroundColor: COR.azul,
    padding: "3 6",
    marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    borderBottomColor: COR.preto,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  tableRow: { flexDirection: "row" },
  tableRowAlt: { flexDirection: "row", backgroundColor: "transparent" },
  th: {
    padding: "4 3",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COR.preto,
    textTransform: "none",
  },
  td: {
    padding: "3 3",
    fontSize: 8,
    borderRightWidth: 0,
    borderRightColor: "transparent",
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },

  colDisciplina: { flex: 3.8 },
  colAno: { flex: 1.4, textAlign: "center" },
  colReg: { flex: 0.6, textAlign: "center" },
  colCH: { flex: 1.4, textAlign: "center" },
  colAC: { flex: 0.6, textAlign: "center" },
  colNota: { flex: 1.8, textAlign: "center" },

  legend: {
    fontSize: 7,
    color: "#666",
    marginTop: 5,
    flexDirection: "row",
    gap: 10,
  },

  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "5 28",
    fontSize: 6.5,
    color: COR.preto,
    textAlign: "center",
  },

  validationWrap: {
    textAlign: "center" as const,
    marginTop: 10,
    marginBottom: 6,
  },
  validationLabel: { fontSize: 7.5, color: "#555" },
  validationCode: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COR.azul,
    letterSpacing: 1,
  },

  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },
  sigBlock: { alignItems: "center" as const },
  sigLine: {
    width: 150,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
    marginBottom: 3,
  },
  sigName: { fontFamily: "Helvetica-Bold", color: COR.azul, fontSize: 8 },
  sigRole: { color: "#666", fontSize: 7, fontFamily: "Helvetica-Oblique" },

  sigRight: { alignItems: "flex-end" as const, fontSize: 7.5 },
  sigRightInst: { fontFamily: "Helvetica-Bold", color: COR.azul, marginTop: 2 },

  atestado: {
    fontSize: 7.5,
    color: "#444",
    fontFamily: "Helvetica-Oblique",
    marginTop: 8,
    lineHeight: 1.5,
  },

  pageLabel: {},
});