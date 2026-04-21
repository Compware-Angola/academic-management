import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

const COR = {
  azul: "#0D1B48",
  cinzaClaro: "#888888",
  preto: "#111111",
};

type Disciplina = {
  nome: string;
  ano: string;
  nota: number;
  notaExt: string;
  ac: number;
};

const pagina1: Disciplina[] = [
  {
    nome: "Análise Matemática I",
    ano: "2020-2021",
    nota: 15,
    notaExt: "QUINZE",
    ac: 1,
  },
  {
    nome: "Álgebra Linear e Geometria Analítica",
    ano: "2020-2021",
    nota: 14,
    notaExt: "CATORZE",
    ac: 1,
  },
  {
    nome: "Sistemas Digitais",
    ano: "2020-2021",
    nota: 14,
    notaExt: "CATORZE",
    ac: 1,
  },
  {
    nome: "Programação I",
    ano: "2020-2021",
    nota: 13,
    notaExt: "TREZE",
    ac: 1,
  },
  {
    nome: "Probabilidades e Estatística",
    ano: "2020-2021",
    nota: 15,
    notaExt: "QUINZE",
    ac: 1,
  },
  { nome: "Inglês Técnico", ano: "2020-2021", nota: 10, notaExt: "DEZ", ac: 1 },
  { nome: "Física II", ano: "2020-2021", nota: 10, notaExt: "DEZ", ac: 1 },
  {
    nome: "Análise Matemática II",
    ano: "2020-2021",
    nota: 12,
    notaExt: "DOZE",
    ac: 1,
  },
  {
    nome: "Sistemas Informáticos",
    ano: "2020-2021",
    nota: 12,
    notaExt: "DOZE",
    ac: 1,
  },
  {
    nome: "Química Geral",
    ano: "2020-2021",
    nota: 15,
    notaExt: "QUINZE",
    ac: 1,
  },
  {
    nome: "Metodismo e Doutrina Social",
    ano: "2020-2021",
    nota: 16,
    notaExt: "DEZASSEIS",
    ac: 1,
  },
  { nome: "Física I", ano: "2020-2021", nota: 13, notaExt: "TREZE", ac: 1 },
  {
    nome: "Bases de Dados",
    ano: "2021-2022",
    nota: 15,
    notaExt: "QUINZE",
    ac: 2,
  },
  {
    nome: "Sistemas Operativos I",
    ano: "2021-2022",
    nota: 13,
    notaExt: "TREZE",
    ac: 2,
  },
  {
    nome: "Lógica Computacional",
    ano: "2021-2022",
    nota: 10,
    notaExt: "DEZ",
    ac: 2,
  },
  {
    nome: "Estruturas de Dados e Algoritmos I",
    ano: "2021-2022",
    nota: 13,
    notaExt: "TREZE",
    ac: 2,
  },
  {
    nome: "Arquitectura de Sistemas e Computadores II",
    ano: "2021-2022",
    nota: 13,
    notaExt: "TREZE",
    ac: 2,
  },
  {
    nome: "Programação II",
    ano: "2021-2022",
    nota: 18,
    notaExt: "DEZOITO",
    ac: 2,
  },
];

// 🎨 Estilos
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontSize: 10,
  },
  bgWatermark: {
    position: "absolute",
    top: "25%",
    left: "20%",
    width: "60%",
    height: "45%",
    opacity: 0.1,
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
  table: { borderWidth: 0.5, borderColor: "transparent" },
  tableRowHeader: { flexDirection: "row", backgroundColor: "#fff" },
  tableRow: { flexDirection: "row" },
  tableRowAlt: { flexDirection: "row", backgroundColor: COR.cinzaClaro },

  th: {
    padding: "4 3",
    color: COR.preto,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    borderRightWidth: 0.5,
    borderRightColor: "#bbb",
  },
  td: {
    padding: "3 3",
    fontSize: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#ddd",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },

  colDisciplina: { flex: 3.5 },
  colAno: { flex: 1.5 },
  colReg: { flex: 0.5, textAlign: "center" as const },
  colCH: { flex: 1.3, textAlign: "center" as const },
  colAC: { flex: 0.5, textAlign: "center" as const },
  colNota: { flex: 1.8, textAlign: "center" as const },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 9,
  },
});

