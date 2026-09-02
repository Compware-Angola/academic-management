import { useState } from "react";
import { Loader2 } from "lucide-react";

import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { GerarCertificadoNotas } from "@/components/views/docs-students/certificado-notas";

import { useGenerateDocumentCode } from "@/hooks/documents/use-generate-code";
import { useGetNotas } from "@/hooks/students/use-get-notas";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { useStudentClassInfo } from "@/hooks/students/use-query-students-class-info";
import {
  useCursoBasePorCodigoMatricula,
  useCursoEspecialidadePorCodigoMatricula,
} from "@/hooks/cursos/especialidade";

import { parseFilter } from "@/util/parse-filter";
import { useQueryListarCargosAdministrativo } from "@/hooks/controle-acesso/use-query-listar-cargos-administrativos";

type Props = {
  codigoMatricula: number;
};

type AnoCurricularRange = {
  first: string;
  last: string;
};

export function CertificadoNotas({ codigoMatricula }: Props) {
  const [anoLectivo, setAnoLectivo] = useState("");
  const [codigoValidacao, setCodigoValidacao] = useState<string | null>(null);
  const [anoCurricular, setAnoCurricular] = useState<AnoCurricularRange>({
    first: "1",
    last: "",
  });

  const { data: cargos = [], isLoading: isLoadingCargos } =
    useQueryListarCargosAdministrativo({
      tipoCargoId: Number(1),
    });
  const reitor = cargos[0];

  const { data: student, isLoading: isLoadingStudent } =
    useStudentDetail(codigoMatricula);

  const { data: especialidades = [] } =
    useCursoEspecialidadePorCodigoMatricula(codigoMatricula);

  const { data: cursoBase } = useCursoBasePorCodigoMatricula(codigoMatricula);

  const cursos = [
    cursoBase?.codigo?.toString(),
    student?.curso_codigo?.toString(),
    ...especialidades.map((especialidade) => especialidade.codigo.toString()),
  ].filter((curso): curso is string => !!curso);

  const { data: studentClassInfo } = useStudentClassInfo(
    {
      numeroDeMatricula: codigoMatricula,
    },
    !!codigoMatricula,
  );

  const { data: notas, isLoading: isLoadingNotas } = useGetNotas({
    codigoMatricula,
    anoMin: parseFilter(anoCurricular.first),
    anoMax: parseFilter(anoCurricular.last),
  });

  const { mutate: gerarCodigo, isPending: isGeneratingCode } =
    useGenerateDocumentCode();

  const hasNotas = (notas?.length ?? 0) > 0;
  const isInvalidRange =
    Number(anoCurricular.first) > Number(anoCurricular.last);
  const handleExportar = (onReady: (codigo: string) => void) => {
    gerarCodigo(
      {
        codigoMatricula,
        tipoDocumento: 6,
        documento: "Certidão",
        anoLetivo: anoLectivo,
        status: "Ativo",
      },
      {
        onSuccess: (data) => {
          setCodigoValidacao(data.codigo);
          onReady(data.codigo);
        },
      },
    );
  };

  const estudanteFormatado = {
    nome: student?.nome_completo ?? "",
    codigoMatricula: student?.codigo_matricula ?? 0,
    dataNascimento: formatDataExtenso(student?.data_nascimento),
    curso: student?.curso,
    bi: student?.bi ?? "",
    sexo: student?.sexo ?? "",
    pai: student?.pai ?? "",
    mae: student?.mae ?? "",
    naturalidade: student?.naturalidade ?? "",
    dataConclusao: formatDate(studentClassInfo?.data_conclusao),
    notaObtida: studentClassInfo?.nota_obtida ?? "",
    grau: student?.grau ?? "Licenciatura",
  };

  function renderContent() {
    if (isInvalidRange) {
      return (
        <ErrorMessage message="O intervalo deve estar em ordem crescente (ex: 1 → 3). Para pesquisar apenas um ano, selecione o mesmo valor nos dois campos." />
      );
    }

    if (isLoadingNotas || isLoadingStudent) {
      return <LoadingMessage />;
    }

    if (!hasNotas) {
      return (
        <ErrorMessage message="Não foram encontradas notas para o estudante." />
      );
    }

    return (
      <GerarCertificadoNotas
        notas={notas ?? []}
        estudante={estudanteFormatado}
        showDownload
        isGeneratingCode={isGeneratingCode}
        onBeforeDownload={handleExportar}
        diretora="Margarida da Silva Rodrigues"
        reitor={reitor?.utilizadorNome ?? "Tiago Caungo Mutombo"}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <Header />

      <div className="hidden">
        <AcademicYearSelect
          disabled
          enableDefaultActiveYear
          value={anoLectivo}
          onChangeValue={setAnoLectivo}
        />
      </div>

      <RangeSelectors
        cursos={cursos}
        anoCurricular={anoCurricular}
        setAnoCurricular={setAnoCurricular}
      />

      {renderContent()}
    </div>
  );
}

function Header() {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Certificado de Notas
      </h2>
      <p className="text-sm text-muted-foreground">
        Selecione o ano letivo para gerar o documento oficial.
      </p>
    </div>
  );
}

function RangeSelectors({
  cursos,
  anoCurricular,
  setAnoCurricular,
}: {
  cursos: (string | number)[];
  anoCurricular: { first: string; last: string };
  setAnoCurricular: (value: { first: string; last: string }) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnoCurricularSelect
        curso={cursos}
        value={anoCurricular.first}
        label="Do"
        onChangeValue={(value) =>
          setAnoCurricular({ ...anoCurricular, first: value })
        }
      />
      <AnoCurricularSelect
        curso={cursos}
        value={anoCurricular.last}
        label="Até"
        onChangeValue={(value) =>
          setAnoCurricular({ ...anoCurricular, last: value })
        }
      />
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-lg border bg-background">
      <Loader2 className="h-4 w-4 animate-spin" />A carregar dados...
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-red-500 bg-red-500/10 p-2 rounded-lg">{message}</div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatDataExtenso(date?: string) {
  if (!date) return "";

  const formatada = new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

  return formatada.charAt(0).toUpperCase() + formatada.slice(1);
}
