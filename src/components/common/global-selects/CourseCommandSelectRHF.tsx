import { Control, Path, useController } from "react-hook-form";
import { useCursos } from "@/hooks/use-cursos";
import { CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

interface Props<TForm> {
  control: Control<TForm>;
  name: Path<TForm>;
  label?: string;
  labelMode?: "inside" | "outside";
  params?: CursoParams;
}

export function CourseCommandSelectRHF<TForm>({
  control,
  name,
  label = "Curso",
  labelMode = "outside",
  params,
}: Props<TForm>) {
  const { field } = useController({
    name,
    control,
  });

  const { data: cursos = [], isLoading } = useCursos(params);

  return (
    <FormCommandSelect
      label={label}
      labelMode={labelMode}
      value={field.value ? String(field.value) : undefined} // ✅ NORMALIZA
      disabled={isLoading}
      isLoading={isLoading}
      width="full"
      options={cursos}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.designacao,
      })}
      onChange={(value) => field.onChange(value)} // value já é string
    />
  );
}
