import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import fontVivace from "@/assets/english-111-vivace.otf";
import fontVivaceBold from "@/assets/english-111-vivace-bold.otf";

Font.register({
  family: "English111 Vivace BT",
  fonts: [
    { src: fontVivace, fontWeight: 400 },
    { src: fontVivaceBold, fontWeight: 700 },
  ],
});

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
    fontFamily: "English111 Vivace BT",
    fontSize: 12,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  content: {
    marginTop: 240,
    marginBottom: 55,
    marginHorizontal: 65,
    flexGrow: 1,
  },
  topoTexto: {
    fontFamily: "Helvetica",
    fontSize: 6,
    textAlign: "center",
    color: COR.preto,
    marginBottom: 10,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  titulo: {
    fontFamily: "English111 Vivace BT",
    fontSize: 34,
    textAlign: "center",
    color: COR.preto,
    marginBottom: 18,
    letterSpacing: 1,
  },
  corpoWrap: {
    marginTop: 10,
    marginBottom: 5,
  },
  corpoTexto: {
    fontSize: 16,
    lineHeight: 2,
    textAlign: "justify",
    color: COR.preto,
  },
  bold: {
    fontFamily: "English111 Vivace BT",
    fontWeight: "bold",
  },
  dataWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  dataTexto: {
    fontSize: 14,
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
    marginVertical: 10,
  },
  assinaturaTexto: {
    fontSize: 12,
    textAlign: "center",
    color: COR.preto,
    lineHeight: 2.5,
  },
  viaTexto: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "English111 Vivace BT",
    color: COR.dourado,
  },
});

interface DiplomaDocumentProps {
  dados: DiplomaData;
  logoSrc?: string;
  bgSrc?: string;
  borduraSrc?: string;
}

export function DiplomaDocument({ dados }: DiplomaDocumentProps) {
  return (
    <Document
      title={`Diploma - ${dados?.nomeAluno}`}
      author="Universidade Metodista de Angola"
      subject="Diploma"
    >
      <Page size="A4" style={s.page}>
        <View style={s.content}>
          <Text style={s.topoTexto}>
            Autorizado em Conselho de Ministros, pelo Decreto nº 33/97 de Maio,
            publicado no Diário da República 1ª Série nº 55
          </Text>

          <Text style={s.titulo}>Diploma</Text>

          <View style={s.corpoWrap}>
            <Text style={s.corpoTexto}>
              Eu, {dados.reitor || "Reitor da Universidade"}, Reitor da
              Universidade Metodista de Angola, faço saber que{" "}
              <Text style={s.bold}>{dados.nomeAluno}</Text>, filho de{" "}
              {dados.nomePai} e de {dados.nomeMae}, natural de{" "}
              {dados.naturalidade}, nascido aos{" "}
              {capitalizarMeses(dados.dataNascimento)}, titular do{" "}
              {dados.nomeDocumento} Nº {dados.bilhete}, concluiu aos{" "}
              {capitalizarMeses(dados.dataConclusao)} a {dados.nivelAcademico}{" "}
              em <Text style={s.bold}>{dados.curso}</Text>, com a classificação
              final de{" "}
              <Text style={s.bold}>
                {dados.notaFinal} ({capitalizarPrimeira(dados.notaFinalExtenso)}
                )
              </Text>
              .
            </Text>
          </View>

          <View style={s.corpoWrap}>
            <Text style={s.corpoTexto}>
              E para que conste, mandámos passar o presente Diploma que outorga
              os direitos e prerrogativas de acordo com aquele título, em
              conformidade com a lei vigente, que vai assinado e autenticado com
              selo branco desta Universidade.
            </Text>
          </View>

          <View style={s.dataWrap}>
            <Text style={s.dataTexto}>
              Universidade Metodista de Angola, aos{" "}
              {capitalizarMeses(dados.dataEmissaoDocumento)}
            </Text>
          </View>

          <View style={s.assinaturaWrap}>
            <View style={s.assinaturaBox}>
              <Text style={s.assinaturaTexto}>O Reitor</Text>
              <View style={s.linhaAssinatura} />
              <Text style={s.assinaturaTexto}>
                Prof. Dr. {dados.reitor || "Tiago Caungo Mutombo"}
              </Text>
            </View>

            <View style={s.assinaturaBox}>
              <Text style={s.assinaturaTexto}>
                A Directora dos Serviços Académicos
              </Text>
              <View style={s.linhaAssinatura} />
              <Text style={s.assinaturaTexto}>
                Lic. Margarida da Silva Rodrigues
              </Text>
            </View>
          </View>

          {dados.viaDiploma ? (
            <Text style={s.viaTexto}>{dados.viaDiploma}</Text>
          ) : null}
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
  showDownload = true,
  showPrint = false,
}: GerarDiplomaPdfProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const nomeArquivo = `Diploma_${dados?.nomeAluno?.replace(/\s+/g, "_")}.pdf`;

  const buildDocumento = () => <DiplomaDocument dados={dados} />;

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
              <Loader2 className="h-4 w-4 animate-spin" />A gerar PDF...
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
              <Loader2 className="h-4 w-4 animate-spin" />A preparar...
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

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function capitalizarMeses(texto: string) {
  if (!texto) return "";

  return MESES.reduce((resultado, mes) => {
    const regex = new RegExp(`\\b${mes}\\b`, "gi");
    return resultado.replace(regex, mes.charAt(0).toUpperCase() + mes.slice(1));
  }, texto);
}

export default GerarDiplomaPdf;
