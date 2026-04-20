// CertidaoUMA.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

// ─────────────────────────────────────
// DADOS
// ─────────────────────────────────────
const DADOS = {
  nome: "Paulo Jacob Camavo",
  filho_de: "Francisco Camavo Alfredo",
  mae: "Jandira Aulária António",
  bi: "005382568LA046",
  num_estudante: "42093",
  ano_curso: "5º",
  curso: "Engenharia Informática",
  grau: "Licenciatura",
  turno: "Diurno",
  ano_lectivo: "2024-2025",
  data_emissao: "20 de Abril de 2026",
  cod_validacao: "23456FGGEF",
  directora: "Margarida da Silva Rodrigues",
  cargo_directora: "Directora dos Serviços Académicos",
};

// ─────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D1B48",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#555",
    marginBottom: 20,
  },
  certidao: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  paragraph: {
    textAlign: "justify",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  center: {
    textAlign: "center",
    marginTop: 10,
  },
  signature: {
    marginTop: 40,
    textAlign: "center",
  },
  line: {
    borderBottom: "1px solid black",
    width: 200,
    margin: "10px auto",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#555",
  },
});

// ─────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────
type CertidaoProps = {
  nome: string;
  filho_de: string;
  mae: string;
  bi: string;
  num_estudante: string;
  ano_curso: string;
  curso: string;
  grau: string;
  turno: string;
  ano_lectivo: string;
  data_emissao: string;
  cod_validacao: string;
  directora: string;
  cargo_directora: string;
};
export const CertidaoUMA = (props: CertidaoProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <Text style={styles.title}>
          UNIVERSIDADE METODISTA DE ANGOLA
        </Text>

        <Text style={styles.subtitle}>
          (Aprovada pelo Decreto nº 30/07 de 07/05)
        </Text>

        <Text style={styles.certidao}>CERTIDÃO</Text>

        <Text style={styles.paragraph}>
          Para os devidos efeitos, a Universidade Metodista de Angola certifica que o Senhor{" "}
          <Text style={{ fontWeight: "bold" }}>{props.nome}</Text>, filho de{" "}
          {props.filho_de} e de {props.mae}, titular do Bilhete de Identidade nº{" "}
          <Text style={{ fontWeight: "bold" }}>{props.bi}</Text>, matriculado nesta
          Instituição sob o número de estudante{" "}
          <Text style={{ fontWeight: "bold" }}>{props.num_estudante}</Text>,
          frequentou o {props.ano_curso} ano de{" "}
          <Text style={{ fontWeight: "bold" }}>{props.grau}</Text> em{" "}
          <Text style={{ fontWeight: "bold" }}>{props.curso}</Text>, turno{" "}
          <Text style={{ fontWeight: "bold" }}>{props.turno}</Text>, no ano lectivo{" "}
          {props.ano_lectivo}.
        </Text>

        <Text style={styles.center}>
          Código de Validação: {props.cod_validacao}
        </Text>

        <Text style={styles.center}>
          Universidade Metodista de Angola em Luanda, aos {props.data_emissao}
        </Text>

        <View style={styles.signature}>
          <Text>{props.cargo_directora}</Text>
          <View style={styles.line} />
          <Text>{props.directora}</Text>
        </View>

      </Page>
    </Document>
  );
};