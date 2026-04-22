import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

type DiplomaPreviewProps = {
  data: DiplomaData;
};

export function DiplomaPreview({ data }: DiplomaPreviewProps) {
  const diplomaRef = useRef<HTMLDivElement>(null);

  async function handleExportPdf() {
    if (!diplomaRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = diplomaRef.current;

    const options = {
      margin: 0,
      filename: `diploma-${data.codigoMatricula}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    } as const;

    await html2pdf().set(options).from(element).save();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportPdf} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div
        ref={diplomaRef}
        className="bg-white text-black w-full max-w-[900px] mx-auto border shadow-sm"
      >
        <div className="px-16 py-20 min-h-[1200px] flex flex-col">
          <p className="text-[10px] text-center mb-10">
            Autorizado em Conselho de Ministros, pelo Decreto nº 33/97 de Maio,
            publicado no Diário da República 1ª Série nº 55
          </p>

          <h1 className="text-5xl font-serif text-center mb-14">Diploma</h1>

          <div className="text-[20px] leading-[2.1] font-serif text-justify space-y-8">
            <p>
              Eu, <strong>{data.reitor || "Reitor da Universidade"}</strong>,
              Reitor da Universidade Metodista de Angola, faço saber que{" "}
              <strong>{data.nomeAluno}</strong>, filho de{" "}
              <strong>{data.nomePai}</strong> e de{" "}
              <strong>{data.nomeMae}</strong>, natural de{" "}
              <strong>{data.naturalidade}</strong>, nascido aos{" "}
              <strong>{data.dataNascimento}</strong>, titular do/a{" "}
              <strong>{data.nomeDocumento}</strong> Nº{" "}
              <strong>{data.bilhete}</strong>, concluiu aos{" "}
              <strong>{data.dataConclusao}</strong> a{" "}
              <strong>{data.nivelAcademico}</strong> em{" "}
              <strong>{data.curso}</strong>, com a classificação final de{" "}
              <strong>
                {data.notaFinal} ({capitalizarPrimeira(data.notaFinalExtenso)})
              </strong>
              .
            </p>

            <p>
              E para que conste, mandámos passar o presente Diploma, que
              outorga os direitos e prerrogativas de acordo com aquele título,
              em conformidade com a lei vigente, que vai assinado e autenticado
              com selo branco desta Universidade.
            </p>
          </div>

          <div className="mt-auto pt-24">
            <p className="text-center text-[18px] font-serif mb-20">
              Universidade Metodista de Angola, aos{" "}
              {data.dataEmissaoDocumento}
            </p>

            <div className="grid grid-cols-2 gap-16 items-start">
              <div className="text-center">
                <div className="border-t border-black w-64 mx-auto mb-2" />
                <p className="text-[16px] font-serif">O Reitor</p>
              </div>

              <div className="text-center">
                <div className="border-t border-black w-64 mx-auto mb-2" />
                <p className="text-[16px] font-serif">
                  A Directora dos Serviços
                  <br />
                  Académicos
                </p>
              </div>
            </div>

            {data.viaDiploma ? (
              <p className="text-center text-sm mt-10 font-semibold">
                {data.viaDiploma}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function capitalizarPrimeira(texto: string) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}