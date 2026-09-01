import { numeroPorExtenso } from "@/util/numeroPorExtenso";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { PDFDocumentStudentProps, Student } from "./types";

const Header = ({ logoSrc, bgSrc }: { logoSrc: string; bgSrc: string }) => (
  <>
    <Image style={styles.watermark} src={bgSrc} fixed />

    <View style={styles.logoWrap}>
      <Image style={styles.logo} src={logoSrc} />
    </View>
    <View style={styles.header}>
      <Text style={styles.title}>Certificado de Habilitações</Text>
      <Text style={styles.subtitle}>Transcrição do Registo Académico</Text>
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
  <View style={styles.table}>
    {/* Header */}
    <View style={styles.tableRowHeader}>
      <Text style={[styles.th, styles.colDisciplina]}>Unidade curricular</Text>
      <Text style={[styles.th, styles.colAno]}>Ano Lectivo</Text>
      <Text style={[styles.th, styles.colNota]}>Class.</Text>
      <Text style={[styles.th, styles.colReg]}>Reg.</Text>
      <Text style={[styles.th, styles.colCH]}>CH</Text>
      <Text style={[styles.th, styles.colAC]}>AC</Text>
    </View>

    {/* Linhas */}
    {data.map((d, i) => (
      <View style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
        <Text style={[styles.td, styles.colDisciplina]}>{d.disciplina}</Text>
        <Text style={[styles.td, styles.colAno]}>{d.ano_lectivo_nome}</Text>

        <Text
          style={[styles.td, styles.colNota, { fontFamily: "Helvetica-Bold" }]}
        >
          {numeroPorExtenso(d.nota)}
        </Text>

        <Text style={[styles.td, styles.colReg]}>
          {d.duracao_nome.slice(0, 1)}
        </Text>
        <Text style={[styles.td, styles.colCH]}>
          {d.horas_teoricas}T + {d.horas_teorico_praticas}TP +{" "}
          {d.horas_praticas}P
        </Text>
        <Text style={[styles.td, styles.colAC]}>{d.classe}</Text>
      </View>
    ))}
  </View>
);
const BlocoFinal = ({
  codigoValidacao,
  diretora,
}: {
  codigoValidacao: string;
  diretora: string;
}) => (
  <>
    <View style={styles.validationWrap}>
      <Text style={styles.validationLabel}>Código de Validação:</Text>
      <Text style={styles.validationCode}>{codigoValidacao}</Text>
    </View>

    <Text style={styles.atestado}>
      Atesto a conformidade desta certidão, que vai por mim assinada e timbrada
      com o selo branco da Instituição, com a ficha do cadastro académico e
      outros documentos escolares do estudante acima indicado arquivados nestes
      serviços.
    </Text>

    <View style={styles.sigRow}>
      <View style={styles.sigBlock}>
        <View style={styles.sigLine} />
        <Text style={styles.sigName}>{diretora}</Text>
        <Text style={styles.sigRole}>A Directora dos Serviços Académicos</Text>
      </View>
    </View>
  </>
);
const Legend = () => (
  <View style={{ flexDirection: "column", gap: 2, marginTop: 5 }}>
    <View style={{ flexDirection: "row", gap: 2 }}>
      <Text>Regime:</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>S:</Text>
      <Text>Semestral</Text>
    </View>
    <View style={{ flexDirection: "row", gap: 2 }}>
      <Text>Regime:</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>A:</Text>
      <Text>Anual</Text>
    </View>

    <View style={{ flexDirection: "row", gap: 2 }}>
      <Text>Carga horária semanal</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>(CH):</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>T:</Text>
      <Text>Teórica</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>TP:</Text>
      <Text>Teórico-Prática</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>P:</Text>
      <Text>Prática</Text>
      <Text>-</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>AC:</Text>
      <Text>Ano Curricular</Text>
    </View>
  </View>
);
const FooterBar = () => (
  <View style={styles.footerBar} fixed>
    <Text
      style={styles.footerPage}
      render={({ pageNumber, totalPages }) =>
        `Página ${pageNumber} de ${totalPages}`
      }
    />

    <Image style={styles.footerImage} src="/rod.png" />

    <Text style={styles.footerText}>
      UNIVERSIDADE METODISTA DE ANGOLA (Decreto nº 30/07 de 07/05) — Rua Nossa
      Senhora da Muxima, nº 10, 8º Andar, Luanda{"\n"}
      www.uma.co.ao | geral@uma.co.ao | Tel: (244) 222 338 984 / (244) 222 332
      905 | Fax: (244) 222 339 572
    </Text>
  </View>
);