// 📊 Dados mockados (inspirado no teu PDF)
const estudante = {
  numero: "42093",
  nome: "Paulo Jacob Camavo",
  curso: "Engenharia Informática",
  nascimento: "2001-12-08",
  bi: "005382568LA046",
};

const disciplinas = [
  { nome: "Programação I", ano: "2020-2021", nota: 13 },
  { nome: "Álgebra Linear", ano: "2020-2021", nota: 14 },
  { nome: "Bases de Dados", ano: "2021-2022", nota: 15 },
  { nome: "Sistemas Operativos", ano: "2021-2022", nota: 13 },
  { nome: "Engenharia de Software", ano: "2022-2023", nota: 10 },
  { nome: "Inteligência Artificial", ano: "2023-2024", nota: 14 },
];

export default function PDF() {
  const logoDefault = "/logo_uma.png";
  const bgDefault = "/logo_bg.png";
  const borduraDefault = "/bordura_africana.png";
  return (
    <PDFViewer width="100%" height="600">
      <Document>
        <Page size="A4" style={styles.page}>
          <Image style={styles.bgWatermark} src={bgDefault} />
          <View style={styles.logoWrap}>
            <Image style={styles.logo} src={logoDefault} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Certificado de Habilitações</Text>
            <Text style={styles.subtitle}>
              Transcrição do Registo Académico
            </Text>
          </View>
          <InfoEstudanteSection />
          <TabelaDisciplinas data={pagina1} />

          <View style={styles.footer}>
            <Text>Universidade - Documento gerado automaticamente</Text>
            <Text>Luanda, 2026</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

const InfoStudent = ({ value, title }: { value: string; title: string }) => {
  return (
    <View style={styles.studentInfo}>
      <Text style={styles.studentInfo.title}>{title}:</Text>
      <Text style={styles.studentInfo.value}>{value}</Text>
    </View>
  );
};

const InfoEstudanteSection = () => {
  return (
    <View>
      <InfoStudent title="Nome" value="Paulo Jacob Camavo" />
      <InfoStudent title="Número" value="42093" />
      <InfoStudent title="B.I" value="005382568LA046" />
      <InfoStudent title="Data de Nascimento" value="2001-12-08" />
      <InfoStudent title="Licenciatura em" value="Engenharia Informática" />
    </View>
  );
};

const TabelaDisciplinas = ({ data }: { data: Disciplina[] }) => (
  <View style={styles.table}>
    {/* Header */}
    <View style={styles.tableRowHeader}>
      <Text style={[styles.th, styles.colDisciplina]}>Unidade Curricular</Text>
      <Text style={[styles.th, styles.colAno]}>Ano Lectivo</Text>
      <Text style={[styles.th, styles.colReg]}>Reg.</Text>
      <Text style={[styles.th, styles.colCH]}>CH</Text>
      <Text style={[styles.th, styles.colAC]}>AC</Text>
      <Text style={[styles.th, styles.colNota, { borderRightWidth: 0 }]}>
        Classificação
      </Text>
    </View>

    {/* Linhas */}
    {data.map((d, i) => (
      <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
        <Text style={[styles.td, styles.colDisciplina]}>{d.nome}</Text>
        <Text style={[styles.td, styles.colAno]}>{d.ano}</Text>
        <Text style={[styles.td, styles.colReg]}>S</Text>
        <Text style={[styles.td, styles.colCH]}>1T+1TP+1P</Text>
        <Text style={[styles.td, styles.colAC]}>{d.ac}</Text>
        <Text
          style={[
            styles.td,
            styles.colNota,
            {
              borderRightWidth: 0,
              color: d.nota < 10 ? "#ff0000" : "#000000",
              fontFamily: "Helvetica-Bold",
            },
          ]}
        >
          {d.nota} ({d.notaExt})
        </Text>
      </View>
    ))}
  </View>
);
