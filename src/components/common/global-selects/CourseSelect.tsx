import { useEffect, useState } from "react";
import { useCursos } from "@/hooks/use-cursos";
import { Curso, CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  params?: CursoParams;
  allOption?: boolean;
}
const CourseSelect = ({
  onChangeValue,
  value,
  params,
  allOption = false,
}: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos(params);
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
      <FormCommandSelect
        disabled={loadingCursos}
        value={value}
        label="Curso"
        isLoading={loadingCursos}
        width="full"
        options={allCursos}
        map={(f) => ({
          key: f.codigo.toString(),
          value: f.codigo.toString(),
          label: f.designacao,
        })}
        onChange={(value) => onChangeValue(value)}
      />
    </>
  );
};

export { CourseSelect };
