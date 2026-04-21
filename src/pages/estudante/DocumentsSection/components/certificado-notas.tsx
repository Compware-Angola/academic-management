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
  ouro: "#C9A84C",
  cinza: "#888888",
  cinzaClaro: "#F0F4FF",
  preto: "#111111",
  verde: "#155A1E",
  amarelo: "#5A4400",
  vermelho: "#7A1010",
  branco: "#FFFFFF",
};

// ─────────────────────────────────────────────
//  DADOS DO ESTUDANTE
// ─────────────────────────────────────────────
const estudante = {
  numero: "42093",
  nome: "Paulo Jacob Camavo",
  curso: "Engenharia Informática",
  nascimento: "2001-12-08",
  bi: "005382568LA046",
  codigoValidacao: "1A10F8BD",
  data: "Luanda, aos 20 de Abril de 2026",
  diretora: "Margarida da Silva Rodrigues",
};

// ─────────────────────────────────────────────
//  TODAS AS DISCIPLINAS (fonte: PDF original)
// ─────────────────────────────────────────────
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

const pagina2: Disciplina[] = [
  {
    nome: "Ergonomia, Higiene e Segurança",
    ano: "2021-2022",
    nota: 12,
    notaExt: "DOZE",
    ac: 2,
  },
  {
    nome: "Contabilidade e Gestão",
    ano: "2021-2022",
    nota: 16,
    notaExt: "DEZASSEIS",
    ac: 2,
  },
  {
    nome: "Arquitectura de Sistemas e Computadores I",
    ano: "2021-2022",
    nota: 14,
    notaExt: "CATORZE",
    ac: 2,
  },
  {
    nome: "Análise Matemática III",
    ano: "2021-2022",
    nota: 14,
    notaExt: "CATORZE",
    ac: 2,
  },
  {
    nome: "Métodos Computacionais",
    ano: "2022-2023",
    nota: 13,
    notaExt: "TREZE",
    ac: 2,
  },
  {
    nome: "Computação Gráfica",
    ano: "2022-2023",
    nota: 17,
    notaExt: "DEZASSETE",
    ac: 3,
  },
  {
    nome: "Sistemas Operativos II",
    ano: "2022-2023",
    nota: 13,
    notaExt: "TREZE",
    ac: 3,
  },
  {
    nome: "Projecto Informático I",
    ano: "2022-2023",
    nota: 14,
    notaExt: "CATORZE",
    ac: 3,
  },
  {
    nome: "Produção de Conteúdos Multimédia",
    ano: "2022-2023",
    nota: 14,
    notaExt: "CATORZE",
    ac: 3,
  },
  {
    nome: "Engenharia de Software",
    ano: "2022-2023",
    nota: 10,
    notaExt: "DEZ",
    ac: 3,
  },
  {
    nome: "Administração de Bases de Dados",
    ano: "2022-2023",
    nota: 13,
    notaExt: "TREZE",
    ac: 3,
  },
  {
    nome: "Redes de Computadores I",
    ano: "2022-2023",
    nota: 16,
    notaExt: "DEZASSEIS",
    ac: 3,
  },
  {
    nome: "Programação Declarativa",
    ano: "2022-2023",
    nota: 11,
    notaExt: "ONZE",
    ac: 3,
  },
  {
    nome: "Metodologias e Desenvolvimento de Software",
    ano: "2022-2023",
    nota: 11,
    notaExt: "ONZE",
    ac: 3,
  },
  {
    nome: "Estruturas de Dados e Algoritmos II",
    ano: "2022-2023",
    nota: 14,
    notaExt: "CATORZE",
    ac: 3,
  },
  {
    nome: "Linguagens Formais e Autómatos",
    ano: "2023-2024",
    nota: 11,
    notaExt: "ONZE",
    ac: 3,
  },
  {
    nome: "Tópicos Avançados de Sistemas Distribuídos",
    ano: "2023-2024",
    nota: 18,
    notaExt: "DEZOITO",
    ac: 4,
  },
  {
    nome: "Tópicos Avançados de Compilação",
    ano: "2023-2024",
    nota: 14,
    notaExt: "CATORZE",
    ac: 4,
  },
  {
    nome: "Tópicos Avançados de Base de Dados",
    ano: "2023-2024",
    nota: 14,
    notaExt: "CATORZE",
    ac: 4,
  },
  {
    nome: "Linguagens de Programação",
    ano: "2023-2024",
    nota: 18,
    notaExt: "DEZOITO",
    ac: 4,
  },
  {
    nome: "Interfaces Pessoa/Máquina",
    ano: "2023-2024",
    nota: 14,
    notaExt: "CATORZE",
    ac: 4,
  },
  {
    nome: "Sistemas Computacionais de Apoio à Decisão",
    ano: "2023-2024",
    nota: 17,
    notaExt: "DEZASSETE",
    ac: 4,
  },
  {
    nome: "Métodos Computacionais Avançados",
    ano: "2023-2024",
    nota: 10,
    notaExt: "DEZ",
    ac: 4,
  },
  {
    nome: "Inteligência Artificial",
    ano: "2023-2024",
    nota: 14,
    notaExt: "CATORZE",
    ac: 4,
  },
  {
    nome: "Compiladores",
    ano: "2023-2024",
    nota: 16,
    notaExt: "DEZASSEIS",
    ac: 4,
  },
  {
    nome: "Análise de Projectos de Investimento",
    ano: "2023-2024",
    nota: 15,
    notaExt: "QUINZE",
    ac: 4,
  },
];

