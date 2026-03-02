import { useQueryDocenteCursos } from "@/hooks/docentes/use-docentes-curso";
import { FormCommandSelect } from "../FormCommandSelect";

interface DocenteCursoSelectProps {
  docenteId?: number;
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
}

export function DocenteCursoSelect({
  docenteId,
  value,
  onChangeValue,
  labelMode = "outside",
}: DocenteCursoSelectProps) {
  const { data: cursos = [], isLoading } = useQueryDocenteCursos(docenteId);

  return (
    <FormCommandSelect
      disabled={!docenteId || isLoading}
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
