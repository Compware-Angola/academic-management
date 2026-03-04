import { useQueryDocenteCursos } from "@/hooks/docentes/use-docentes-curso";
import { FormCommandSelect } from "../FormCommandSelect";
import { DocenteCursoProps } from "@/services/docentes/docente-cursos.service";

interface DocenteCursoSelectProps {
  props: DocenteCursoProps;
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
}

export function DocenteCursoSelect({
  props,
  value,
  onChangeValue,
  labelMode = "outside",
}: DocenteCursoSelectProps) {
  const { data: cursos = [], isLoading } = useQueryDocenteCursos(props);
  const { anoLectivo, docenteId } = props;
  const disabled = !docenteId || isLoading || !anoLectivo;
  return (
    <FormCommandSelect
      disabled={disabled}
      value={value}
      label="Curso"
      labelMode={labelMode}
      isLoading={isLoading}
      width="full"
      options={cursos}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.designacao,
      })}
      onChange={onChangeValue}
    />
  );
}
