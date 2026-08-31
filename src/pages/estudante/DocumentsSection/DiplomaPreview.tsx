import { useRef } from "react";
import fontVivace from "@/assets/english-111-vivace.otf";
import fontVivaceBold from "@/assets/english-111-vivace-bold.otf";

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

const fontFaceCss = `
  @font-face {
    font-family: "English111 Vivace BT";
    src: url("${fontVivace}");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "English111 Vivace BT Bold";
    src: url("${fontVivaceBold}");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  .diploma-preview,
  .diploma-preview * {
    font-family: "English111 Vivace BT", serif;
  }

.diploma-preview strong,
.diploma-preview b {
  font-family: "English111 Vivace BT Bold", serif;
  font-weight: bold; /* era "normal" */
}
`;

export function DiplomaPreview({ data }: DiplomaPreviewProps) {
  const diplomaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <style>{fontFaceCss}</style>
      <div
        ref={diplomaRef}
        className="diploma-preview bg-white text-[#111111] w-full max-w-[900px] mx-auto border shadow-sm"
      >
        <div className="px-16 py-14 min-h-[1100px] flex flex-col">
          <p
            className="text-[9px] text-center mb-4 text-[#777777] leading-[1.4]"
            style={{ fontFamily: "Helvetica, sans-serif" }}
          >
            Autorizado em Conselho de Ministros, pelo Decreto nº 33/97 de Maio,
            publicado no Diário da República 1ª Série nº 55
          </p>

          <h1 className="text-[34px] text-center mb-7 tracking-[1px]">
            Diploma
          </h1>

          <div className="text-[15px] leading-[2] text-justify">
            <p>
              Eu, {data.reitor || "Reitor da Universidade"}, Reitor da
              Universidade Metodista de Angola, faço saber que{" "}
              <strong>{data.nomeAluno}</strong>, filho de {data.nomePai} e de{" "}
              {data.nomeMae}, natural de {data.naturalidade}, nascido aos{" "}
              {capitalizarMeses(data.dataNascimento)}, titular do{" "}
              {data.nomeDocumento} Nº {data.bilhete}, concluiu aos{" "}
              {capitalizarMeses(data.dataConclusao)} a {data.nivelAcademico} em{" "}
              <strong>{data.curso}</strong>, com a classificação final de{" "}
              <strong>
                {data.notaFinal} ({capitalizarPrimeira(data.notaFinalExtenso)})
              </strong>
              .
            </p>

            <p className="mt-6">
              E para que conste, mandámos passar o presente Diploma que outorga
              os direitos e prerrogativas de acordo com aquele título, em
              conformidade com a lei vigente, que vai assinado e autenticado com
              selo branco desta Universidade.
            </p>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-center text-[12px]">
              Universidade Metodista de Angola, aos{" "}
              {capitalizarMeses(data.dataEmissaoDocumento)}
            </p>

            <div className="grid grid-cols-2 gap-16 items-start mt-[85px]">
              <div className="text-center">
                <p className="text-[11px] leading-[1.5]">O Reitor</p>
                <div className="border-t border-[#111111] w-[180px] mx-auto my-[6px]" />
                <p className="text-[11px] leading-[1.5]">
                  Prof. Dr. {data.reitor || "Tiago Caungo Mutombo"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-[11px] leading-[1.5]">
                  A Directora dos Serviços Académicos
                </p>
                <div className="border-t border-[#111111] w-[180px] mx-auto my-[6px]" />
                <p className="text-[11px] leading-[1.5]">
                  Lic. Margarida da Silva Rodrigues
                </p>
              </div>
            </div>

            {data.viaDiploma ? (
              <p className="text-center text-[11px] mt-6 text-[#8B6B2E]">
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