const discplina = [...pagina1, ...pagina2];

const s = StyleSheet.create({
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
  table: { borderWidth: 0.5, borderColor: "#bbb" },
  tableRowHeader: { flexDirection: "row", backgroundColor: "transparent" },
  tableRow: { flexDirection: "row" },
  tableRowAlt: { flexDirection: "row", backgroundColor: "transparent" },

  th: {
    padding: "4 3",
    color: COR.preto,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderColor: "transparent",
  },
  td: {
    padding: "3 3",
    fontSize: 8,
    borderRightWidth: 0,
    borderRightColor: "transparent",
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },

  colDisciplina: { flex: 3.5 },
  colAno: { flex: 1.5 },
  colReg: { flex: 0.5, textAlign: "center" as const },
  colCH: { flex: 1.3, textAlign: "center" as const },
  colAC: { flex: 0.5, textAlign: "center" as const },
  colNota: { flex: 1.8, textAlign: "center" as const },

  // Legenda
  legend: {
    fontSize: 7,
    color: "#666",
    marginTop: 5,
    flexDirection: "row",
    gap: 10,
  },

  // Rodapé da página
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COR.azul,
    padding: "5 28",
    fontSize: 6.5,
    color: "#ccc",
    textAlign: "center",
  },

  // Validação
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

  // Assinaturas
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

  // Atestado
  atestado: {
    fontSize: 7.5,
    color: "#444",
    fontFamily: "Helvetica-Oblique",
    marginTop: 8,
    lineHeight: 1.5,
  },

  // Página label
  pageLabel: {
    position: "absolute",
    bottom: 18,
    right: 28,
    fontSize: 7,
    color: "#aaa",
  },
});

// ─────────────────────────────────────────────
//  COMPONENTE: Cabeçalho comum
// ─────────────────────────────────────────────
const Header = ({ logoSrc, bgSrc }: { logoSrc: string; bgSrc: string }) => (
  <>
    <Image style={s.watermark} src={bgSrc} />

    <View style={s.logoWrap}>
      <Image style={s.logo} src={logoSrc} />
    </View>
    <View style={s.header}>
      <Text style={s.title}>Certificado de Habilitações</Text>
      <Text style={s.subtitle}>Transcrição do Registo Académico</Text>
    </View>
  </>
);

