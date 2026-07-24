import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import { StudentClassInfo } from "@/services/students/students-class-info.service";

const COR = {
  azul: "#0D1B48",
  cinzaClaro: "#888888",
  preto: "#111111",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  bgWatermark: {
    position: "absolute",
    top: "25%",
    left: "20%",
    width: "60%",
    height: "45%",
    opacity: 0.1,
  },
  borduraRodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  content: {
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 70,
    flexGrow: 1,
  },
  logoWrap: {
    alignItems: "flex-end" as const,
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 90,
  },
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
  titulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: COR.preto,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    letterSpacing: 4,
    marginBottom: 20,
  },
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
  validacaoWrap: {
    marginTop: 80,
    alignItems: "center" as const,
  },
  validacaoTexto: {
    fontSize: 11,
    color: COR.preto,
    textAlign: "center" as const,
  },
  notaWrap: {
    marginTop: 20,
    alignItems: "center" as const,
  },
  notaTexto: {
    fontSize: 11,
    textAlign: "center" as const,
    color: COR.preto,
    lineHeight: 1.6,
  },
  dataWrap: {
    marginTop: 16,
    alignItems: "center" as const,
  },
  dataTexto: {
    fontSize: 9,
    textAlign: "center" as const,
    color: COR.preto,
  },
  assinaturaWrap: {
    marginTop: 70,
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

interface CartaConclusaoDocumentProps {
  dados: StudentClassInfo;
  cargoDiretor: string;
  nomeDiretor: string;
  cargoReitor: string;
  nomeReitor: string;
  codigo_validacao: string;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
}

export function CertidaoDocument({
  dados,
  cargoDiretor,
  nomeDiretor,
   cargoReitor,
  nomeReitor,
  codigo_validacao,
  logoSrc,
  bgSrc,
  borduraSrc,
}: CartaConclusaoDocumentProps) {
  const logoDefault = "/logo_uma.png";
  const bgDefault = "/logo_bg.png";
  const borduraDefault = "/bordura_africana.png";
const formatDate = (date?: string) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
return (
  <Document
    title={`Certidão de Conclusão - ${dados?.nome_completo}`}
    author="Universidade Metodista de Angola"
    subject="Certidão de Conclusão"
  >
    <Page size="A4" style={s.page}>
      <Image style={s.bgWatermark} src={bgSrc || bgDefault} />

      <View style={s.content}>
        <View style={s.logoWrap}>
          <Image style={s.logo} src={logoSrc || logoDefault} />
        </View>

      

        <Text style={s.titulo}>Certificado</Text>

        <View style={s.corpoWrap}>
          <Text style={s.corpoTexto}>
            {"A Directora dos Serviços Académicos da Universidade Metodista de Angola certifica que o Senhor "}
            <Text style={s.bold}>{dados?.nome_completo}</Text>
            {", filho de "}
            {dados?.pai}
            {" e de "}
            {dados?.mae}
            {", titular do Bilhete de Identidade nº "}
            <Text style={s.bold}>{dados?.bi}</Text>
            {", concluiu nesta Universidade, no dia "}
          <Text style={s.bold}>
  {formatDate(dados?.data_conclusao)}
</Text>
            {" e nos termos da legislação aplicável, "}
            <Text style={s.bold}>
              {dados?.grau || "Licenciatura"}
            </Text>
            {" em "}
            <Text style={s.bold}>{dados?.curso}</Text>
            {", curso aprovado pelo Decreto Executivo "}
            <Text style={s.bold}>
              { "Executivo 60/11 de 13 de Abril"}
            </Text>
            {", com a classificação final de "}
            <Text style={s.bold}>
              { dados?.nota_obtida}
            </Text>
            {" Valores."}
          </Text>
        </View>

        <View style={s.validacaoWrap}>
          <Text style={s.validacaoTexto}>
            Código de Validação: {codigo_validacao}
          </Text>
        </View>

        <View style={s.notaWrap}>
          <Text style={s.notaTexto}>
           O presente certificado vai assinado e autenticado com o carimbo a selo branco, em uso nesta Instituição.
            
          </Text>
        </View>

        <View style={s.dataWrap}>
          <Text style={s.dataTexto}>
            Universidade Metodista de Angola, em Luanda, aos{" "}
            {new Date().toLocaleDateString("pt-AO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        <View style={s.assinaturaWrap}>
          <Text style={s.cargoDiretora}>{cargoReitor}</Text>
          <View style={s.linhaAssinatura} />
          <Text style={s.nomeDiretora}>{nomeReitor}</Text>
        </View>
        
        </View>
          <View style={s.assinaturaWrap}>
          <Text style={s.cargoDiretora}>{cargoDiretor}</Text>
          <View style={s.linhaAssinatura} />
          <Text style={s.nomeDiretora}>{nomeDiretor}</Text>
        </View>     
      </View>

      <View style={s.rodapeWrap}>
        <View style={s.rodapeSeparador} />
        <Text style={s.rodapeLinha1}>
          UNIVERSIDADE METODISTA DE ANGOLA (Decreto nº 30/07 de 07/05) - Rua Nossa Senhora da Muxima, nº 10 - 8º Andar - Luanda
        </Text>
        <Text style={s.rodapeLinha2}>
          www.uma.co.ao | E-mail: geral@uma.co.ao | Tel: (244) 222 338 984 /(244) 222 332 905 / Fax: (244) 222 339 572
        </Text>
      </View>

      <Image style={s.borduraRodape} src={borduraSrc || borduraDefault} />
    </Page>
  </Document>
);
}

// ─────────────────────────────────────────────────────────────────────────────

interface GerarCartaConclusaoProps {
  dados: StudentClassInfo;
  cargoDiretor: string;
  nomeDiretor: string;
  cargoReitor: string;
  nomeReitor: string;
  codigo_validacao:string;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  showDownload?: boolean;
  showPrint?: boolean;
  onBeforeDownload: (onReady: (codigo: string) => void) => void;
  isGeneratingCode?: boolean;
}

export function GerarCartaConclusao({
  dados,
  cargoDiretor,
  nomeDiretor,
  cargoReitor,
  nomeReitor,
  codigo_validacao,
  logoSrc,
  bgSrc,
  borduraSrc,
  showDownload = true,
  showPrint = false,
  onBeforeDownload,
  isGeneratingCode = false,
}: GerarCartaConclusaoProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const nomeArquivo = `Carta_Conclusão${dados?.nome_completo?.replace(/\s+/g, "_")}.pdf`;

  const buildDocumento = (codigo: string) => (
    <CertidaoDocument
      dados={dados}
      cargoDiretor={cargoDiretor}
      nomeDiretor={nomeDiretor}
         cargoReitor={cargoReitor}
      nomeReitor={nomeReitor}
      codigo_validacao={codigo}
      logoSrc={logoSrc}
      bgSrc={bgSrc}
      borduraSrc={borduraSrc}
    />
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Pede novo código e só gera o PDF após receber
      onBeforeDownload(async (codigo) => {
        try {
          const blob = await pdf(buildDocumento(codigo)).toBlob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = nomeArquivo;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Erro ao gerar PDF:", err);
        } finally {
          setIsDownloading(false);
        }
      });
    } catch (err) {
      console.error("Erro ao iniciar download:", err);
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);

      onBeforeDownload(async (codigo) => {
        try {
          const blob = await pdf(buildDocumento(codigo)).toBlob();
          const url = URL.createObjectURL(blob);
          const win = window.open(url);
          if (win) {
            win.focus();
            win.print();
          }
        } catch (err) {
          console.error("Erro ao preparar impressão:", err);
        } finally {
          setIsPrinting(false);
        }
      });
    } catch (err) {
      console.error("Erro ao iniciar impressão:", err);
      setIsPrinting(false);
    }
  };

  const isBusy = isDownloading || isPrinting || isGeneratingCode;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <Button
          disabled={isBusy}
          variant="outline"
          className="gap-2"
          onClick={handleDownload}
        >
          {isBusy && !isPrinting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isGeneratingCode ? "A gerar código..." : "A gerar PDF..."}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar Carta de Conclusão PDF
            </>
          )}
        </Button>
      )}

      {showPrint && (
        <Button
          variant="outline"
          onClick={handlePrint}
          disabled={isBusy}
          className="gap-2"
        >
          {isPrinting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isGeneratingCode ? "A gerar código..." : "A preparar..."}
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Imprimir
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default GerarCartaConclusao;