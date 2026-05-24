import { useId, useMemo } from "react";
import { useCursos } from "@/hooks/use-cursos";
import { CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
  value: string;
  labelMode?: "inside" | "outside";
  onChangeValue: (v: string) => void;
  params?: CursoParams;
  showLabel?: boolean;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  label?: string;
  enableDefaultSelectItem?: boolean;
  allowedIds?: string[]; // ← novo
}

const CourseSelect = ({
  disabled,
  onChangeValue,
  value,
  params,
  enableDefaultSelectItem,
  label = "Cursos",
  placeholder,
  width = "full",
  labelMode = "outside",
  showLabel = true,
  allowedIds, // ← novo
}: CourseSelectProps) => {
  const { data: cursos = [], isLoading: loadingCursos } = useCursos(params);
  const id = useId();

  const filteredCursos = useMemo(() => {
    if (!allowedIds || allowedIds.length === 0) return cursos;
    return cursos.filter((c) => allowedIds.includes(c.codigo.toString()));
  }, [cursos, allowedIds]);

  const defaultSelectItem = enableDefaultSelectItem
    ? [{ label: "Todos", value: "all", key: id }]
    : undefined;

  return (
    <FormCommandSelect
      disabled={disabled || loadingCursos}
      value={value}
      label={showLabel ? label : undefined}
      labelMode={labelMode}
      isLoading={loadingCursos}
      placeholder={placeholder}
      defaultSelectItem={defaultSelectItem}
      width={width}
      options={filteredCursos}
      map={(f) => ({
        key: f.codigo.toString(),
        value: f.codigo.toString(),
        label: f.designacao,
      })}
      onChange={(value) => onChangeValue(value)}
    />
  );
};

export { CourseSelect };