const TabelaDisciplinas = ({ data }: { data: Disciplina[] }) => (
  <View style={s.table}>
    {/* Header */}
    <View style={s.tableRowHeader}>
      <Text style={[s.th, s.colDisciplina]}>Unidade Curricular</Text>
      <Text style={[s.th, s.colAno]}>Ano Lectivo</Text>
      <Text style={[s.th, s.colReg]}>Reg.</Text>
      <Text style={[s.th, s.colCH]}>CH</Text>
      <Text style={[s.th, s.colAC]}>AC</Text>
      <Text style={[s.th, s.colNota, { borderRightWidth: 0 }]}>
        Classificação
      </Text>
    </View>

    {/* Linhas */}
    {data.map((d, i) => (
      <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
        <Text style={[s.td, s.colDisciplina]}>{d.nome}</Text>
        <Text style={[s.td, s.colAno]}>{d.ano}</Text>
        <Text style={[s.td, s.colReg]}>S</Text>
        <Text style={[s.td, s.colCH]}>1T+1TP+1P</Text>
        <Text style={[s.td, s.colAC]}>{d.ac}</Text>
        <Text
          style={[
            s.td,
            s.colNota,
            {
              borderRightWidth: 0,

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

// ─────────────────────────────────────────────
//  COMPONENTE: Rodapé da instituição
// ─────────────────────────────────────────────
const FooterBar = () => (
  <View style={s.footerBar} fixed>
    <Text>
      UNIVERSIDADE METODISTA DE ANGOLA (Decreto nº 30/07 de 07/05) — Rua Nossa
      Senhora da Muxima, nº 10, 8º Andar, Luanda{"\n"}
      www.uma.co.ao | geral@uma.co.ao | Tel: (244) 222 338 984 / (244) 222 332
      905 | Fax: (244) 222 339 572
    </Text>
  </View>
);

// ─────────────────────────────────────────────
//  COMPONENTE: Validação + Assinatura
// ─────────────────────────────────────────────
const RodapeAssinatura = () => (
  <>
    <View style={s.dividerGold} />

    <Text style={s.atestado}>
      Atesto a conformidade desta certidão, que vai por mim assinada e timbrada
      com o selo branco da Instituição, com a ficha do cadastro académico e
      outros documentos escolares do estudante acima indicado arquivados nestes
      serviços.
    </Text>

    <View style={s.validationWrap}>
      <Text style={s.validationLabel}>Código de Validação: </Text>
      <Text style={s.validationCode}>{estudante.codigoValidacao}</Text>
    </View>

    <View style={s.sigRow}>
      <View style={s.sigBlock}>
        <View style={s.sigLine} />
        <Text style={s.sigName}>{estudante.diretora}</Text>
        <Text style={s.sigRole}>Directora dos Serviços Académicos</Text>
      </View>
      <View style={s.sigRight}>
        <Text>Serviços Académicos da</Text>
        <Text style={s.sigRightInst}>Universidade Metodista de Angola</Text>
        <Text style={{ marginTop: 3 }}>{estudante.data}</Text>
      </View>
    </View>
  </>
);

const InfoStudent = ({ value, title }: { value: string; title: string }) => {
  return (
    <View style={s.studentInfo}>
      <Text style={s.studentInfo.title}>{title}:</Text>
      <Text style={s.studentInfo.value}>{value}</Text>
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

// ─────────────────────────────────────────────
//  DOCUMENTO PRINCIPAL
// ─────────────────────────────────────────────
export default function CertificadoUMA() {
  const logoSrc = "/logo_uma.png";
  const bgSrc = "/logo_bg.png";

  return (
    <PDFViewer width="100%" height={700} style={{ border: "none" }}>
      <Document
        title="Certificado de Habilitações — Paulo Jacob Camavo"
        author="Universidade Metodista de Angola"
        subject="Transcrição do Registo Académico"
        keywords="certificado, habilitações, engenharia informática, UMA"
      >
        {/* ══════════════ PÁGINA 1 ══════════════ */}
        <Page size="A4" style={s.page}>
          <Header logoSrc={logoSrc} bgSrc={bgSrc} />

          <InfoEstudanteSection />
          <View style={{ marginVertical: 10 }} />
          <TabelaDisciplinas data={discplina} />

          <View style={s.legend}>
            <Text>Reg.: S – Semestral / A – Anual</Text>
            <Text>CH: T – Teórica, TP – Teórico-Prática, P – Prática</Text>
            <Text>AC: Ano Curricular</Text>
          </View>

          <RodapeAssinatura />

          <Text style={s.pageLabel}>Página 1 de 2</Text>
          <FooterBar />
        </Page>
      </Document>
    </PDFViewer>
  );
}
