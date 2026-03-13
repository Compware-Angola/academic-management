import { useEffect, useId, useState } from "react";
import { useCursos } from "@/hooks/use-cursos";
import { Curso, CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
  value: string;
  labelMode?: "inside" | "outside"; // 👈 decisão sobe
  onChangeValue: (v: string) => void;
  params?: CursoParams;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}
const CourseSelect = ({
  disabled,
  onChangeValue,
  value,
  params,
  enableDefaultSelectItem,
  labelMode = "outside",
}: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos(params);
  const id = useId();
  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;
  return (
    <>
      <FormCommandSelect
        disabled={disabled || loadingCursos}
        value={value}
        label="Curso"
        labelMode={labelMode}
        isLoading={loadingCursos}
        defaultSelectItem={defaultSelectItem}
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
