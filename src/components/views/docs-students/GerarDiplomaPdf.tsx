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

type DiplomaData = {
  codigoMatricula: number;
  nomeAluno: string;
  curso: string;
  dataNascimento: string;
  dataConclusao: string;
  dataEmissaoDocumento: string;
  naturalidade: string;
  nomePai: string;
  nomeMae: string;
  nivelAcademico: string;
  bilhete: string;
  notaFinal: string;
  notaFinalExtenso: string;
  genero: string;
  nomeDocumento: string;
  reitor: string;
  viaDiploma: string;
  tipoCandidaturaId: number | null;
  tipoCandidatura: string;
  template: string;
};

const COR = {
  azul: "#0D1B48",
  dourado: "#8B6B2E",
  cinzaClaro: "#777777",
  preto: "#111111",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  bgWatermark: {
    position: "absolute",
    top: "22%",
    left: "18%",
    width: "64%",
    height: "50%",
    opacity: 0.08,
  },
  borduraRodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 26,
  },
  content: {
    marginTop: 35,
    marginBottom: 55,
    marginHorizontal: 65,
    flexGrow: 1,
  },
  topoTexto: {
    fontSize: 9,
    textAlign: "center",
    color: COR.cinzaClaro,
    marginBottom: 18,
    lineHeight: 1.4,
  },
  titulo: {
    fontFamily: "Times-Bold",
    fontSize: 34,
    textAlign: "center",
    color: COR.preto,
    marginBottom: 28,
    letterSpacing: 1,
  },
  corpoWrap: {
    marginTop: 25,
    marginBottom: 20,
  },
  corpoTexto: {
    fontSize: 15,
    lineHeight: 2,
    textAlign: "justify",
    color: COR.preto,
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  dataWrap: {
    marginTop: 50,
    alignItems: "center",
  },
  dataTexto: {
    fontSize: 12,
    color: COR.preto,
    textAlign: "center",
  },
  assinaturaWrap: {
    marginTop: 85,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 25,
  },
  assinaturaBox: {
    width: "42%",
    alignItems: "center",
  },
  linhaAssinatura: {
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: COR.preto,
    marginBottom: 6,
  },
  assinaturaTexto: {
    fontSize: 11,
    textAlign: "center",
    color: COR.preto,
    lineHeight: 1.5,
  },
  viaTexto: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: COR.dourado,
  },
  rodapeWrap: {
    position: "absolute",
    bottom: 34,
    left: 45,
    right: 45,
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
    textAlign: "center",
  },
  rodapeLinha2: {
    fontSize: 7.5,
    color: COR.cinzaClaro,
    textAlign: "center",
    marginTop: 2,
  },
});

interface DiplomaDocumentProps {
  dados: DiplomaData;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
}

export function DiplomaDocument({
  dados,
  logoSrc,
  bgSrc,
  borduraSrc,
}: DiplomaDocumentProps) {
  const bgDefault = "/logo_bg.png";
  const borduraDefault = "/bordura_africana.png";

  return (
    <Document
      title={`Diploma - ${dados?.nomeAluno}`}
      author="Universidade Metodista de Angola"
      subject="Diploma"
    >
      <Page size="A4" style={s.page}>
        <Image style={s.bgWatermark} src={bgSrc || bgDefault} />
        <View style={s.content}>
          <Text style={s.topoTexto}>
            Autorizado em Conselho de Ministros, pelo Decreto nº 33/97 de Maio,
            publicado no Diário da República 1ª Série nº 55
          </Text>

          <Text style={s.titulo}>Diploma</Text>

          <View style={s.corpoWrap}>
            <Text style={s.corpoTexto}>
              Eu, <Text style={s.bold}>{dados.reitor || "Reitor da Universidade"}</Text>,
              Reitor da Universidade Metodista de Angola, faço saber que{" "}
              <Text style={s.bold}>{dados.nomeAluno}</Text>, filho de{" "}
              <Text style={s.bold}>{dados.nomePai}</Text> e de{" "}
              <Text style={s.bold}>{dados.nomeMae}</Text>, natural de{" "}
              <Text style={s.bold}>{dados.naturalidade}</Text>, nascido aos{" "}
              <Text style={s.bold}>{dados.dataNascimento}</Text>, titular do/a{" "}
              <Text style={s.bold}>{dados.nomeDocumento}</Text> Nº{" "}
              <Text style={s.bold}>{dados.bilhete}</Text>, concluiu aos{" "}
              <Text style={s.bold}>{dados.dataConclusao}</Text> a{" "}
              <Text style={s.bold}>{dados.nivelAcademico}</Text> em{" "}
              <Text style={s.bold}>{dados.curso}</Text>, com a classificação final de{" "}
              <Text style={s.bold}>
                {dados.notaFinal} ({capitalizarPrimeira(dados.notaFinalExtenso)})
              </Text>.
            </Text>
          </View>

          <View style={s.corpoWrap}>
            <Text style={s.corpoTexto}>
              E para que conste, mandámos passar o presente Diploma, que outorga
              os direitos e prerrogativas de acordo com aquele título, em
              conformidade com a lei vigente, que vai assinado e autenticado com
              selo branco desta Universidade.
            </Text>
          </View>

          <View style={s.dataWrap}>
            <Text style={s.dataTexto}>
              Universidade Metodista de Angola, aos {dados.dataEmissaoDocumento}
            </Text>
          </View>

          <View style={s.assinaturaWrap}>
            <View style={s.assinaturaBox}>
              <View style={s.linhaAssinatura} />
              <Text style={s.assinaturaTexto}>O Reitor</Text>
            </View>

            <View style={s.assinaturaBox}>
              <View style={s.linhaAssinatura} />
              <Text style={s.assinaturaTexto}>
                A Directora dos Serviços{"\n"}Académicos
              </Text>
            </View>
          </View>

          {dados.viaDiploma ? <Text style={s.viaTexto}>{dados.viaDiploma}</Text> : null}
        </View>

      </Page>
    </Document>
  );
}

interface GerarDiplomaPdfProps {
  dados: DiplomaData;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
  showDownload?: boolean;
  showPrint?: boolean;
}

export function GerarDiplomaPdf({
  dados,
  logoSrc,
  bgSrc,
  borduraSrc,
  showDownload = true,
  showPrint = false,
}: GerarDiplomaPdfProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const nomeArquivo = `Diploma_${dados?.nomeAluno?.replace(/\s+/g, "_")}.pdf`;

  const buildDocumento = () => (
    <DiplomaDocument
      dados={dados}
      logoSrc={logoSrc}
      bgSrc={bgSrc}
      borduraSrc={borduraSrc}
    />
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await pdf(buildDocumento()).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeArquivo;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar PDF do diploma:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const blob = await pdf(buildDocumento()).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      if (win) {
        win.focus();
        win.print();
      }
    } catch (err) {
      console.error("Erro ao preparar impressão do diploma:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  const isBusy = isDownloading || isPrinting;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showDownload && (
        <Button
          disabled={isBusy}
          variant="outline"
          className="gap-2"
          onClick={handleDownload}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A gerar PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar Diploma PDF
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
              A preparar...
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

function capitalizarPrimeira(texto: string) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default GerarDiplomaPdf;