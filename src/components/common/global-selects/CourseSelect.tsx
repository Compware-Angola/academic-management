import { useEffect, useState } from "react";
import { useCursos } from "@/hooks/use-cursos";
import { Curso, CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
  value: string;
  labelMode?: "inside" | "outside"; // 👈 decisão sobe
  onChangeValue: (v: string) => void;
  params?: CursoParams;
}
const CourseSelect = ({
  onChangeValue,
  value,
  params,
  labelMode = "outside",
}: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos(params);

  return (
    <>
      <FormCommandSelect
        disabled={loadingCursos}
        value={value}
        label="Curso"
        labelMode={labelMode} // 👈 repassa decisão
        isLoading={loadingCursos}
        width="full"
        options={cursos}
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
