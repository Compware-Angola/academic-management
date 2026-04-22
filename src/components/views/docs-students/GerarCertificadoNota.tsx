import { Button } from "@/components/ui/button";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";

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
type Notas = {
  codigo: number;
  disciplina: string;
  nota: number;
  horas_teoricas: number;
  horas_teorico_praticas: number;
  horas_praticas: number;
  duracao_nome: string;
  ano_lectivo_nome: string;
  semestre: number;
  classe: number;
};

type Student = {
  nome: string;
  codigoMatricula: number;
  bi: string;
  dataNascimento: string;
  curso: string;
};

type Props = {
  notas: Notas[];
  estudante: Student;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
};

const estudante = {
  codigoValidacao: "1A10F8BD",
  data: "Luanda, aos 20 de Abril de 2026",
  diretora: "Margarida da Silva Rodrigues",
};

const unidades = [
  "ZERO",
  "UM",
  "DOIS",
  "TRÊS",
  "QUATRO",
  "CINCO",
  "SEIS",
  "SETE",
  "OITO",
  "NOVE",
];

const especiais = [
  "DEZ",
  "ONZE",
  "DOZE",
  "TREZE",
  "CATORZE",
  "QUINZE",
  "DEZASSEIS",
  "DEZASSETE",
  "DEZOITO",
  "DEZANOVE",
];

const dezenas = [
  "",
  "",
  "VINTE",
  "TRINTA",
  "QUARENTA",
  "CINQUENTA",
  "SESSENTA",
  "SETENTA",
  "OITENTA",
  "NOVENTA",
];

const numeroPorExtenso = (n: number): string => {
  if (n < 10) return `${n} (${unidades[n]})`;
  if (n < 20) return `${n} (${especiais[n - 10]})`;
  if (n < 100) {
    const dez = Math.floor(n / 10);
    const uni = n % 10;

    const texto =
      uni === 0 ? dezenas[dez] : `${dezenas[dez]} E ${unidades[uni]}`;

    return `${n} (${texto})`;
  }

  return `${n} (NÃO SUPORTADO)`;
};

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
  table: {},
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

const TabelaDisciplinas = ({
  data,
}: {
  data: {
    codigo: number;
    disciplina: string;
    nota: number;
    horas_teoricas: number;
    horas_teorico_praticas: number;
    horas_praticas: number;
    duracao_nome: string;
    ano_lectivo_nome: string;
    semestre: number;
    classe: number;
  }[];
}) => (
  <View style={s.table}>
    {/* Header */}
    <View style={s.tableRowHeader}>
      <Text style={[s.th, s.colDisciplina]}>Unidade curricular</Text>
      <Text style={[s.th, s.colAno]}>Ano Lectivo</Text>
      <Text style={[s.th, s.colNota]}>Class.</Text>
      <Text style={[s.th, s.colReg]}>Reg.</Text>
      <Text style={[s.th, s.colCH]}>CH</Text>
      <Text style={[s.th, s.colAC]}>AC</Text>
    </View>

    {/* Linhas */}
    {data.map((d, i) => (
      <View style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
        <Text style={[s.td, s.colDisciplina]}>{d.disciplina}</Text>
        <Text style={[s.td, s.colAno]}>{d.ano_lectivo_nome}</Text>

        <Text style={[s.td, s.colNota, { fontFamily: "Helvetica-Bold" }]}>
          {numeroPorExtenso(d.nota)}
        </Text>

        <Text style={[s.td, s.colReg]}>{d.duracao_nome.slice(0, 1)}</Text>
        <Text style={[s.td, s.colCH]}>
          {d.horas_teoricas}T + {d.horas_teorico_praticas}TP +{" "}
          {d.horas_praticas}P
        </Text>
        <Text style={[s.td, s.colAC]}>{d.classe}</Text>
      </View>
    ))}
  </View>
);

const FooterBar = () => (
  <View style={s.footerBar} fixed>
    <Text
      render={({ pageNumber, totalPages }) =>
        `Página ${pageNumber} de ${totalPages}`
      }
    />

    <Text>
      UNIVERSIDADE METODISTA DE ANGOLA (Decreto nº 30/07 de 07/05) — Rua Nossa
      Senhora da Muxima, nº 10, 8º Andar, Luanda{"\n"}
      www.uma.co.ao | geral@uma.co.ao | Tel: (244) 222 338 984 / (244) 222 332
      905 | Fax: (244) 222 339 572
    </Text>
  </View>
);

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

const InfoEstudanteSection = ({ estudante }: { estudante: Student }) => {
  return (
    <View>
      <InfoStudent title="Nome" value={estudante.nome} />
      <InfoStudent
        title="Número"
        value={estudante.codigoMatricula.toString()}
      />
      <InfoStudent title="B.I" value={estudante.bi} />
      <InfoStudent
        title="Data de Nascimento"
        value={estudante.dataNascimento}
      />
      <InfoStudent title="Licenciatura em" value={estudante.curso} />
    </View>
  );
};

export const PDFDocumentStudent = ({
  notas,
  estudante,
  logoSrc,
  bgSrc,
  borduraSrc,
}: Props) => {
  const logo = logoSrc || "/logo_uma.png";
  const bg = bgSrc || "/logo_bg.png";
  const bordura = borduraSrc || "/bordura_africana.png";
  const nomeArquivo = `certificado_nota_${estudante.nome.replace(/\s+/g, "_")}_${new Date().getDate()}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.pdf`;
  return (
    <Document
      title={nomeArquivo}
      author="Universidade Metodista de Angola"
      subject="Transcrição do Registo Académico"
    >
      <Page size="A4" style={s.page}>
        <Header logoSrc={logo} bgSrc={bg} />
        <InfoEstudanteSection estudante={estudante} />
        <View style={{ marginVertical: 10 }} />
        <TabelaDisciplinas data={notas} />
        <View style={s.legend}>
          <Text>Reg.: S – Semestral / A – Anual</Text>
          <Text>CH: T – Teórica, TP – Teórico-Prática, P – Prática</Text>
          <Text>AC: Ano Curricular</Text>
        </View>
        <RodapeAssinatura />
        <FooterBar />
      </Page>
    </Document>
  );
};

export const PDFPreviewStudent = ({ dados }) => (
  <PDFViewer width="100%" height={1200} style={{ border: "none" }}>
    <PDFDocumentStudent {...dados} />
  </PDFViewer>
);
type GerarCertidaoProps = {
  notas: Notas[];
  estudante: Student;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  showDownload?: boolean;
  showPrint?: boolean;
};
export const GerarCertificadoNotas = (props: GerarCertidaoProps) => {
  const {
    notas,
    estudante,
    logoSrc,
    bgSrc,
    borduraSrc,
    showDownload,
    showPrint,
  } = props;
  const nomeArquivo = `certificado_nota_${estudante.nome.replace(/\s+/g, "_")}_${new Date().getDate()}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.pdf`;
  const handleDownload = async () => {
    try {
      const blob = await pdf(<PDFDocumentStudent {...props} />).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      if (win) {
        win.print();
        win.print();
      }
    } catch (error) {
      console.error("Erro ao preparar impressão:", error);
    }
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <PDFDownloadLink
          document={
            <PDFDocumentStudent
              estudante={estudante}
              notas={notas}
              logoSrc={logoSrc}
              bgSrc={bgSrc}
              borduraSrc={borduraSrc}
            />
          }
          fileName={nomeArquivo}
        >
          {({ loading }) => (
            <Button disabled={loading} onClick={handleDownload}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Certidão
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
};
