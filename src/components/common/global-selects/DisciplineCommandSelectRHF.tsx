import { Control, Path, useController } from "react-hook-form";

import { CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";

interface Props<TForm> {
  control: Control<TForm>;
  name: Path<TForm>;
  label?: string;
  labelMode?: "inside" | "outside";
  params?: CursoParams;
}

export function DisciplineCommandSelectRHF<TForm>({
  control,
  name,
  label = "Disciplina",
  labelMode = "outside",
  params,
}: Props<TForm>) {
  const { field } = useController({
    name,
    control,
  });

    const { data: disciplines = [], isLoading: isLoadingDisciplines } =
    useDisciplines();

  return (
    <FormCommandSelect
      label={label}
      labelMode={labelMode}
      value={field.value ? String(field.value) : undefined} // ✅ NORMALIZA
      disabled={isLoadingDisciplines}
      isLoading={isLoadingDisciplines}
      width="lg"
      options={disciplines}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.desginacao,
      })}
      onChange={(value) => field.onChange(value)} // value já é string
    />
  );
}
