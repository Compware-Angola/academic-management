import { useState } from "react";
import { GerarCertidaoProps } from "./types";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Printer } from "lucide-react";
import { PDFDocumentStudent } from "./components";

export const GerarCertificadoNotas = (props: GerarCertidaoProps) => {
  const {
    onBeforeDownload,
    estudante,
    notas,
    showDownload,
    showPrint,
    isGeneratingCode,
    bgSrc,
    borduraSrc,
    diretora,
    logoSrc,
  } = props;
  const nomeArquivo = `certificado_nota_${estudante.nome.replace(
    /\s+/g,
    "_",
  )}_${new Date().getTime()}.pdf`;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const buildDocumento = (codigo: string) => (
    <PDFDocumentStudent
      diretora={diretora}
      estudante={estudante}
      notas={notas}
      logoSrc={logoSrc}
      bgSrc={bgSrc}
      borduraSrc={borduraSrc}
      codigoValidacao={codigo}
    />
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
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
              Certificado de Notas PDF
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
              {isGeneratingCode
                ? "A gerar código..."
                : "A gerar Certificado de Notas PDF..."}
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Imprimir Certificado de Notas
            </>
          )}
        </Button>
      )}
    </div>
  );
};
