import { useEffect, useState } from "react";
import { FormSelect } from "../FormSelect";
import { useCursos } from "@/hooks/use-cursos";
import { Curso } from "@/services/fetch-course";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  allOption?: boolean;
}
const CourseSelect = ({ onChangeValue, value }: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();

  return (
    <>
      <FormCommandSelect
        label="Curso"
        width="full"
        value={value}
        isLoading={loadingCursos}
        onChange={(v) => onChangeValue(v)}
        options={cursos}
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
