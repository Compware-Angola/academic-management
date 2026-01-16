import { useEffect, useState } from "react";
import { FormSelect } from "../FormSelect";
import { useCursos } from "@/hooks/use-cursos";
import { Curso } from "@/services/fetch-course";

interface CourseSelectProps {
  value: string;
  onChangeValue(v: string);
  anoLectivo: string;
  allOption?: boolean;
}
const CourseSelect = ({
  onChangeValue,
  value,
  anoLectivo,
  allOption = false,
}: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const [allCursos, setAllCursos] = useState<Curso[]>([]);
  useEffect(() => {
    if (allOption) {
      setAllCursos([
        {
          codigo: "all",
          designacao: "Todos",
        } as any,
        ...cursos,
      ]);
    } else {
      setAllCursos(cursos);
    }
  }, [allOption, cursos]);
  return (
    <>
      <FormSelect
        label="Curso"
        value={value}
        disabled={!anoLectivo}
        loading={loadingCursos}
        onChange={(v) => onChangeValue(v)}
        options={allCursos}
        map={(c) => ({
          key: c.codigo.toString(),
          label: c.designacao,
          value: c.codigo.toString(),
        })}
      />
    </>
  );
};

export { CourseSelect };
