import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { Button } from "@/components/ui/button";
import { GerarCertificadoNotas } from "@/components/views/docs-students/GerarCertificadoNota";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { useState } from "react";

type Props = {
  codigoMatricula: number;
};
type AnoCurricularRange = {
  first: string;
  last: string;
};
export function CertificadoNotas({ codigoMatricula }: Props) {
  const { data: student, isLoading } = useStudentDetail(codigoMatricula);
  const [anoCurricular, setAnoCurricular] = useState<AnoCurricularRange>({
    first: "1",
    last: "",
  });
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return (
    <div className="grid gap-4">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Certificado de Notas
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecione o ano letivo para gerar o documento oficial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnoCurricularSelect
          curso={student.curso_codigo?.toString()}
          value={anoCurricular.first}
          label="Do"
          onChangeValue={(value) =>
            setAnoCurricular({ ...anoCurricular, first: value })
          }
        />
        <AnoCurricularSelect
          curso={student.curso_codigo?.toString()}
          value={anoCurricular.last}
          label="Até"
          onChangeValue={(value) =>
            setAnoCurricular({ ...anoCurricular, last: value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          className="cursor-pointer"
          disabled={!anoCurricular.last}
          onClick={() => {
            console.log(anoCurricular);
          }}
        >
          Verificar
        </Button>
        <GerarCertificadoNotas
          notas={[]}
          estudante={{
            nome: student.nome_completo ?? "",
            codigoMatricula: student.codigo_matricula,
            dataNascimento: student.data_nascimento ?? "",
            curso: student.curso,
            bi: student.bi ?? "",
          }}
          showDownload={true}
          showPrint={true}
        />
      </div>
    </div>
  );
}
