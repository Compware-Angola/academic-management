import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useQueryStudents } from "@/hooks/students/use-query-students";

import { useDebounce } from "@/hooks/use-debounce";
import { parseFilter } from "@/util/parse-filter";
import { useState } from "react";

interface EnrollmentStudentSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  anoLectivo: number;
  codigoCurso: number;
}

export function EnrollmentStudentSelect({
  value,
  onChangeValue,
  anoLectivo,
  codigoCurso,
  disabled,
}: EnrollmentStudentSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: studentResponse, isLoading } = useQueryStudents({
    anoLectivo,
    codigoCurso,
    codigoMatricula: parseFilter(debouncedSearch),
    limit: 100,
  });

  return (
    <FormCommandSelect
      label="Estudantes"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={studentResponse?.data ?? []}
      onSearchChange={setSearch}
      width="full"
      map={(i) => ({
        key: i.codigo_matricula.toString(),
        value: i.codigo_matricula.toString(),
        label: `${i.codigo_matricula.toString()} - ${i.nome_completo.toString()}`,
      })}
      onChange={onChangeValue}
    />
  );
}