const ServicoAcademicos = () => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: "bold",
        }}
      >
        Serviços Académicos da Universidade Metodista de Angola
      </Text>
      <Text>{formatarData(new Date())}</Text>
    </View>
  );
};
const Assinatura = ({
  codigoValidacao,
  diretora,
  reitor,
}: {
  codigoValidacao: string;
  diretora: string;
  reitor?: string;
}) => (
  <View style={styles.assinaturaWrap}>
    <Text style={styles.assinaturaCodigo}>
      Código de Validação: {codigoValidacao}
    </Text>
    <Text style={styles.assinaturaAtestado}>
      Atesto a conformidade desta certidão, que vai por mim assinada e timbrada
      com o selo branco da Instituição, com a ficha do cadastro académico e
      outros documentos escolares do estudante acima indicado arquivados nestes
      serviços.
    </Text>

    <View style={styles.assinaturaRow}>
      <View style={styles.assinaturaCol}>
        <Text style={styles.assinaturaCargo}>O Reitor</Text>
        <View style={styles.assinaturaLinha} />
        <Text style={styles.assinaturaNome}>
          <Text style={styles.titulo}>Prof. Dr.</Text>{" "}
          {reitor ?? "Tiago Caungo Mutombo"}
        </Text>
      </View>

      <View style={styles.assinaturaCol}>
        <Text style={styles.assinaturaCargo}>
          Directora dos Serviços Académicos
        </Text>
        <View style={styles.assinaturaLinha} />
        <Text style={styles.assinaturaNome}>
          <Text style={styles.titulo}>Lic.</Text> {diretora}
        </Text>
      </View>
    </View>
  </View>
);

const InfoEstudanteSection = ({ estudante }: { estudante: Student }) => {
  const masculino = estudante.sexo?.toLowerCase() === "masculino";
  const tratamento = masculino ? "o Senhor" : "a Senhora";
  const filiacao = masculino ? "Filho" : "Filha";
  const nascimento = masculino ? "nascido" : "nascida";
  const matriculado = masculino ? "matriculado" : "matriculada";

  return (
    <View style={styles.descricaoWrap}>
      <Text style={styles.descricao}>
        A Universidade Metodista de Angola certifica que{" "}
        <Text style={styles.descricaoBold}>
          {tratamento} {estudante.nome}
        </Text>
        , {filiacao} de <Text style={styles.descricao}>{estudante.pai}</Text> e
        de <Text style={styles.descricao}>{estudante.mae}</Text>, {nascimento}{" "}
        em <Text style={styles.descricao}>{estudante.naturalidade}</Text>, aos{" "}
        <Text style={styles.descricaoBold}>{estudante.dataNascimento}</Text>,
        titular do Bilhete de Identidade nº{" "}
        <Text style={styles.descricaoBold}>{estudante.bi}</Text>, {matriculado}{" "}
        sob o nº{" "}
        <Text style={styles.descricaoBold}>{estudante.codigoMatricula}</Text>,
        concluiu nesta Universidade, no dia{" "}
        <Text style={styles.descricao}>{estudante.dataConclusao}</Text>, nos
        termos da legislação aplicável,{" "}
        <Text style={styles.descricao}>{estudante.grau || "Licenciatura"}</Text>{" "}
        em <Text style={styles.descricaoBold}>{estudante.curso}</Text>, curso
        aprovado pelo Decreto Executivo 60/11 de 13 de Abril, com a
        classificação final de{" "}
        <Text style={styles.descricaoBold}>
          {estudante.notaObtida} valores.
        </Text>
      </Text>
    </View>
  );
};

export const PDFDocumentStudent = (props: PDFDocumentStudentProps) => {
  const {
    notas,
    estudante,
    logoSrc,
    bgSrc,
    borduraSrc,
    codigoValidacao,
    diretora,
    reitor,
  } = props;
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
      <Page size="A4" style={styles.page}>
        <Header logoSrc={logo} bgSrc={bg} />

        <InfoEstudanteSection estudante={estudante} />

        <View style={{ marginVertical: 10 }} />

        <TabelaDisciplinas data={notas} />
        <Legend />
        <ServicoAcademicos />
        <Assinatura
          codigoValidacao={codigoValidacao}
          diretora={diretora}
          reitor={reitor}
        />
        <FooterBar />
      </Page>
    </Document>
  );
};

const formatarData = (data: Date) => {
  const cidade = "Luanda";

  let dataFormatada = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data);

  dataFormatada =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  return `${cidade}, aos ${dataFormatada}`;
};
