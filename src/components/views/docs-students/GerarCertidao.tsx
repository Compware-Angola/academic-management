// src/components/pdf/GerarCertificado.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { StudentDetail } from "@/services/students/students.service";

// ─────────────────────────────────────────────────────────────────────────────
// CORES INSTITUCIONAIS UMA
// ─────────────────────────────────────────────────────────────────────────────

const COR = {
  azul:       "#0D1B48",
  cinzaClaro: "#888888",
  preto:      "#111111",
};

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },

  // ── Marca d'água centrada e reduzida ──
  bgWatermark: {
    position: "absolute",
    top: "25%",
    left: "20%",
    width: "60%",
    height: "45%",
    opacity: 0.1,
  },

  // ── Bordura decorativa africana — APENAS no rodapé ──
  borduraRodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
  },

  // ── Conteúdo principal ──
  content: {
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 70,
    flexGrow: 1,
  },

  // ── 1. Logo sozinho alinhado à direita ──
  logoWrap: {
    alignItems: "flex-end" as const,
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 90,
  },

  // ── 2. Nome da instituição — centrado, logo abaixo do logo ──
  nomeInstituicao: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: COR.azul,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  decretoText: {
    fontSize: 9,
    color: COR.cinzaClaro,
    textAlign: "center" as const,
    marginBottom: 18,
  },

  // ── 3. Título CERTIDÃO ──
  titulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: COR.preto,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    letterSpacing: 4,
    marginBottom: 20,
  },

  // ── Corpo do texto ──
  corpoWrap: {
    marginTop: 8,
    marginBottom: 10,
  },
  corpoTexto: {
    fontSize: 12,
    lineHeight: 1.8,
    color: COR.preto,
    textAlign: "justify" as const,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },

  // ── Código de validação ──
  validacaoWrap: {
    marginTop: 40,
    alignItems: "center" as const,
  },
  validacaoTexto: {
    fontSize: 11,
    color: COR.preto,
    textAlign: "center" as const,
  },

  // ── Nota de autenticação ──
  notaWrap: {
    marginTop: 18,
    alignItems: "center" as const,
  },
  notaTexto: {
    fontSize: 11,
    textAlign: "center" as const,
    color: COR.preto,
    lineHeight: 1.6,
  },

  // ── Data ──
  dataWrap: {
    marginTop: 16,
    alignItems: "center" as const,
  },
  dataTexto: {
    fontSize: 11,
    textAlign: "center" as const,
    color: COR.preto,
  },

  // ── Assinatura ──
  assinaturaWrap: {
    marginTop: 36,
    alignItems: "center" as const,
  },
  cargoDiretora: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textAlign: "center" as const,
    color: COR.preto,
    marginBottom: 22,
  },
  linhaAssinatura: {
    width: 220,
    borderBottomWidth: 1,
    borderBottomColor: COR.preto,
    marginBottom: 6,
  },
  nomeDiretora: {
    fontSize: 11,
    textAlign: "center" as const,
    color: COR.preto,
  },

  // ── Rodapé — texto institucional (acima da bordura decorativa) ──
  rodapeWrap: {
    position: "absolute",
    bottom: 34,
    left: 50,
    right: 50,
  },
  rodapeSeparador: {
    borderTopWidth: 0.5,
    borderTopColor: COR.azul,
    marginBottom: 5,
  },
  rodapeLinha1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: COR.azul,
    textAlign: "center" as const,
  },
  rodapeLinha2: {
    fontSize: 7.5,
    color: COR.cinzaClaro,
    textAlign: "center" as const,
    marginTop: 2,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PDF
// ─────────────────────────────────────────────────────────────────────────────

interface CertidaoDocumentProps {
  dados: StudentDetail;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
}

export function CertidaoDocument({ dados, logoSrc, bgSrc, borduraSrc }: CertidaoDocumentProps) {
  const logoDefault    = "/logo_uma.png";
  const bgDefault      = "/logo_bg.png";
  const borduraDefault = "/bordura_africana.png";

  return (
    <Document
      title={`Certidão de Frequência - ${dados.nome_completo}`}
      author="Universidade Metodista de Angola"
      subject="Certidão de Frequência"
    >
      <Page size="A4" style={s.page}>

        {/* ── Marca d'água centrada e reduzida ── */}
        <Image style={s.bgWatermark} src={bgSrc || bgDefault} />

        {/* ── CONTEÚDO PRINCIPAL ── */}
        <View style={s.content}>

          {/* 1. Logo — alinhado à direita */}
          <View style={s.logoWrap}>
            <Image style={s.logo} src={logoSrc || logoDefault} />
          </View>

          {/* 2. Nome da instituição — centrado, logo abaixo do logo, sem barra */}
          <Text style={s.nomeInstituicao}>Universidade Metodista de Angola</Text>
          <Text style={s.decretoText}>(Aprovada pelo Decreto nº 30/07 de 07/05)</Text>

          {/* 3. Título CERTIDÃO */}
          <Text style={s.titulo}>Certidão</Text>

          {/* Corpo */}
          <View style={s.corpoWrap}>
            <Text style={s.corpoTexto}>
              {"Para os devidos efeitos, a Universidade Metodista de Angola certifica que o Senhor "}
              <Text style={s.bold}>{dados.nome_completo}</Text>
              {", filho de "}
              {dados.pai}
              {" e de "}
              {dados.mae}
              {", titular do Bilhete de Identidade nº "}
              <Text style={s.bold}>{dados.bi}</Text>
              {", matriculado nesta Instituição sob o número de estudante "}
              <Text style={s.bold}>{dados.codigo_matricula}</Text>
              {", frequentou o "}
              {5}
              {" ano de "}
              <Text style={s.bold}>{dados.grau}</Text>
              {" em "}
              <Text style={s.bold}>{dados.curso}</Text>
              {", turno "}
              <Text style={s.bold}>{dados.periodo}</Text>
              {", no ano lectivo "}
              {"2023/2024"}
              {"."}
            </Text>
          </View>

          {/* Código de validação */}
          <View style={s.validacaoWrap}>
            <Text style={s.validacaoTexto}>
              Código de Validação: {"00000"}
            </Text>
          </View>

          {/* Nota de autenticação */}
          <View style={s.notaWrap}>
            <Text style={s.notaTexto}>
              A presente certidão vai assinada e autenticada com o carimbo a óleo, em uso nesta
              {"\n"}Instituição.
            </Text>
          </View>

          {/* Data */}
          <View style={s.dataWrap}>
            <Text style={s.dataTexto}>
              Universidade Metodista de Angola em Luanda, aos {"..."}
            </Text>
          </View>

          {/* Assinatura */}
          <View style={s.assinaturaWrap}>
            <Text style={s.cargoDiretora}>{"TESTE"}</Text>
            <View style={s.linhaAssinatura} />
            <Text style={s.nomeDiretora}>{"Isaac Bunga"}</Text>
          </View>

        </View>

        {/* ── Rodapé — texto institucional ── */}
        <View style={s.rodapeWrap}>
          <View style={s.rodapeSeparador} />
          <Text style={s.rodapeLinha1}>
            UNIVERSIDADE METODISTA DE ANGOLA (Decreto nº 30/07 de 07/05) - Rua Nossa Senhora da Muxima, nº 10 -8º Andar - Luanda
          </Text>
          <Text style={s.rodapeLinha2}>
            www.uma.co.ao | E-mail: geral@uma.co.ao | Tel: (244) 222 338 984 /(244) 222 332 905 / Fax: (244) 222 339 572
          </Text>
        </View>

        {/* ── Bordura decorativa africana — APENAS no rodapé ── */}
        <Image style={s.borduraRodape} src={borduraSrc || borduraDefault} />

      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE DE ACÇÕES (Download + Imprimir)
// ─────────────────────────────────────────────────────────────────────────────

interface GerarCertidaoProps {
  dados: StudentDetail;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  showDownload?: boolean;
  showPrint?: boolean;
}

export function GerarCertidao({
  dados,
  logoSrc,
  bgSrc,
  borduraSrc,
  showDownload = true,
  showPrint = false,
}: GerarCertidaoProps) {
  const documento = (
    <CertidaoDocument
      dados={dados}
      logoSrc={logoSrc}
      bgSrc={bgSrc}
      borduraSrc={borduraSrc}
    />
  );

  const nomeArquivo = `Certidao_Frequencia_${dados.nome_completo.replace(/\s+/g, "_")}.pdf`;

  const handlePrint = async () => {
    try {
      const blob = await pdf(documento).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      if (win) {
        win.focus();
        win.print();
      }
    } catch (err) {
      console.error("Erro ao preparar impressão:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <PDFDownloadLink document={documento} fileName={nomeArquivo}>
          {({ loading }) => (
            <Button disabled={loading} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? "A gerar..." : "Exportar Certidão PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {showPrint && (
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      )}
    </div>
  );
}

export default GerarCertidao;

// ─────────────────────────────────────────────────────────────────────────────
// EXEMPLO DE USO
// ─────────────────────────────────────────────────────────────────────────────
//
// <GerarCertidao
//   dados={studentDetail}
//   logoSrc="/logo_uma.png"
//   bgSrc="/logo_bg.png"
//   borduraSrc="/bordura_africana.png"
// />